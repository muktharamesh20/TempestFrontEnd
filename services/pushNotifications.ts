import { supabase } from '@/constants/supabaseClient';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { getUserId } from './api';

export async function registerForPushNotificationsAsync() {
  let token = null;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    const user = (await getUserId())[0]

    await supabase.from('push_tokens').upsert({
      user_id: user,
      token: token,
    });

    console.log('Expo Push Token:', token);
  } else {
    alert('Must use physical device for push notifications');
  }

  return token;
}

export async function unregisterPushNotificationsAsync(allDevices: boolean) {
//   if (!Device.isDevice) {
//     alert('Must use physical device to unregister push notifications');
//     return;
//   }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    const user = (await getUserId())[0];

    if (!token || !user) {
      console.warn('No token or user found for unregistering push notifications');
      return;
    }
    
    if(allDevices){
        const { error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', user);

        if (error) {
            console.error('Failed to delete push token:', error);
          } else {
            console.log('Push token unregistered successfully');
          }
    } else {
        const { error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', user)
        .eq('token', token);

        if (error) {
            console.error('Failed to delete push token:', error);
          } else {
            console.log('Push token unregistered successfully');
          }
    }
    
  } catch (e) {
    console.error('Error unregistering push notifications:', e);
  }
}


// export async function sendIndividualMessage() {
//     const { data, error } = await supabase.functions.invoke("send-message-individual", {
//         body: {
//           messenger_id: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
//           receiver_id: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
//           content: "Hey, just checking in. How's it going?",
//           documentLink: null,
//           postLinked: null,
//           reply_to: null,
//         },
//       });
    
//       if (error) {
//         console.error("Failed to send message:", error);
//       } else {
//         console.log("Edge function response:", data);
//       }    
// }

export async function sendIndividualMessage() {
    const { data, error } = await supabase.functions.invoke("send-message-individual-2", {
        body: {
          messenger_id: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
          receiver_id: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
          content: "Hey, just checking in. How's it going?",
          documentLink: null,
          postLinked: null,
          reply_to: null,
        },
      });
    
      if (error) {
        console.error("Failed to send message:", error);
      } else {
        console.log("Edge function response:", data);
      }    
}

export async function sendGroupMessage() {
    const { data, error } = await supabase.functions.invoke("send-message-group", {
        body:{
            by_person: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
            group_id: '4eaf94f0-bbd4-4615-b6df-b242f210df31',
            content: "Hey, just checking in. How's it going?",
        }
    });
}

/**
 * const sendMessage = async () => {
  const { data, error } = await supabase.functions.invoke("send-message", {
    body: {
      messenger_id: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
      receiver_id: '2abdd94f-34d4-45a9-a76a-5306f378a0e9',
      content: "Hey, just checking in. How's it going?",
      documentLink: null,
      postLinked: null,
      reply_to: null,
    },
  });

  if (error) {
    console.error("Failed to send message:", error);
  } else {
    console.log("Edge function response:", data);
  }
};
 */