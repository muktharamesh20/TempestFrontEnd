import { numbers } from '@/constants/numbers'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import SettingsHeader from './settingsHeader'

const { width } = Dimensions.get('window')
const IMAGE_MARGIN = 2
const NUM_COLUMNS = 3
const IMAGE_SIZE = (width - IMAGE_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS

// Replace with your real saved post type
type SavedPost = {
  id: string
  imageLink: string
}

const LikedScreen = () => {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Mock fetch (replace with Supabase or your API)
  const fetchLikedPosts = async (pageNum: number) => {
    setLoading(true)
    // Simulate network request
    await new Promise((res) => setTimeout(res, 500))

    // Mock 30 posts
    const newPosts = Array.from({ length: 15 }, (_, i) => ({
      id: `post-${(pageNum - 1) * 15 + i + 1}`,
      imageLink: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/500`,
    }))

    setSavedPosts((prev) => [...prev, ...newPosts])
    setHasMore(newPosts.length === 15) // If less than page size, stop loading more
    setLoading(false)
  }

  useEffect(() => {
    fetchLikedPosts(page)
  }, [page])

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  const renderItem = ({ item }: { item: SavedPost }) => (
    <TouchableOpacity
      style={styles.imageWrapper}
      onPress={() => console.log('Open saved post', item.id)}
    >
      <Image
        source={{ uri: item.imageLink }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>

      <SettingsHeader headerName='Liked Posts' />

      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#888" /> : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: numbers.primaryColor, // or numbers.primaryColor
  },
  imageWrapper: {
    margin: IMAGE_MARGIN,
    backgroundColor: '#E4E4E4',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
})

export default LikedScreen
