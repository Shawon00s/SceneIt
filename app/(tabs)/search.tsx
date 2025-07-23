import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { updateSearchCount } from '@/services/appwrite';
import useFetch from '@/services/usefetch';
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
    query: searchQuery
  }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();

        if (movies && movies.length > 0 && movies[0]) {
          await updateSearchCount(searchQuery, movies[0]);
        } else {
          reset();
        }
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);


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
                {error.message}
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