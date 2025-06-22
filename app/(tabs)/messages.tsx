import CommentsModal from '@/components/CommentsModal';
import { getUserId } from '@/services/api';
import { addDays } from 'date-fns';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const messages = () => {
  const [showComments, setShowComments] = useState(true);


const commentData = [
  {
    id: "1",
    author: "Alice Johnson",
    content: "This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature! This is such a cool feature!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    timeCreated: new Date(Date.now())
  },
  {
    id: "2",
    author: "Bob Smith",
    content: "I agree with Alice. Super smooth UI.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    timeCreated: addDays(Date.now(),-2)
  },
  {
    id: "3",
    author: "Charlie Tran",
    content: "How do I enable this on my profile?",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    timeCreated: addDays(Date.now(),-3)
  },
  {
    id: "4",
    author: "Diana Lee",
    content: "Just go to settings > features and toggle it on.",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    parentId: "3", // reply to Charlie
    timeCreated: addDays(Date.now(),-5)
  },
  {
    id: "5",
    author: "Emily Chen",
    content: "This comment thread is great!",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    timeCreated: addDays(Date.now(),-4)
  },
  {
    id: "6",
    author: "Bob Smith",
    content: "Thanks Diana! That worked perfectly.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    parentId: "3", // not allowed as reply to a reply, so ignore this one
    timeCreated: addDays(Date.now(),-2)
  },
];
const [comment, setComment]=useState(commentData)

  const userId = getUserId();

  return (
    <View>
      <Text>messages</Text>
      <CommentsModal
  visible={showComments}
  comments={comment}
  onClose={() => setShowComments(false)}
  onPostComment={async (text, parentId) => {
      
    const newComment = {
    id: await userId,
    author: await userId,
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
  currentUserAvatar={"https://randomuser.me/api/portraits/men/2.jpg"}
/>

    </View>
  )
}

export default messages