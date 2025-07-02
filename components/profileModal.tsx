import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface UserActionsModalProps {
  visible: boolean;
  onClose: () => void;
  isSelf: boolean;
  onUnfollow?: () => void;
  onRemoveCloseFriend?: () => void;
  onRemoveFollower?: () => void;
  onBlockCommenting?: () => void;
  onUnblockCommenting?: () => void;
  onSettingsPress: () => void;
  isBlockedFromCommenting?: boolean;
  isCloseFriend?: boolean;
  isFollowing?: boolean;
  isFollower?: boolean;
}

const UserActionsModal = ({
  visible,
  onClose,
  isSelf,
  onUnfollow,
  onRemoveCloseFriend,
  onRemoveFollower,
  onBlockCommenting,
  onUnblockCommenting,
  onSettingsPress,
  isBlockedFromCommenting,
  isCloseFriend,
  isFollowing,
  isFollower
}: UserActionsModalProps) => {
  const handleClose = () => {
    onClose();
  };

  console.log('in modal, userid: ', isSelf)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View className="bg-white w-[85%] rounded-2xl p-5 shadow-lg shadow-black">
          {/* Header */}
          <View className="flex flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-black">{isSelf ? 'Your Profile' : 'Manage User'}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* If viewing own profile */}
          {isSelf ? (
            <TouchableOpacity onPress={() => { onSettingsPress(); handleClose(); }} className="py-3">
              <Text className="text-base text-black">Settings</Text>
            </TouchableOpacity>
          ) : (
            <>
              {isFollowing && onUnfollow && (
                <TouchableOpacity onPress={() => { onUnfollow(); handleClose(); }} className="py-3 border-b border-gray-300">
                  <Text className="text-base text-black">Unfollow</Text>
                </TouchableOpacity>
              )}

              {isCloseFriend && onRemoveCloseFriend && (
                <TouchableOpacity onPress={() => { onRemoveCloseFriend(); handleClose(); }} className="py-3 border-b border-gray-300">
                  <Text className="text-base text-black">Remove Close Friend</Text>
                </TouchableOpacity>
              )}

              {isFollower && onRemoveFollower && (
                <TouchableOpacity onPress={() => { onRemoveFollower(); handleClose(); }} className="py-3 border-b border-gray-300">
                  <Text className="text-base text-black">Remove as Follower</Text>
                </TouchableOpacity>
              )}

              {(onBlockCommenting || onUnblockCommenting) && (
                <TouchableOpacity
                  onPress={() => {
                    isBlockedFromCommenting ? onUnblockCommenting?.() : onBlockCommenting?.();
                    handleClose();
                  }}
                  className="py-3"
                >
                  <Text className="text-base text-black">
                    {isBlockedFromCommenting ? 'Unblock from Commenting' : 'Block from Commenting'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UserActionsModal;
