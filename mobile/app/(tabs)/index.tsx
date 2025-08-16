import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMoviesPage } from "@/services/api";
import useInfiniteScroll from "@/services/useInfiniteScroll";
import { useRouter } from "expo-router";
import { ActivityIndicator, SectionList, Image, Text, View, InteractionManager } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useMemo, useCallback, useEffect } from "react";

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
    refresh,
  } = useInfiniteScroll({
    fetchFunction: (page: number) => fetchMoviesPage({ query: "", page }),
    pageSize: 15, // Reduced page size for faster loading
  });

  // Defer non-critical operations using InteractionManager
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      // Load additional data after the UI is responsive
      if (popularMovies?.length < 30 && hasMore && !loadingMore) {
        loadMore();
      }
    });

    return () => interactionPromise.cancel();
  }, [popularMovies?.length, hasMore, loadingMore, loadMore]);

  // Optimized chunk array function
  const chunkArray = useCallback((arr: Movie[], size: number) => {
    if (!arr || arr.length === 0) return [];
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }, []);

  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(() => {
    if (!popularMovies || popularMovies.length === 0) return [];

    return [{
      title: '📽️ Popular Movies',
      data: chunkArray(popularMovies, 3)
    }];
  }, [popularMovies, chunkArray]);

  const isInitialLoading = popularLoading;
  const hasError = popularError;

  // Memoized render functions for better performance
  const renderMovieRow = useCallback(({ item, index: rowIndex }: { item: Movie[], index: number }) => {
    // Pre-calculate all derived data before rendering
    const movieItems = item.map((movie, index) => (
      <MovieCard key={`movie-${rowIndex}-${index}-${movie.id}`} {...movie} />
    ));

    const emptySlots = item.length < 3 ?
      [...Array(3 - item.length)].map((_, index) => (
        <View key={`empty-${rowIndex}-${index}`} className="w-[30%]" />
      )) : null;

    return (
      <View className="flex-row justify-between px-5 mb-3">
        {movieItems}
        {emptySlots}
      </View>
    );
  }, []);

  const renderSectionHeader = useCallback(({ section }: { section: { title: string } }) => (
    <View className="px-5 mb-3 mt-5">
      <Text className="text-lg text-white font-bold">
        {section.title}
      </Text>
    </View>
  ), []);

  const handleEndReached = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadMore();
    }
  }, [hasMore, loadingMore, loadMore]);

  const ListHeaderComponent = useMemo(() => (
    <View className="px-5 pb-3">
      {/* Logo moved outside - this is just for spacing */}
    </View>
  ), []);

  const ListFooterComponent = useMemo(() => (
    loadingMore ? (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    ) : null
  ), [loadingMore]);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full" resizeMode="cover" />

      {isInitialLoading ? (
        <View className="flex-1 justify-center items-center">
          <Image source={icons.logo} className="w-28 h-20 mb-5" resizeMode="contain" />
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        </View>
      ) : hasError ? (
        <View className="flex-1 justify-center items-center px-5">
          <Image source={icons.logo} className="w-28 h-20 mb-5" resizeMode="contain" />
          <Text className="text-white text-center">
            Error: {typeof hasError === 'string' ? hasError : 'Unable to load movies'}
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          {/* Fixed Logo */}
          <View className="px-5 pt-5 pb-3">
            <Image source={icons.logo} className="w-28 h-20 mx-auto" resizeMode="contain" />
          </View>

          {/* Scrollable Content */}
          <SectionList
            sections={sections}
            renderItem={renderMovieRow}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item, sectionIndex) => `section-${sectionIndex}-row-${sectionIndex}`}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            stickySectionHeadersEnabled={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3} // Reduced batch size for smoother scrolling
            windowSize={5} // Smaller window size to reduce memory usage
            initialNumToRender={5} // Render fewer rows initially for faster first render
            updateCellsBatchingPeriod={50} // Batch cell updates every 50ms
            getItemLayout={(data, index) => ({
              length: 200, // Approximate height of each row
              offset: 200 * index,
              index
            })}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
