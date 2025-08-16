import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import useFetch from '@/services/useFetch';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const search = () => {
  //useState for search
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({
    query: searchQuery,
    pages: 3 // Fetch 3 pages (60 movies) for search results
  }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      }
      else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Memoized render function for FlatList
  const renderMovieItem = useCallback(({ item }: { item: Movie }) => (
    <MovieCard {...item} />
  ), []);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  // Memoized ListHeaderComponent
  const ListHeaderComponent = useMemo(() => (
    <>
      {loading && (
        <View className="py-4">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {error && (
        <Text className='text-red-500 px-5 my-3 text-center'>
          {typeof error === 'string' ? error : (error as any)?.message || 'Unknown error'}
        </Text>
      )}

      {!loading && !error && searchQuery.trim() && movies && movies.length > 0 && (
        <Text className='text-xl text-white font-bold mb-4'>
          Search Results for {' '}
          <Text className='text-accent'>{searchQuery}</Text>
        </Text>
      )}
    </>
  ), [searchQuery, loading, error, movies]);

  // Memoized ListEmptyComponent
  const ListEmptyComponent = useMemo(() => (
    !loading && !error ? (
      <View>
        <Text className="text-white text-center">
          {searchQuery.trim() ?
            `No results found for "${searchQuery}"`
            : "Start typing to search for movies"}
        </Text>
      </View>
    ) : null
  ), [loading, error, searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full" resizeMode="cover" />

      {/* Fixed Logo and Search Bar Section */}
      <View className="bg-transparent pt-5 pb-3 px-5">
        <View className="w-full flex-row justify-center items-center mb-4">
          <Image source={icons.logo} className="w-28 h-20" resizeMode="contain" />
        </View>

        <SearchBar
          placeholder='Search movies ...'
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={keyExtractor}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginBottom: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews={true} // Optimize memory usage
        maxToRenderPerBatch={15} // Render 15 items per batch (5 rows of 3)
        windowSize={10} // Keep 10 screens worth of items in memory
        initialNumToRender={15} // Render first 15 items immediately
        getItemLayout={undefined} // Let FlatList calculate for better performance with variable heights
      />
    </SafeAreaView>
  );
}

export default search