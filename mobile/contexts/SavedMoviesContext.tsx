import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedMoviesContextType {
    savedMovies: Movie[];
    addToSaved: (movie: Movie) => void;
    removeFromSaved: (movieId: number) => void;
    isMovieSaved: (movieId: number) => boolean;
    loading: boolean;
}

const SavedMoviesContext = createContext<SavedMoviesContextType | undefined>(undefined);

const STORAGE_KEY = '@saved_movies';

export const SavedMoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    // Load saved movies from AsyncStorage on app start
    useEffect(() => {
        loadSavedMovies();
    }, []);

    const loadSavedMovies = async () => {
        try {
            const savedData = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedData) {
                setSavedMovies(JSON.parse(savedData));
            }
        } catch (error) {
            console.error('Error loading saved movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveTotStorage = async (movies: Movie[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
        } catch (error) {
            console.error('Error saving movies to storage:', error);
        }
    };

    const addToSaved = (movie: Movie) => {
        const updatedMovies = [...savedMovies, movie];
        setSavedMovies(updatedMovies);
        saveTotStorage(updatedMovies);
    };

    const removeFromSaved = (movieId: number) => {
        const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
        setSavedMovies(updatedMovies);
        saveTotStorage(updatedMovies);
    };

    const isMovieSaved = (movieId: number) => {
        return savedMovies.some(movie => movie.id === movieId);
    };

    return (
        <SavedMoviesContext.Provider
            value={{
                savedMovies,
                addToSaved,
                removeFromSaved,
                isMovieSaved,
                loading,
            }}
        >
            {children}
        </SavedMoviesContext.Provider>
    );
};

export const useSavedMovies = () => {
    const context = useContext(SavedMoviesContext);
    if (!context) {
        throw new Error('useSavedMovies must be used within a SavedMoviesProvider');
    }
    return context;
};
