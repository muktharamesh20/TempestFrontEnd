import Auth from '@/components/supabaseAuth'
import Avatar from '@/components/supabaseAvatar'
import { supabase } from '@/constants/supabaseClient'
import React from 'react'
import { Alert, Button, View } from 'react-native'

const myProfile = () => {
  const [userId, setUserId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserId = async () => {
      const response = await supabase.auth.getUser()
      setUserId(response.data.user?.id ?? null)
    }
    fetchUserId()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert('Sign out error', error.message)
    } else {
      Alert.alert('Signed out', 'You have been signed out.')
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Auth />
      <Avatar 
        size={100} 
        url={userId}
        onUpload={(url: string) => console.log('Avatar uploaded:', url)} 
      />
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  )
}

export default myProfile
