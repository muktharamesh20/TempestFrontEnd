import { Button, Input } from '@rneui/themed'
import * as WebBrowser from 'expo-web-browser'

import React, { useEffect, useState } from 'react'
import { Alert, AppState, StyleSheet, View } from 'react-native'
import { supabase } from '../constants/supabaseClient'

WebBrowser.maybeCompleteAuthSession()

// Handle session refresh when app is foregrounded
useEffect(() => {
  const subscription = AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
  return () => subscription.remove()
}, [])


export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  async function signInWithGoogle() {
    // Generate a redirect URL with your Expo app's scheme (make sure scheme is set in app config)
    // const redirectUrl = AuthSession.makeRedirectUri({
    //   scheme: 'tempest', // <-- your app scheme here, e.g. "tempest"
    //   path: 'auth/callback', // <-- optional path to handle the redirect
    // })
    const redirectUrl = "tempest://auth/callback"


    // Pass redirectUrl to Supabase so OAuth redirects here after login
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })

    if (error) {
      Alert.alert('Error', error.message)
      return
    }
    console.log('Redirect URI:', redirectUrl);


    if (data?.url) {
      // Open the OAuth URL in a browser session and wait for the redirect back to your app
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (result.type === 'success' && 'url' in result && result.url) {
        // Parse the fragment/hash part of the URL
        const url = result.url;
        const hash = url.split('#')[1];
        const params = new URLSearchParams(hash);

        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');

        if (access_token && refresh_token) {
          // Set the session in Supabase
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            Alert.alert('Session error', error.message);
            return;
          }

          // Now you have a valid session!
          console.log('Session set!', data.session);
        } else {
          Alert.alert('Could not extract tokens from redirect URL');
        }
      } else {
        Alert.alert('No URL returned from Supabase')
      }
    }
  }



  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign in with Google" onPress={signInWithGoogle} type="outline" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
