import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

export interface PostPreview {
    categoryName: string;
    posts: {
      id: string;
      imageLink: string;
    }[];
}

export const RenderRow = ({ item, imageSize }: { item: PostPreview, imageSize: number }) => {
    console.log(item)
    if (item) {
      return (
        <View>
          {/* Row Header */}
          <View className="flex-row justify-between px-3 py-2 border-t border-b border-gray-300 bg-primary">
            <Text className="font-semibold text-sm text-black">{item.categoryName}</Text>
            <Text className="text-blue-600 text-sm">See more</Text>
          </View>
  
  
          {/* Horizontal Posts */}
          <FlatList
            horizontal
            data={item.posts}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="border border-white mr-[1 bg-black"
                onPress={() => console.log('Open post', item.id)}
              >
                <Image
                  source={{ uri: item.imageLink }}
                  style={{ width: imageSize, height: imageSize }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )
    }
  };