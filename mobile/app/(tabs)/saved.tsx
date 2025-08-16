import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSavedMovies } from '@/contexts/SavedMoviesContext'
import MovieCard from '@/components/MovieCard'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'

const Saved = () => {
  const { savedMovies, loading } = useSavedMovies();

  // Memoized render function
  const renderMovieItem = useCallback(({ item }: { item: Movie }) => (
    <MovieCard {...item} />
  ), []);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  // Memoized empty component
  const ListEmptyComponent = useMemo(() => (
    <View className="flex-1 justify-center items-center">
      <Text className="text-light-200 text-lg text-center">
        No saved movies yet.{'\n'}Start saving movies to watch later!
      </Text>
    </View>
  ), []);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <Image source={images.bg} className="absolute w-full h-full" resizeMode="cover" />
        <View className="flex-1 justify-center items-center">
          <Image source={icons.logo} className="w-28 h-20 mb-5" resizeMode="contain" />
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full h-full" resizeMode="cover" />
      <View className="px-5 py-5">
        <Image source={icons.logo} className="w-28 h-20 mx-auto mb-5" resizeMode="contain" />
        <Text className="text-white text-2xl font-bold mb-5">Saved Movies</Text>

        <FlatList
          data={savedMovies}
          renderItem={renderMovieItem}
          keyExtractor={keyExtractor}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          ListEmptyComponent={ListEmptyComponent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          windowSize={10}
          initialNumToRender={15}
        />
      </View>
    </SafeAreaView>
  )
}

export default Saved