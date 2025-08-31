import { numbers } from '@/constants/numbers';
import { getUserId, SB_STORAGE_CONFIG } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertButton,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { images } from '@/constants/images';
import { Comment } from '@/services/utils';
import { Link } from 'expo-router';

const COMMENTS_PAGE_SIZE = 15;
const REPLIES_PAGE_SIZE = 8;



interface CommentsModalProps {
  visible: boolean;
  comments: Comment[];
  postOwnerId: string;
  onClose: () => void;
  onPostComment: (text: string, parent?: Comment) => void;
  onDeleteComment: (id: string) => void;
  onBlockPersonFromCommenting: (person_id: string) => void;
}

const timeSince = (timestamp: Date) => {
  const now = Date.now();
  const secondsPast = Math.floor((now - timestamp.getTime()) / 1000);

  if (secondsPast < 60) return `${secondsPast}s ago`;
  if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)}m ago`;
  if (secondsPast < 86400) return `${Math.floor(secondsPast / 3600)}h ago`;
  if (secondsPast < 2592000) return `${Math.floor(secondsPast / 86400)}d ago`;
  return `${Math.floor(secondsPast / 2592000)}mo ago`;
};

const CommentItem = ({
  onClose,
  comment,
  replies,
  onReply,
  currentUserId,
  postOwnerId,
  onDelete,
  onBlock,
  showMoreReplies,
  onShowMoreReplies,
  totalReplies,
  isExpanded,
  onHideReplies,
}: {
  onClose: () => void;
  comment: Comment;
  replies: Comment[];
  onReply: (c: Comment) => void;
  currentUserId: string;
  postOwnerId: string;
  onDelete: (id: string) => void;
  onBlock: (person_id: string) => void;
  showMoreReplies: boolean;
  onShowMoreReplies: () => void;
  totalReplies: number;
  isExpanded: boolean;
  onHideReplies: () => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>('');

  useEffect(() => {
    const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${comment.authorId}.jpg`;
    //const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
    Image.prefetch(profilePicUrl)
      .then(() => setImageUrl(profilePicUrl))
      .catch(() => setImageUrl(null));
  }, [comment.authorId]);

  const handleLongPress = () => {
    const isOwnComment = comment.authorId === currentUserId;
    const isPostOwner = postOwnerId === currentUserId;
    const isOtherUser = comment.authorId !== currentUserId;

    if (isOwnComment || isPostOwner) {
      const actions: AlertButton[] = [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(comment.id),
        },
      ];

      if (isPostOwner && isOtherUser) {
        actions.push({
          text: 'Block user from commenting in future',
          style: 'cancel',
          onPress: () => onBlock(comment.authorId),
        });
      }

      Alert.alert('Comment Options', 'Choose an action:', actions);
    }
  };

  return (
    <View style={{ marginBottom: 10, paddingRight: 10 }}>
      <TouchableOpacity onLongPress={handleLongPress} delayLongPress={300}>
        <View style={{ flexDirection: 'row' }}>
          <Link href={`/profiles/${comment.authorId}`} asChild>
            <Pressable onPress={onClose}>
              {imageUrl ?
              <Image source={{ uri: imageUrl }} style={styles.avatar} />
              : <Image source={images.blankProfileName} style={styles.avatar} />}
            </Pressable>
          </Link>
          <View style={styles.commentContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.author}>{comment.author}</Text>
              <Text style={styles.timeText}> • {timeSince(comment.timeCreated)}</Text>
            </View>
            <Text>{comment.content}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ marginLeft: 24, marginTop: 3 }}>
        {replies.map((reply) => (
          <ReplyItem
            onClose={onClose}
            key={reply.id}
            reply={reply}
            currentUserId={currentUserId}
            postOwnerId={postOwnerId}
            onDelete={onDelete}
          />
        ))}

        {showMoreReplies && (totalReplies - replies.length > 0) && (
          <TouchableOpacity onPress={onShowMoreReplies}>
            <Text style={{ color: '#888888', fontSize: 13, marginTop: 4, marginLeft: 35 }}>
              Show more replies ({totalReplies - replies.length})
            </Text>
          </TouchableOpacity>
        )}
        {isExpanded && (totalReplies > REPLIES_PAGE_SIZE) && (
          <TouchableOpacity onPress={onHideReplies}>
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


const ReplyItem = ({
  onClose,
  reply,
  currentUserId,
  postOwnerId,
  onDelete,
}: {
  onClose: () => void;
  reply: Comment;
  currentUserId: string;
  postOwnerId: string;
  onDelete: (id: string) => void;
}) => {
  const [replyImageUrl, setReplyImageUrl] = useState<string | null>('');

  useEffect(() => {
    const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${reply.authorId}.jpg`;
    //const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
    Image.prefetch(profilePicUrl)
      .then(() => setReplyImageUrl(profilePicUrl))
      .catch(() => setReplyImageUrl(null));
  }, [reply.authorId]);

  const handleLongPress = () => {
    if (reply.authorId === currentUserId || postOwnerId === currentUserId) {
      Alert.alert('Delete Reply', 'Are you sure you want to delete this reply?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(reply.id) },
      ]);
    }
  };

  return (
    <TouchableOpacity onLongPress={handleLongPress} delayLongPress={300}>
      <View style={styles.replyContainer}>
        <Link href={`/profiles/${reply.authorId}`} asChild>
          <Pressable onPress={onClose}>
            {replyImageUrl ?
            <Image source={{ uri: replyImageUrl }} style={styles.avatarSmall} />
            : <Image source={images.blankProfileName} style={styles.avatarSmall} />}
          </Pressable>
        </Link>
        <View style={styles.replyContent}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.author}>{reply.author}</Text>
            <Text style={styles.timeText}> • {timeSince(reply.timeCreated)}</Text>
          </View>
          <Text>{reply.content}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};



interface ReplyState {
  [commentId: string]: number; // commentId -> number of replies shown
}

export default function CommentsModal({
  visible,
  comments,
  onClose,
  onPostComment,
  postOwnerId,
  onDeleteComment,
  onBlockPersonFromCommenting,
}: CommentsModalProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [commentsToShow, setCommentsToShow] = useState(COMMENTS_PAGE_SIZE);
  const [replyPages, setReplyPages] = useState<ReplyState>(() => {
    const initial: ReplyState = {};
    comments.forEach((c) => {
      if (c.parentId) {
        initial[c.parentId] = 1; // initialize each parentId to 1 reply
      }
    });
    return initial;
  });

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});


  useEffect(() => {
    getUserId().then((res) => setCurrentUserId(res[0]));
  }, []);

  const sortedComments = comments;
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
        const userId = await getUserId().then((value) => value[0]);
        const profilePicUrl = `${SB_STORAGE_CONFIG.BASE_URL}${userId}.jpg`;
        await Image.prefetch(profilePicUrl);
        setImageUrl(profilePicUrl);
      } catch {
        //const defaultPicUrl = `${SB_STORAGE_CONFIG.BASE_URL}blank-profile-pic.jpg`;
        setImageUrl(null);
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

  const handleShowMoreReplies = (commentId: string) => {
    setReplyPages((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || REPLIES_PAGE_SIZE) + REPLIES_PAGE_SIZE,
    }));
    setExpandedComments((prev) => ({ ...prev, [commentId]: true }));
  };

  const handleHideReplies = (commentId: string) => {
    setReplyPages((prev) => ({ ...prev, [commentId]: 1 }));
    setExpandedComments((prev) => ({ ...prev, [commentId]: false }));
  };




  const renderComment = ({ item }: { item: Comment }) => {
    const replies = repliesByParent[item.id] || [];
    const shownCount = replyPages[item.id] || REPLIES_PAGE_SIZE;
    const shownReplies = replies.slice(0, shownCount);
    const hasMoreReplies = shownCount < replies.length;
    const isExpanded = expandedComments[item.id] ?? false;

    return (
      <CommentItem
        onClose={onClose}
        comment={item}
        replies={shownReplies}
        totalReplies={replies.length}
        showMoreReplies={hasMoreReplies}
        onShowMoreReplies={() => handleShowMoreReplies(item.id)}
        onHideReplies={() => handleHideReplies(item.id)}
        isExpanded={isExpanded}
        onReply={setReplyTo}
        currentUserId={currentUserId}
        postOwnerId={postOwnerId}
        onDelete={onDeleteComment}
        onBlock={onBlockPersonFromCommenting}
      />
    );
  };


  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      style={styles.modal}
      propagateSwipe
    >
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
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
            data={topLevelComments.slice(0, commentsToShow)}
            keyExtractor={(item) => item.id}
            renderItem={renderComment}
            onEndReached={() => {
              if (commentsToShow < topLevelComments.length) {
                setCommentsToShow((prev) => prev + COMMENTS_PAGE_SIZE);
              }
            }}
            onEndReachedThreshold={0.5}
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
          {imageUrl ?
          <Image source={{ uri: imageUrl }} style={styles.avatar} /> :
          <Image source={images.blankProfileName} style={styles.avatar} />}
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
    maxHeight: '80%',
    minHeight: '60%'
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
