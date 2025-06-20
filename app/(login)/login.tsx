import Auth from '@/components/supabaseAuth'
import Avatar from '@/components/supabaseAvatar'
import { supabase } from '@/constants/supabaseClient'
import React from 'react'
import { View } from 'react-native'

const login = () => {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserId = async () => {
      const response = await supabase.auth.getUser();
      setUserId(response.data.user?.id ?? null);
    };
    fetchUserId();
  }, []);

  return (
    <View>
      <Auth />
      <Avatar 
        size={100} 
        url={userId}
        onUpload={(url: string) => console.log('Avatar uploaded:', url)} 
      />
    </View>
  )
}

export default login