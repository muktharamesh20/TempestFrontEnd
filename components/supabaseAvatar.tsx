import { supabase } from '@/constants/supabaseClient'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Alert, Button, Image, StyleSheet, View } from 'react-native'

interface Props {
  size: number
  url: string | null
  onUpload: (publicUrl: string) => void
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    if (url) {
      downloadImage(url)
    }
  }, [url])

  async function downloadImage(url: string) {
    setAvatarUrl(url) // For public buckets, we can directly use the URL
  }

  async function uploadAvatar() {
    let fileName = ''
    let contentType = ''

    try {
      setUploading(true)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      })

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('User cancelled image picker.')
        return
      }

      const image = result.assets[0]

      if (!image.uri) {
        throw new Error('No image URI found')
      }

      const response = await fetch(image.uri)
      const arrayBuffer = await response.arrayBuffer()

      const fileExt = image.uri.split('.').pop()?.toLowerCase() ?? 'jpeg'
      fileName = `${url}.${fileExt}`
      contentType = image.mimeType ?? 'image/jpeg'

      await supabase.storage.from('profile-images').remove([fileName]);
      const { data, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, arrayBuffer, { contentType, upsert: true })

      if (uploadError) {
        throw uploadError
      }

      const { publicUrl } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(data.path)
        .data

      setAvatarUrl(publicUrl)
      onUpload(publicUrl)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Upload failed', error.message)
      } else {
        console.error(error)
        console.log(url)
        console.log(fileName, contentType)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="profile avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View>
        <Button
          title={uploading ? 'Uploading ...' : 'Upload'}
          onPress={uploadAvatar}
          disabled={uploading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
})
