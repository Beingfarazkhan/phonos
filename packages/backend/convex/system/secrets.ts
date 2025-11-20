import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";
import { getSecretValue, upsertSecret } from "../lib/secrets";


export const upsert = internalAction({
  args:{
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any()
  },
  handler: async(ctx, args)=>{
     const secretName = `tenant_${args.organizationId}_${args.service}`

     await upsertSecret(secretName, args.value)

     await ctx.runMutation(internal.system.plugins.upsert, {
      organizationId: args.organizationId,
      secretName: secretName,
      service: args.service
     })

     return { status: 'success'}
  }
})

export const getSecret = internalAction({
  args:{
    secretName: v.string(),
  },
  handler: async(ctx, args)=>{
    
     const secret = await getSecretValue(args.secretName)
     if (secret) {
      return secret
     }else{
       return { status: 'failed'}
      }
  }
})