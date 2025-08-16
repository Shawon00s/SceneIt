import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '@/constants/icons';

interface StarRatingProps {
    movieId: number;
    initialRating?: number;
    onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
    movieId,
    initialRating = 0,
    onRatingChange
}) => {
    const [rating, setRating] = useState(initialRating);
    const [hoveredRating, setHoveredRating] = useState(0);

    // Load saved rating on component mount
    useEffect(() => {
        loadSavedRating();
    }, [movieId]);

    const loadSavedRating = async () => {
        try {
            const savedRating = await AsyncStorage.getItem(`movie_rating_${movieId}`);
            if (savedRating !== null) {
                setRating(parseInt(savedRating, 10));
            }
        } catch (error) {
            console.error('Error loading saved rating:', error);
        }
    };

    const saveRating = async (newRating: number) => {
        try {
            await AsyncStorage.setItem(`movie_rating_${movieId}`, newRating.toString());
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    };

    const handleStarPress = (starIndex: number) => {
        const newRating = starIndex + 1;
        setRating(newRating);
        saveRating(newRating);
        onRatingChange?.(newRating);

        // Show confirmation
        Alert.alert(
            'Rating Saved',
            `You rated this movie ${newRating} out of 5 stars!`,
            [{ text: 'OK' }]
        );
    };

    const renderStar = (index: number) => {
        const isFilled = index < (hoveredRating || rating);
        const isHovered = hoveredRating > 0 && index < hoveredRating;

        return (
            <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                onPressIn={() => setHoveredRating(index + 1)}
                onPressOut={() => setHoveredRating(0)}
                className="p-2"
                activeOpacity={0.7}
            >
                <Image
                    source={icons.star}
                    className="size-10"
                    style={{
                        tintColor: isFilled
                            ? (isHovered ? '#FFC107' : '#FFD700')
                            : '#6B7280'
                    }}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-col items-center mt-8 mb-4 bg-dark-100 rounded-lg p-6">
            <Text className="text-white font-bold text-lg mb-4">Rate this movie</Text>

            <View className="flex-row items-center justify-center mb-3">
                {[...Array(5)].map((_, index) => renderStar(index))}
            </View>

            {rating > 0 ? (
                <Text className="text-accent text-sm font-semibold">
                    ⭐ You rated this movie {rating} out of 5 stars
                </Text>
            ) : (
                <Text className="text-light-200 text-sm">
                    Tap the stars to rate this movie
                </Text>
            )}
        </View>
    );
};

export default StarRating;
