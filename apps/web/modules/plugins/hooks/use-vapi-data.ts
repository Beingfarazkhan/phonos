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
    let cancelled = false

    const fetchData = async () =>{
      try {
        setIsLoading(true)
        const result = await getPhoneNumbers()
        if (cancelled){
          return
        }
        setData(result)
        setError(null)
      } catch (error) {
        if (cancelled){
          return
        }
        setError(error as Error)
        toast.error('Failed to fetch phone numbers.')
      } finally {
        if (!cancelled){
          setIsLoading(false)
        }
        
      }
    }

    fetchData()

    return ()=>{
      cancelled = true
    }


  }, [])

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
    let cancelled = false

    const fetchData = async () =>{
      try {
        setIsLoading(true)
        const result = await getAssistants()
        if (cancelled){
          return
        }
        setData(result)
        setError(null)
      } catch (error) {
        if (cancelled){
          return
        }
        setError(error as Error)
        toast.error('Failed to fetch assistants.')
      } finally {
        if (!cancelled){
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return ()=>{
      cancelled = true
    }

  }, [])

  return {data, error, isLoading}

}