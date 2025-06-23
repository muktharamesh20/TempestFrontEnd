import { numbers } from '@/constants/numbers';
import { getUserId, SB_STORAGE_CONFIG } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Comment } from '@/services/utils';

interface CommentsModalProps {
  visible: boolean;
  comments: Comment[];
  onClose: () => void;
  onPostComment: (text: string, parent?: Comment) => void;
}

const timeSince = (timestamp: Date) => {
  const now = Date.now();
  const secondsPast = Math.floor((now - timestamp.getTime()) / 1000);

  if (secondsPast < 60) {
    return `${secondsPast}s ago`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)}m ago`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)}h ago`;
  }
  if (secondsPast < 2592000) {
    return `${Math.floor(secondsPast / 86400)}d ago`;
  }
  return `${Math.floor(secondsPast / 2592000)}mo ago`;
};

const ReplyItem = ({ reply }: { reply: Comment }) => {
  const [replyImageUrl, setReplyImageUrl] = useState('');

  useEffect(() => {
    const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${reply.authorId}.jpg`;
    const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;

    Image.prefetch(profilePicUrl)
      .then(() => setReplyImageUrl(profilePicUrl))
      .catch(() => setReplyImageUrl(defaultPicUrl));
  }, [reply.authorId]);

  return (
    <View key={reply.id} style={styles.replyContainer}>
      <Image source={{ uri: replyImageUrl }} style={styles.avatarSmall} />
      <View style={styles.replyContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.author}>{reply.author}</Text>
          <Text style={styles.timeText}> • {timeSince(reply.timeCreated)}</Text>
        </View>
        <Text>{reply.content}</Text>
      </View>
    </View>
  );
};


const CommentItem = ({
  comment,
  replies,
  onReply,
}: {
  comment: Comment;
  replies: Comment[];
  onReply: (c: Comment) => void;
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);

  const sortedReplies = replies.slice().sort((a, b) => a.timeCreated.getTime() - b.timeCreated.getTime());
  const [imageUrl, setImageUrl] = useState('');

  const displayedReplies = showAllReplies ? sortedReplies : sortedReplies.slice(0, 1);
  const hasMoreReplies = sortedReplies.length > 1;

  useEffect(() => {
    const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${comment.authorId}.jpg`;
    const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;

    // Check if the profile picture exists
    Image.prefetch(profilePicUrl)
      .then(() => setImageUrl(profilePicUrl)) // If it exists, use it
      .catch(() => setImageUrl(defaultPicUrl)); // Otherwise, use the default
  }, [comment.authorId]);

  return (
    <View style={{ marginBottom: 10, paddingRight: 10}}>
      {/* Main Comment */}
      <View style={{ flexDirection: 'row' }}>
        <Image source={{ uri: imageUrl }} style={styles.avatar} />
        <View style={styles.commentContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.author}>{comment.author}</Text>
            <Text style={styles.timeText}> • {timeSince(comment.timeCreated)}</Text>
          </View>
          <Text>{comment.content}</Text>
        </View>
      </View>

      {/* Replies */}
      <View style={{ marginLeft: 24, marginTop: 3 }}>
      {displayedReplies.map((reply) => (
  <ReplyItem key={reply.id} reply={reply} />
))}



        {hasMoreReplies && !showAllReplies && (
          <TouchableOpacity onPress={() => setShowAllReplies(true)}>
            <Text style={{ color: '#888888', fontSize: 13, marginTop: 4, marginLeft: 35 }}>
              Show more replies ({sortedReplies.length - 1})
            </Text>
          </TouchableOpacity>
        )}

        {hasMoreReplies && showAllReplies && (
          <TouchableOpacity onPress={() => setShowAllReplies(false)}>
            <Text style={{ color: '#888888', fontSize: 13, marginTop: 4, marginLeft: 35 }}>
              Hide replies
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', marginTop: replies.length === 0 ? -8 : 0 }}>
          <TouchableOpacity onPress={() => onReply(comment)} style={{ marginLeft: replies.length === 0 ? 22 : 35 }}>
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function CommentsModal({
  visible,
  comments,
  onClose,
  onPostComment,
}: CommentsModalProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const sortedComments = comments //.slice().sort((a, b) => a.timeCreated - b.timeCreated);

  const topLevelComments = sortedComments.filter((c) => !c.parentId);
  const repliesByParent = sortedComments.reduce<Record<string, Comment[]>>((acc, comment) => {
    if (comment.parentId) {
      acc[comment.parentId] = acc[comment.parentId] || [];
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {});

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const userId = await getUserId().then((value) => value[0]);;
        const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${userId}.jpg`;
        await Image.prefetch(profilePicUrl);
        setImageUrl(profilePicUrl);
      } catch {
        const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
        setImageUrl(defaultPicUrl);
      }
    };
  
    fetchProfilePic();
  }, []);
  

  const handlePost = () => {
    if (text.trim()) {
      onPostComment(text, replyTo ?? undefined);
      setText('');
      setReplyTo(null);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
    //   swipeDirection="down"
      onBackdropPress={onClose}
      style={styles.modal}
      propagateSwipe
    >
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        {/* <View style={styles.dragHandle} /> */}
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.title}>Comments</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {topLevelComments.length === 0 ? (
          <Text style={styles.emptyText}>No comments yet.</Text>
        ) : (
          <FlatList
            data={topLevelComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CommentItem comment={item} replies={repliesByParent[item.id] || []} onReply={setReplyTo} />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        {replyTo && (
          <View style={styles.replyingTo}>
            <Text style={styles.replyingText}>Replying to {replyTo.author}</Text>
            <TouchableOpacity onPress={() => setReplyTo(null)}>
              <Ionicons name="close" size={18} color="#555" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          <Image source={{ uri: imageUrl }} style={styles.avatar} />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={replyTo ? 'Write a reply...' : 'Write a comment...'}
            placeholderTextColor={'grey'}
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={handlePost} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#888888" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: numbers.primaryColor,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    maxHeight: '90%',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 20
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  replyText: {
    color: '#888888',
    fontWeight: '600',
    marginTop: 4,
    fontSize: 13,
  },
  replyContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 0,
  },
  replyContent: {
    marginLeft: 8,
    flex: 1,
  },
  author: {
    fontWeight: '600',
    marginBottom: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  replyingTo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 6,
    marginVertical: 6,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  replyingText: {
    fontSize: 14,
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    maxHeight: 140,
    fontSize: 15,
    backgroundColor: numbers.primaryColor,
    color: numbers.secondaryColor,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sendButton: {
    paddingHorizontal: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});
