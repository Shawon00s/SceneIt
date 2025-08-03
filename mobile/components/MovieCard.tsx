import { icons } from '@/constants/icons'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import SaveButton from './SaveButton'

const MovieCard = ({ id, poster_path, title, vote_average, release_date, ...movie }: Movie) => {
    const fullMovie: Movie = { id, poster_path, title, vote_average, release_date, ...movie };

    return (
        <View className='w-[30%]'>
            <Link href={`/movies/${id}`} asChild>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://placeholder.co/600x400/1a1a11a/ffffff.png'
                        }}
                        className='w-full h-52 rounded-lg'
                        resizeMode='cover'
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

                <Text className='text-xs text-white font-bold uppercase'>{(vote_average / 2).toFixed(1)}</Text>

                <Text className='text-xs text-light-300 font-medium'> |  {release_date?.split('-')[0]}</Text>

                {/*<Text className='text-xs font-medium text-light-300 uppercase'>Movie</Text>*/}
            </View>
        </View>
    )
}

export default MovieCard