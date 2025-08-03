import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { icons } from '@/constants/icons';
import { useSavedMovies } from '@/contexts/SavedMoviesContext';

interface SaveButtonProps {
    movie: Movie | MovieDetails;
    size?: 'small' | 'large';
    style?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({
    movie,
    size = 'small',
    style = ''
}) => {
    const { addToSaved, removeFromSaved, isMovieSaved } = useSavedMovies();
    const isSaved = isMovieSaved(movie.id);

    const handlePress = () => {
        if (isSaved) {
            removeFromSaved(movie.id);
        } else {
            // Convert MovieDetails to Movie format for saving
            const movieToSave: Movie = {
                id: movie.id,
                title: movie.title,
                adult: movie.adult,
                backdrop_path: movie.backdrop_path || '',
                genre_ids: 'genres' in movie ? movie.genres.map(g => g.id) : [],
                original_language: movie.original_language,
                original_title: movie.original_title,
                overview: movie.overview || '',
                popularity: movie.popularity,
                poster_path: movie.poster_path || '',
                release_date: movie.release_date,
                video: movie.video,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count
            };
            addToSaved(movieToSave);
        }
    };

    const sizeClass = size === 'large' ? 'size-8' : 'size-5';
    const bgClass = isSaved ? 'bg-accent' : 'bg-dark-100';

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`${bgClass} rounded-full p-2 ${style}`}
        >
            <Image
                source={icons.save}
                className={`${sizeClass}`}
                tintColor={isSaved ? '#fff' : '#ccc'}
            />
        </TouchableOpacity>
    );
};

export default SaveButton;
