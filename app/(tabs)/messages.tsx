import CommentsModal from '@/components/CommentsModal';
import { getUserId } from '@/services/api';
import { generateUUID } from '@/services/utils';
import { addDays } from 'date-fns';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

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
      timeCreated: addDays(Date.now(),-2)
    },
    {
      id: "3",
      authorId: '1',
      author: "Charlie Tran",
      content: "How do I enable this on my profile?",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      timeCreated: addDays(Date.now(),-3)
    },
    {
      id: "4",
      authorId: '1',
      author: "Diana Lee",
      content: "Just go to settings > features and toggle it on.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      parentId: "3", // reply to Charlie
      timeCreated: addDays(Date.now(),-5)
    },
    {
      id: "5",
      authorId: '1',
      author: "Emily Chen",
      content: "This comment thread is great!",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      timeCreated: addDays(Date.now(),-4)
    },
    {
      id: "6",
      authorId: '1',
      author: "Bob Smith",
      content: "Thanks Diana! That worked perfectly.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      parentId: "3", // not allowed as reply to a reply, so ignore this one
      timeCreated: addDays(Date.now(),-2)
    },
  ];

const [comment, setComment]=useState(commentData)

  const userId = getUserId().then((value) => value[0]);;

  return (
    <View>
      <Text>messages</Text>
      <CommentsModal
  visible={showComments}
  comments={comment}
  onClose={() => setShowComments(false)}
  onPostComment={async (text, parentId) => {
      
    const newComment = {
    id: generateUUID(),
    author: await userId,
    authorId: await userId,
    content: text,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    parentId: parentId?.id,
    timeCreated: new Date(Date.now())}

    setComment([...comment, newComment])
  
    if (parentId) {
      // post reply logic
    } else {
      // post top-level comment logic
    }
  }}
/>

    </View>
  )
}

export default messages