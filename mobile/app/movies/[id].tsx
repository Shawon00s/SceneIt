import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchMovieReviews, fetchMovieCredits } from "@/services/api";
import SaveButton from "@/components/SaveButton";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

interface ReviewCardProps {
  review: Review;
  onPress: () => void;
}

const ReviewCard = ({ review, onPress }: ReviewCardProps) => (
  <TouchableOpacity onPress={onPress} className="bg-dark-100 rounded-lg p-4 mb-3 min-h-[140px]">
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-white font-bold text-base">{review.author}</Text>
      {review.author_details.rating && (
        <View className="flex-row items-center">
          <Image source={icons.star} className="size-4 mr-1" />
          <Text className="text-yellow-400 font-bold text-sm">
            {review.author_details.rating}/10
          </Text>
        </View>
      )}
    </View>
    <View className="flex-1 mb-2">
      <Text className="text-light-200 text-sm leading-5" numberOfLines={5}>
        {review.content}
      </Text>
    </View>
    <View className="mt-auto">
      <Text className="text-light-300 text-xs">
        {new Date(review.created_at).toLocaleDateString()}
      </Text>
      <Text className="text-accent text-xs mt-1">Tap to read full review</Text>
    </View>
  </TouchableOpacity>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: movie, loading: movieLoading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { data: reviews, loading: reviewsLoading } = useFetch(() =>
    fetchMovieReviews(id as string)
  );

  const { data: credits, loading: creditsLoading } = useFetch(() =>
    fetchMovieCredits(id as string)
  );

  // Get director from credits
  const director = credits?.crew?.find((person) => person.job === "Director")?.name;

  const handleReviewPress = (review: Review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  if (movieLoading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>

          {movie && (
            <SaveButton
              movie={movie}
              size="large"
              style="absolute bottom-5 left-5"
            />
          )}
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo label="Director" value={director || "N/A"} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />

          {/* Reviews Section */}
          <View className="flex-col items-start justify-center mt-8">
            <Text className="text-white font-bold text-lg mb-4">Reviews</Text>
            {reviewsLoading ? (
              <ActivityIndicator color="#fff" />
            ) : reviews?.results && reviews.results.length > 0 ? (
              reviews.results.slice(0, 3).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onPress={() => handleReviewPress(review)}
                />
              ))
            ) : (
              <Text className="text-light-200 text-sm">No reviews available</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Full Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-primary rounded-lg mx-5 max-h-4/5 w-5/6">
            <ScrollView className="p-6">
              {selectedReview && (
                <>
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white font-bold text-lg flex-1">
                      Review by {selectedReview.author}
                    </Text>
                    <TouchableOpacity onPress={closeModal}>
                      <Text className="text-accent text-lg font-bold">✕</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedReview.author_details.rating && (
                    <View className="flex-row items-center mb-4">
                      <Image source={icons.star} className="size-5 mr-2" />
                      <Text className="text-yellow-400 font-bold text-base">
                        {selectedReview.author_details.rating}/10
                      </Text>
                    </View>
                  )}

                  <Text className="text-light-200 text-base leading-6 mb-4">
                    {selectedReview.content}
                  </Text>

                  <Text className="text-light-300 text-sm">
                    Published: {new Date(selectedReview.created_at).toLocaleDateString()}
                  </Text>

                  {selectedReview.updated_at !== selectedReview.created_at && (
                    <Text className="text-light-300 text-sm mt-1">
                      Updated: {new Date(selectedReview.updated_at).toLocaleDateString()}
                    </Text>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Details;