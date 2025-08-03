import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies, trackMovieSearch } from '@/services/api';
import useFetch from '@/services/useFetch';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

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

  // Track movie searches when results are loaded
  useEffect(() => {
    if (movies && movies.length > 0 && searchQuery.trim()) {
      // Track the first few results as "searched" movies
      movies.slice(0, 5).forEach(movie => {
        trackMovieSearch(movie).catch(err =>
          console.log('Failed to track search for:', movie.title)
        );
      });
    }
  }, [movies, searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard {...item} />
        )}
        keyExtractor={(item) => item.id.toString()}
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
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className='my-5'>
              <SearchBar
                placeholder='Search movies ...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />

            </View>

            {loading && (
              <ActivityIndicator size="large" color="#0000ff" />
            )}

            {error && (
              <Text className='text-red-500 px-5 my-3 text-center'>
                {typeof error === 'string' ? error : (error as any)?.message || 'Unknown error'}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies && movies.length > 0 && (
              <Text className='text-xl text-white font-bold'>
                Search Results for {' '}
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View>
              <Text>
                {searchQuery.trim() ?
                  `No results found for "${searchQuery}"`
                  : "No results found"}
              </Text>
            </View>
          )
            : null
        }
      />
    </View>
  );
}

export default search