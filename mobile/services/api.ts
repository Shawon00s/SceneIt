export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchMovies = async ({
  query,
  pages = 3, // Fetch 3 pages by default (60 movies)
}: {
  query: string;
  pages?: number;
}): Promise<Movie[]> => {
  const allMovies: Movie[] = [];

  for (let page = 1; page <= pages; page++) {
    const endpoint = query
      ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
      : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.statusText}`);
      }

      const data = await response.json();

      // If no results on this page, break the loop
      if (!data.results || data.results.length === 0) {
        break;
      }

      allMovies.push(...data.results);

      // If we've reached the last page of results, break
      if (page >= data.total_pages) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      // Continue with other pages even if one fails
      continue;
    }
  }

  return allMovies;
};

// New function for single page fetching (for infinite scroll)
export const fetchMoviesPage = async ({
  query,
  page = 1,
}: {
  query: string;
  page?: number;
}): Promise<Movie[]> => {
  const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results || [];
}; export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchMovieReviews = async (
  movieId: string
): Promise<ReviewsResponse> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie reviews: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    throw error;
  }
};

export const fetchMovieCredits = async (
  movieId: string
): Promise<MovieCredits> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie credits: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

// Trending Movies API Configuration
const BACKEND_URL = 'http://192.168.0.110:3000'; // Update with your backend URL

// Track movie search for trending analysis
export const trackMovieSearch = async (movie: Movie): Promise<void> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${BACKEND_URL}/api/trending/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        overview: movie.overview,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to track movie search: ${response.statusText}`);
    }

    // Optional: log success for debugging
    console.log(`✅ Tracked search for: ${movie.title}`);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log(`⏱️ Tracking timeout for: ${movie.title}`);
    } else {
      console.log(`❌ Failed to track search for: ${movie.title} -`, error.message);
    }
    // Don't throw error to prevent breaking the main functionality
  }
};

// Fetch trending movies from backend
export const fetchTrendingMovies = async ({
  limit = 20,
  timeframe = 'all'
}: {
  limit?: number;
  timeframe?: 'all' | 'week' | 'month' | 'year';
} = {}): Promise<Movie[]> => {
  try {
    console.log('Fetching trending movies from:', `${BACKEND_URL}/api/trending/movies`);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${BACKEND_URL}/api/trending/movies?limit=${limit}&timeframe=${timeframe}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Trending movies fetched successfully:', data.results?.length || 0, 'movies');
    return data.results || [];
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Trending movies request timed out');
    } else if (error.message?.includes('Network request failed')) {
      console.error('Backend server not reachable. Make sure backend is running on:', BACKEND_URL);
    } else {
      console.error('Error fetching trending movies:', error.message);
    }
    throw error;
  }
};

// Get search statistics for a specific movie
export const getMovieSearchStats = async (movieId: number): Promise<any> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/trending/stats/${movieId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movie stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching movie stats:', error);
    throw error;
  }
};