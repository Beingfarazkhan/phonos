import { createTool } from "@convex-dev/agent";
import {z} from 'zod'
import { supportAgent } from "../agents/supportAgent";
import { internal } from "../../../_generated/api";

export const escalateConversationTool = createTool({
  description:"Escalate a conversation.",
  args: z.object({}),
  handler: async(ctx)=>{
    if(!ctx.threadId){
      return "Missing Thread ID."
    }

    await ctx.runMutation(internal.system.conversations.escalated, {
      threadId: ctx.threadId
    })

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message:{
        role: "assistant",
        content: "Conversation escalated to a human operator."
      }
    })

    // return "Conversation escalated to a human operator"
  }
})