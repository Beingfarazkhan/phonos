import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { components, internal } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import {generateText} from 'ai'
import {google} from '@ai-sdk/google'
import { OPERATOR_MESSAGE_ENHANCEMENT_PROMPT } from "../system/ai/constants";


export const enhanceResponse = action({
    args:{
        prompt: v.string()
    },
    handler: async(ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()
        
        // Checking user existence
        if(identity===null){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"User Not Found!"
            })
        }

        const orgId = identity.orgId as string

        if(!orgId){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Organization Not Found!"
            })
        }

        const response = await generateText({
            model: google.languageModel('gemini-2.5-flash'),
            messages:[
                {
                    role: "system",
                    content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT
                },
                {
                    role: "user",
                    content: args.prompt
                }
            ]
        })

        return response.text

    }
})

export const create = mutation({
    args:{
        prompt: v.string(),
        conversationId: v.id("conversations")
    },
    handler: async(ctx, args)=>{

        const identity = await ctx.auth.getUserIdentity()
        
        // Checking user existence
        if(identity===null){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"User Not Found!"
            })
        }

        const orgId = identity.orgId as string

        if(!orgId){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Organization Not Found!"
            })
        }

        const conversation = await ctx.db.get(args.conversationId)

        if(!conversation){
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found."
            })
        }

        if(conversation.organizationId!==orgId){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Invalid Organization!"
            })
        }

        if(conversation.status==="resolved"){
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation already resolved."
            })
        }

        if(conversation.status==="unresolved"){
            await ctx.db.patch(args.conversationId, {status:"escalated"})
        }

        // TODO: Implement subscription check
        await saveMessage(ctx, components.agent,
            {
                threadId: conversation.threadId,
                agentName: identity.familyName,
                message:{
                    role: "assistant",
                    content: args.prompt
                }
            }
        )
    }
})

export const getMany = query({
    args:{
        threadId : v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async(ctx, args)=>{
        const identity = await ctx.auth.getUserIdentity()
        
        // Checking user existence
        if(identity===null){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"User Not Found!"
            })
        }

        const orgId = identity.orgId as string

        if(!orgId){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Organization Not Found!"
            })
        }

        const conversation = await
            ctx.db.query("conversations")
                  .withIndex("by_thread_id", (q)=>q.eq("threadId", args.threadId))
                  .unique()

        if(!conversation){
            throw new ConvexError({
                code: "NOT_FOUND",
                message:"Conversation Not Found!"
            })
        }

        if(conversation.organizationId !== orgId){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Invalid Organization!"
            })
        }

        const paginated = supportAgent.listMessages(ctx,{
            threadId: args.threadId,
            paginationOpts: args.paginationOpts,
            excludeToolMessages:true
        })

        return paginated

    }
})