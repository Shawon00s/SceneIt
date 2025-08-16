import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { InteractionManager } from 'react-native';
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
        // Use InteractionManager to defer loading until after animations
        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            loadSavedMovies();
        });

        return () => interactionPromise.cancel();
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

    // Debounced storage function
    const saveTotStorage = useCallback(
        (() => {
            let timeoutId: ReturnType<typeof setTimeout> | null = null;

            return (movies: Movie[]) => {
                // Clear previous timeout if it exists
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                }

                // Set a new timeout to delay the storage operation
                timeoutId = setTimeout(async () => {
                    try {
                        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
                    } catch (error) {
                        console.error('Error saving movies to storage:', error);
                    }
                    timeoutId = null;
                }, 300); // Debounce for 300ms
            };
        })(),
        []
    );

    const addToSaved = useCallback((movie: Movie) => {
        setSavedMovies(prevMovies => {
            // Check if movie already exists to prevent duplicates
            if (prevMovies.some(m => m.id === movie.id)) {
                return prevMovies;
            }
            const updatedMovies = [...prevMovies, movie];
            saveTotStorage(updatedMovies);
            return updatedMovies;
        });
    }, [saveTotStorage]);

    const removeFromSaved = useCallback((movieId: number) => {
        setSavedMovies(prevMovies => {
            const updatedMovies = prevMovies.filter(movie => movie.id !== movieId);
            saveTotStorage(updatedMovies);
            return updatedMovies;
        });
    }, [saveTotStorage]);

    const isMovieSaved = useCallback((movieId: number) => {
        return savedMovies.some(movie => movie.id === movieId);
    }, [savedMovies]);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        savedMovies,
        addToSaved,
        removeFromSaved,
        isMovieSaved,
        loading,
    }), [savedMovies, addToSaved, removeFromSaved, isMovieSaved, loading]);

    return (
        <SavedMoviesContext.Provider value={contextValue}>
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
