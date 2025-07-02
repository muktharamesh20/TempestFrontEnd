import { ProfileSummary } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface UserActionsModalProps {
  visible: boolean;
  onClose: () => void;
  isSelf: boolean;
  onUnfollow?: () => void;
  onRemoveCloseFriend?: () => void;
  onRemoveFollower: () => void;
  onBlockCommenting: () => void;
  onUnblockCommenting: () => void;
  onSettingsPress: () => void;
  user: ProfileSummary;
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
  user,
}: UserActionsModalProps) => {
  const handleClose = () => {
    onClose();
  };

  //console.log('in modal, userid: ', isSelf)

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
              {user.youfollowing && onUnfollow && (
                <TouchableOpacity onPress={() => { onUnfollow(); handleClose(); }} className="py-3 border-b border-gray-300">
                  <Text className="text-base text-black">Unfollow</Text>
                </TouchableOpacity>
              )}

              {user.theyclosefriend && onRemoveCloseFriend && (
                <TouchableOpacity onPress={() => { onRemoveCloseFriend(); handleClose(); }} className="py-3 border-b border-gray-300">
                  <Text className="text-base text-black">Remove Close Friend</Text>
                </TouchableOpacity>
              )}

              {user.theyfollowing && onRemoveFollower && (
                <TouchableOpacity onPress={() => { onRemoveFollower(); handleClose(); }} className="py-3 border-b border-gray-300">
                  <Text className="text-base text-black">Remove as Follower</Text>
                </TouchableOpacity>
              )}

              { (
                <TouchableOpacity
                  onPress={() => {
                    if(user.youblockedthem){
                        onUnblockCommenting()
                    } else {
                        onBlockCommenting()
                    }
                    handleClose();
                  }}
                  className="py-3"
                >
                  <Text className="text-base text-black">
                    {user.youblockedthem ? 'Unblock from Commenting' : 'Block from Commenting'}
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
