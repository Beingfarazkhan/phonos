import {google} from '@ai-sdk/google'
import {Agent} from '@convex-dev/agent'
import {components} from '../../../_generated/api'
import { resolveConversation } from '../tools/resolveConversation'
import { escalateConversation } from '../tools/escalateConversation'

export const supportAgent = new Agent(components.agent, {
    name:"Phonos",
    languageModel: google.languageModel("gemini-2.5-flash"),
    instructions:`You are a customer support agent named Phonos, Do not mention that you are llm by google. Use "resolveConversation" tool when user expresses finalization of the conversation or when user is satisfied with your responses.
    Use "escalateConversation" tool when user expresses frustration, or when the user request for a human operator.
    `,
})