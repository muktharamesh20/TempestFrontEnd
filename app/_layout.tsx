import { supabase } from "@/constants/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import './globals.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();


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

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const inLoginGroup = segments[0] === "(login)";

    if (!session && !inLoginGroup) {
      router.replace("/(login)/onboarding");
    } else if (session && inLoginGroup) {
      router.replace("/(tabs)/home");
    }
  }, [session, segments, loading]);

  // Optional loading indicator while checking session
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Return the stack layout with auth-aware screens
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profiles/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(login)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
