import {VapiClient, Vapi} from '@vapi-ai/server-sdk'
import { action } from '../_generated/server'
import { ConvexError } from 'convex/values'
import { internal } from '../_generated/api'
import { getSecretValue, parseSecretString } from '../lib/secrets'


export const getPhoneNumbers = action({
  args:{

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

    const plugin = await ctx.runQuery(internal.system.plugins.getByOrganizationIdAndService, {
      organizationId: orgId,
      service: "vapi"
    })

    if(!plugin){
      throw new ConvexError({
        code:'NOT_FOUND',
        message: 'Plugin Not Found!'
      })
    }
    
    const secretName = plugin.secretName
    const secret = await getSecretValue(secretName)
    
    const secretValue = parseSecretString<{
      publicApiKey: string,
      privateApiKey: string
    }>(secret)
    
    if(!secretValue){
      throw new ConvexError({
        code:'NOT_FOUND',
        message: 'Secret Not Found!'
      })
    }

    if(!secretValue.publicApiKey || !secretValue.privateApiKey){
      throw new ConvexError({
        code:'NOT_FOUND',
        message: 'Incomplete Secret, reconnect your vapi account!'
      })
    }

    const vapiClient = new VapiClient({
      token: secretValue.privateApiKey
    })


    const phoneNumbers = await vapiClient.phoneNumbers.list()

    return phoneNumbers
  }
})

export const getAssistants = action({
  args:{

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

    const plugin = await ctx.runQuery(internal.system.plugins.getByOrganizationIdAndService, {
      organizationId: orgId,
      service: "vapi"
    })

    if(!plugin){
      throw new ConvexError({
        code:'NOT_FOUND',
        message: 'Plugin Not Found!'
      })
    }
    
    const secretName = plugin.secretName
    const secret = await getSecretValue(secretName)
    
    const secretValue = parseSecretString<{
      publicApiKey: string,
      privateApiKey: string
    }>(secret)
    
    if(!secretValue){
      throw new ConvexError({
        code:'NOT_FOUND',
        message: 'Secret Not Found!'
      })
    }

    if(!secretValue.publicApiKey || !secretValue.privateApiKey){
      throw new ConvexError({
        code:'NOT_FOUND',
        message: 'Incomplete Secret, reconnect your vapi account!'
      })
    }

    const vapiClient = new VapiClient({
      token: secretValue.privateApiKey
    })


    const assistants = await vapiClient.assistants.list()

    return assistants
  }
})
