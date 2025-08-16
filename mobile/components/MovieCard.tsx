import { icons } from '@/constants/icons'
import { Link } from 'expo-router'
import React, { memo } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import SaveButton from './SaveButton'

const MovieCard = memo(({ id, poster_path, title, vote_average, release_date, ...movie }: Movie) => {
    // Pre-compute values outside of render
    const fullMovie: Movie = { id, poster_path, title, vote_average, release_date, ...movie };
    const imageUri = poster_path
        ? `https://image.tmdb.org/t/p/w342${poster_path}` // Using w342 instead of w500 for faster loading
        : 'https://placeholder.co/300x400/1a1a11a/ffffff.png'; // Smaller placeholder
    const releaseYear = release_date?.split('-')[0] || '';
    const rating = (vote_average / 2).toFixed(1);

    return (
        <View className='w-[30%]'>
            <Link href={`/movies/${id}`} asChild>
                <TouchableOpacity>
                    <Image
                        source={{ uri: imageUri }}
                        className='w-full h-52 rounded-lg'
                        resizeMode='cover'
                        // Add performance optimizations for image loading
                        progressiveRenderingEnabled={true}
                        fadeDuration={300}
                    />
                </TouchableOpacity>
            </Link>

            <SaveButton
                movie={fullMovie}
                size="small"
                style="absolute top-2 right-2"
            />

            <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>

            <View className='flex-row items-center justify-start gap-x-1'>
                <Image source={icons.star} className='size-4' />

                <Text className='text-xs text-white font-bold uppercase'>{rating}</Text>

                <Text className='text-xs text-light-300 font-medium'> |  {releaseYear}</Text>
            </View>
        </View>
    )
})

MovieCard.displayName = 'MovieCard';

export default MovieCard