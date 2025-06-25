import { postDetails } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface PostActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onArchiveToggle: () => void;
  isArchived: boolean;
  post: postDetails;
}

const PostActionsModal = ({
  visible,
  onClose,
  onDelete,
  onArchiveToggle,
  post
}: PostActionsModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(0); // 0 = no, 1 = first tap, 2 = irreversible warning

  const handleDeletePress = () => {
    if (confirmDelete === 0) {
      setConfirmDelete(1);
    } else if (confirmDelete === 1) {
      setConfirmDelete(2);
    }
  };

  const handleFinalDelete = () => {
    onDelete();
    setConfirmDelete(0);
    onClose();
  };

  const handleClose = () => {
    setConfirmDelete(0);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <View className="bg-white w-[85%] rounded-2xl p-5 shadow-lg shadow-black">
          {/* Header */}
          <View className="flex flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-black">Post Options</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Archive / Unarchive */}
          <TouchableOpacity
            onPress={() => {
              onArchiveToggle();
              handleClose();
            }}
            className="py-3 border-b border-gray-300"
          >
            <Text className="text-base text-black">
              {post.archived ? 'Unarchive Post' : 'Archive Post'}
            </Text>
          </TouchableOpacity>

          {/* Delete Flow */}
          {confirmDelete < 2 ? (
            <TouchableOpacity onPress={handleDeletePress} className="py-3">
              <Text className={`text-base ${confirmDelete > 0 ? 'text-red-600 font-bold' : 'text-black'}`}>
                {confirmDelete === 0
                  ? 'Delete Post'
                  : 'Are you sure? Tap again to continue.'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text className="text-sm text-red-500 mt-2 mb-3">
                This action is irreversible. Are you sure you want to proceed?
              </Text>
              <TouchableOpacity onPress={handleFinalDelete} className="py-2">
                <Text className="text-base text-red-600 font-bold ">
                  Yes, delete
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PostActionsModal;
