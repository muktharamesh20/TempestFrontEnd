import { Button, Input } from '@rneui/themed'
import * as WebBrowser from 'expo-web-browser'

import React, { useState } from 'react'
import { Alert, AppState, StyleSheet, View } from 'react-native'
import { supabase } from '../constants/supabaseClient'

WebBrowser.maybeCompleteAuthSession()

// Handle session refresh when app is foregrounded
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

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
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl)
  
      if (result.type === 'success') {
        // OAuth completed, the user is back in your app
        // Supabase handles the session internally via the redirect
        const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession()
  
          if (sessionError) {
            Alert.alert('Error fetching session', sessionError.message)
            return
          }
  
          if (session) {
            console.log('OAuth successful, session:', session)
      } else {
        Alert.alert('Login canceled or failed')
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
      {/* <View style={styles.verticallySpaced}>
      <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices()
          const userInfo = await GoogleSignin.signIn()
          if (userInfo?.data && userInfo.data.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.data.idToken,
            })
            console.log(error, data)
          } else {
            throw new Error('no ID token present!')
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      }}
    />
      </View> */}
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
