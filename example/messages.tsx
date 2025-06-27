import Avatar from '@/components/supabaseAvatar';
import { supabase } from '@/constants/supabaseClient';
import { resetUserId } from '@/services/api';
import { addDays } from 'date-fns';
import React, { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

const messages = () => {
  const [showComments, setShowComments] = useState(true);

  const commentData = [
    {
      id: "1",
      author: "Alice Johnson",
      authorId: '1',
      content: "This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature!",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      timeCreated: new Date(Date.now())
    },
    {
      id: "2",
      authorId: '1',
      author: "Bob Smith",
      content: "I agree with Alice. Super smooth UI.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      timeCreated: addDays(Date.now(), -2)
    },
    {
      id: "3",
      authorId: '1',
      author: "Charlie Tran",
      content: "How do I enable this on my profile?",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      timeCreated: addDays(Date.now(), -3)
    },
    {
      id: "4",
      authorId: '1',
      author: "Diana Lee",
      content: "Just go to settings > features and toggle it on.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      parentId: "3", // reply to Charlie
      timeCreated: addDays(Date.now(), -5)
    },
    {
      id: "5",
      authorId: '1',
      author: "Emily Chen",
      content: "This comment thread is great!",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      timeCreated: addDays(Date.now(), -4)
    },
    {
      id: "6",
      authorId: '1',
      author: "Bob Smith",
      content: "Thanks Diana! That worked perfectly.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      parentId: "3", // not allowed as reply to a reply, so ignore this one
      timeCreated: addDays(Date.now(), -2)
    },
  ];

  const [comment, setComment] = useState(commentData)
  const [userIdAvatar, setUserId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUserId = async () => {
      const response = await supabase.auth.getUser()
      setUserId(response.data.user?.id ?? null)
    }
    fetchUserId()
  }, [])

  return (
    <View>
      <Text>messages</Text>

      <Avatar
        size={100}
        url={userIdAvatar}
        onUpload={(url: string) => console.log('Avatar uploaded:', url)}
      />
      <Button title="Sign Out" onPress={handleSignOut} />

    </View>
  )
}

const handleSignOut = async () => {
  console.log("here")
  await resetUserId();
  const { error } = await supabase.auth.signOut()
  console.log("also here")
  if (error) {
    Alert.alert('Sign out error', error.message)
  } else {
    Alert.alert('Signed out', 'You have been signed out.')
  }
}

export default messages