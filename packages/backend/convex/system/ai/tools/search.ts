import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import { supportAgent } from "../agents/supportAgent";
import rag from "../rag";
import z from "zod";
import { ConvexError } from "convex/values";
import { internal } from "../../../_generated/api";

export const searchTool = createTool({
  description: 'Search the knowledge base for relevant information to help answer user questions',
  args: z.object({
    query: z
            .string()
            .describe('The search query to find relevant information.')
  }),
  handler: async(ctx, args)=>{
    if(!ctx.threadId){
      return 'Missing Thread ID.'
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: ctx.threadId
      }
    )

    if(!conversation){
      return 'Conversation not found.'
    }

    const orgId = conversation.organizationId

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit:5
    })

    // console.log('Search results \n', searchResult)
    
    const contextText = `Found results in ${
      searchResult.entries
      .map((e)=>e.title || null)
      .filter((t) => t!==null)
      .join(", ")
    }. Here is the context:\n\n${searchResult.text}`
    
    // console.log('Context Text \n', contextText)
    
    const response = await generateText({
      messages:[
        {
          role: "system",
          content: `You interpret knowledge base search results and provide helpful, accurate answers to users questions and format them well.`
        },
        {
          role: "user",
          content: `User asked: "${args.query}"\n\nSearch results: ${contextText}`
        }
      ],
      model: google('gemini-2.5-flash')
    })

    // console.log('AI response \n', response.text)

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text
      },
    })

    return response.text

  }
}) 
