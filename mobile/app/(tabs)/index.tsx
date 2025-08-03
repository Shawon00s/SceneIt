import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMoviesPage, fetchTrendingMovies } from "@/services/api";
import useInfiniteScroll from "@/services/useInfiniteScroll";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, SectionList, Image, Text, View } from "react-native";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();

  // Fetch trending movies (with fallback to empty array on error)
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(async () => {
    try {
      return await fetchTrendingMovies({ limit: 10, timeframe: 'week' });
    } catch (error) {
      console.log('Trending movies not available, falling back to popular movies only');
      return []; // Return empty array as fallback
    }
  });

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

  // Create sections for SectionList with chunked data for 3-column layout
  const getSections = () => {
    const sections: Array<{ title: string; data: Movie[][] }> = [];

    // Helper function to chunk array into groups of 3
    const chunkArray = (arr: Movie[], size: number) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };

    // Add trending section if available
    if (trendingMovies && trendingMovies.length > 0) {
      sections.push({
        title: '🔥 Trending This Week',
        data: chunkArray(trendingMovies, 3)
      });
    }

    // Add popular section with filtered movies
    if (popularMovies && popularMovies.length > 0) {
      const trendingIds = new Set((trendingMovies || []).map(m => m.id));
      const uniquePopular = popularMovies.filter(movie => !trendingIds.has(movie.id));

      if (uniquePopular.length > 0) {
        sections.push({
          title: '📽️ Popular Movies',
          data: chunkArray(uniquePopular, 3)
        });
      }
    }

    // If no trending movies, show all popular movies
    if ((!trendingMovies || trendingMovies.length === 0) && popularMovies && popularMovies.length > 0) {
      sections.push({
        title: '📽️ Popular Movies',
        data: chunkArray(popularMovies, 3)
      });
    }

    return sections;
  };

  const isInitialLoading = trendingLoading || popularLoading;
  const hasError = popularError; // Only show error for popular movies, trending is optional

  const renderMovieRow = ({ item }: { item: Movie[] }) => (
    <View className="flex-row justify-between px-5 mb-3">
      {item.map((movie, index) => (
        <MovieCard key={movie.id} {...movie} />
      ))}
      {/* Fill empty slots if row has less than 3 items */}
      {item.length < 3 && [...Array(3 - item.length)].map((_, index) => (
        <View key={`empty-${index}`} className="w-[30%]" />
      ))}
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View className="px-5 mb-3 mt-5">
      <Text className="text-lg text-white font-bold">
        {section.title}
      </Text>
    </View>
  );

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
          sections={getSections()}
          renderItem={renderMovieRow}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item, index) => `row-${index}-${item.map(m => m.id).join('-')}`}
          ListHeaderComponent={() => (
            <View className="px-5">
              <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

              <SearchBar
                onPress={() => {
                  router.push("/search");
                }}
                placeholder="Search for a movie"
              />
            </View>
          )}
          ListFooterComponent={() => (
            loadingMore ? (
              <View className="py-4">
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            ) : null
          )}
          onEndReached={() => {
            if (hasMore && !loadingMore) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}
