import {ConvexError, v} from 'convex/values'
import { mutation, query } from '../_generated/server'
import { supportAgent } from '../system/ai/agents/supportAgent';
import { saveMessage } from '@convex-dev/agent';
import { components } from '../_generated/api';


export const getOne = query({
    args:{
        conversationId : v.id("conversations"),
        contactSessionId : v.id("contactSessions")
    },
    handler: async (ctx, args)=>{
         const session = await ctx.db.get(args.contactSessionId);
        
        // Checking session existence
        if(!session || session.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Invalid Session!"
            })
        }

        const conversation = await ctx.db.get(args.conversationId)

        if(!conversation){
            throw new ConvexError({
                code: "NOT FOUND",
                message:"Conversation Not Found!"
            })
        }

        if(conversation.contactSessionId !== session._id){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Conversation does not belong to this session!"
            })
        }

        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId
        }
    }
})

export const create = mutation({
    args:{
        organizationId : v.string(),
        contactSessionId : v.id("contactSessions")
    },
    handler: async (ctx, args) =>{
        const session = await ctx.db.get(args.contactSessionId);
        
        // Checking session existence
        if(!session || session.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message:"Invalid Session!"
            })
        }

        const {threadId} = await supportAgent.createThread(ctx, {
            userId: args.organizationId
        })

        await saveMessage(ctx, components.agent, {
            threadId,
            message:{
                role:"assistant",
                content:"Hello, how can i help you today?"
            }
        })

        const conversationId = await ctx.db.insert("conversations", {
            threadId,
            organizationId: args.organizationId,
            contactSessionId: args.contactSessionId,
            status:"unresolved"
        })

        return {conversationId}
        
    }
})