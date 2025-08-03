import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMoviesPage } from "@/services/api";
import useInfiniteScroll from "@/services/useInfiniteScroll";
import { useRouter } from "expo-router";
import { ActivityIndicator, SectionList, Image, Text, View } from "react-native";
import React, { useMemo, useCallback } from "react";

export default function Index() {
  const router = useRouter();

  // Fetch popular movies with infinite scroll
  const {
    data: popularMovies,
    loading: popularLoading,
    loadingMore,
    error: popularError,
    hasMore,
    loadMore,
  } = useInfiniteScroll({
    fetchFunction: (page: number) => fetchMoviesPage({ query: "", page }),
    pageSize: 20,
  });

  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(() => {
    if (!popularMovies || popularMovies.length === 0) return [];

    // Helper function to chunk array into groups of 3
    const chunkArray = (arr: Movie[], size: number) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    return [{
      title: '📽️ Popular Movies',
      data: chunkArray(popularMovies, 3)
    }];
  }, [popularMovies]);

  const isInitialLoading = popularLoading;
  const hasError = popularError;

  // Memoized render functions for better performance
  const renderMovieRow = useCallback(({ item }: { item: Movie[] }) => (
    <View className="flex-row justify-between px-5 mb-3">
      {item.map((movie) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
      {/* Fill empty slots if row has less than 3 items */}
      {item.length < 3 && [...Array(3 - item.length)].map((_, index) => (
        <View key={`empty-${index}`} className="w-[30%]" />
      ))}
    </View>
  ), []);

  const renderSectionHeader = useCallback(({ section }: { section: { title: string } }) => (
    <View className="px-5 mb-3 mt-5">
      <Text className="text-lg text-white font-bold">
        {section.title}
      </Text>
    </View>
  ), []);

  const handleSearchPress = useCallback(() => {
    router.push("/search");
  }, [router]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadMore();
    }
  }, [hasMore, loadingMore, loadMore]);

  const ListHeaderComponent = useMemo(() => (
    <View className="px-5">
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      <SearchBar
        onPress={handleSearchPress}
        placeholder="Search for a movie"
      />
    </View>
  ), [handleSearchPress]);

  const ListFooterComponent = useMemo(() => (
    loadingMore ? (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    ) : null
  ), [loadingMore]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" resizeMode="cover" />

      {isInitialLoading ? (
        <View className="flex-1 justify-center items-center">
          <Image source={icons.logo} className="w-12 h-10 mb-5" />
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        </View>
      ) : hasError ? (
        <View className="flex-1 justify-center items-center px-5">
          <Image source={icons.logo} className="w-12 h-10 mb-5" />
          <Text className="text-white text-center">
            Error: {typeof hasError === 'string' ? hasError : 'Unable to load movies'}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderMovieRow}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => `row-${index}-${item.map(m => m.id).join('-')}`}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          stickySectionHeadersEnabled={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5} // Render 5 rows per batch
          windowSize={8} // Keep 8 screens worth of items in memory
          initialNumToRender={10} // Render first 10 rows immediately
        />
      )}
    </View>
  );
}
