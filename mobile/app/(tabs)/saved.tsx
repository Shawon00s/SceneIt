import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSavedMovies } from '@/contexts/SavedMoviesContext'
import MovieCard from '@/components/MovieCard'

const Saved = () => {
  const { savedMovies, loading } = useSavedMovies();

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="px-5 py-5">
        <Text className="text-white text-2xl font-bold mb-5">Saved Movies</Text>

        {savedMovies.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-light-200 text-lg text-center">
              No saved movies yet.{'\n'}Start saving movies to watch later!
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

export default Saved