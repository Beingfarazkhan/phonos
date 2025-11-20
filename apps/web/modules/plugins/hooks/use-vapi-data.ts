import { api } from "@workspace/backend/_generated/api"
import { useAction } from "convex/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"


type PhoneNumberType = typeof api.private.vapi.getPhoneNumbers._returnType
type AssistantsType = typeof api.private.vapi.getAssistants._returnType

export const useVapiPhoneNumbers = ():{
  data: PhoneNumberType,
  isLoading: boolean,
  error: Error | null
} =>{
  const [data, setData] = useState<PhoneNumberType>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers)

  useEffect(()=>{
    const fetchData = async () =>{
      try {
        setIsLoading(true)
        const result = await getPhoneNumbers()
        setData(result)
        setError(null)
      } catch (error) {
        setError(error as Error)
        toast.error('Failed to fetch phone numbers.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

  }, [getPhoneNumbers])

  return {data, error, isLoading}

}

export const useVapiAssistants = ():{
  data: AssistantsType,
  isLoading: boolean,
  error: Error | null
} =>{
  const [data, setData] = useState<AssistantsType>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const getAssistants = useAction(api.private.vapi.getAssistants)

  useEffect(()=>{
    const fetchData = async () =>{
      try {
        setIsLoading(true)
        const result = await getAssistants()
        setData(result)
        setError(null)
      } catch (error) {
        setError(error as Error)
        toast.error('Failed to fetch assistants.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

  }, [getAssistants])

  return {data, error, isLoading}

}