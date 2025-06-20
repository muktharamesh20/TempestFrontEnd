// app/index.tsx
import { supabase } from '@/constants/supabaseClient'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)/home')
      } else {
        router.replace('/(login)/login')
      }
    })
  }, [])

  return null
}
