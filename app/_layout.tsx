import { supabase } from "@/constants/supabaseClient";
import { getUserId } from "@/services/api";
import { registerForPushNotificationsAsync, unregisterPushNotificationsAsync } from "@/services/pushNotifications";
import { Session } from "@supabase/supabase-js";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SetUsername from "./(login)/createUsername";
import './globals.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mustAddUsername, setMustAddUsername] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const HEARTBEAT_INTERVAL =  60 * 1000 / 6; // 10 seconds

  // Fetch session on mount and subscribe to auth changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Hide splash screen once loading done
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // Check if user must add username after session is loaded and user is logged in
  useEffect(() => {
    const checkUsername = async () => {
      if (!session) {
        setMustAddUsername(false);
        return;
      }
      const userId = session.user.id;

      const { data: profile, error } = await supabase
        .from('usersettings')
        .select('username')
        .eq('id', userId)
        .single();

      if (!profile?.username) {
        setMustAddUsername(true);
      } else {
        setMustAddUsername(false);
      }
    };

    if (!loading && session) {
      checkUsername();
    } else {
      setMustAddUsername(false);
    }
  }, [loading, session]);

  // Redirect logic: if no session redirect to onboarding; if logged in and in login group redirect to home
  useEffect(() => {
    if (loading) return;

    const inLoginGroup = segments[0] === "(login)";

    if (!session && !inLoginGroup) {
      router.replace("/(login)/onboarding");
    } else if (session && inLoginGroup) {
      getUserId();

      // If logged in and on login pages but username is set, redirect to home
      router.replace("/(tabs)/home");
    }
  }, [session, segments, loading]);

  //register for push notifications on mount if session exists and user allows push notifications
  useEffect(() => {
    const registerPushNotifications = async () => {
      if (session) {
        const userID = await getUserId();
        if (userID[0]) {
          const {data, error} = await supabase.from("usersettings")
                .select("allow_push_notifications").eq("id", userID[0]).single();

          if (data?.allow_push_notifications) {
            registerForPushNotificationsAsync();
          }
        }
        
      } else {
        await unregisterPushNotificationsAsync(false); // Unregister if no session
      }
    };

    registerPushNotifications();
  })

  //heartbeat for active
  
  useEffect(() => {
    if (!session) return;

    const updateLastSeen = async () => {
      const { error } = await supabase
        .from("usersettings")
        .update({ id: session.user.id, last_active_ping: new Date().toISOString() })
        .eq("id", session.user.id);
      if (error) console.error("Heartbeat failed:", error);
    };

    const interval = setInterval(updateLastSeen, HEARTBEAT_INTERVAL);
    updateLastSeen(); // run right away

    return () => clearInterval(interval); // cleanup
  }, [session]);

  // Optional loading indicator while checking session or username
  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}> {/* ✅ WRAP THIS TOO */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView>
      <>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="profiles/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(login)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="infoScreen"
            options={{ headerShown: false, animation: 'none'}}
          />
          <Stack.Screen
            name="habitProgress/[id]"
            options={{ headerShown: false}}
          />
          <Stack.Screen
            name="settings"
            options={{ headerShown: false }}
          />
        </Stack>

        <Modal visible={mustAddUsername} transparent animationType="fade">
          <LinearGradient
            colors={['#3897F2', '#14354E']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <SetUsername closeFunction={setMustAddUsername} />
          </LinearGradient>
        </Modal>
      </>
    </GestureHandlerRootView>
  );
}
