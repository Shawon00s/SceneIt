import MovieSearch from '../models/MovieSearch.js';

// Track a movie search
export const trackMovieSearch = async (req, res) => {
    try {
        const { movieId, title, poster_path, vote_average, release_date, overview } = req.body;

        if (!movieId || !title) {
            return res.status(400).json({ error: 'Movie ID and title are required' });
        }

        // Check if movie already exists in search tracking
        const existingMovie = await MovieSearch.findOne({ movieId });

        if (existingMovie) {
            // Increment search count and update last searched time
            existingMovie.searchCount += 1;
            existingMovie.lastSearched = new Date();
            await existingMovie.save();

            res.json({
                message: 'Movie search count updated',
                movie: existingMovie
            });
        } else {
            // Create new entry for this movie
            const newMovieSearch = new MovieSearch({
                movieId,
                title,
                poster_path,
                vote_average,
                release_date,
                overview,
                searchCount: 1
            });

            await newMovieSearch.save();

            res.json({
                message: 'Movie search tracked',
                movie: newMovieSearch
            });
        }
    } catch (error) {
        console.error('Error tracking movie search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get trending movies based on search count
export const getTrendingMovies = async (req, res) => {
    try {
        const { limit = 20, timeframe = 'all' } = req.query;

        let dateFilter = {};

        // Apply timeframe filter
        if (timeframe !== 'all') {
            const now = new Date();
            let daysAgo;

            switch (timeframe) {
                case 'week':
                    daysAgo = 7;
                    break;
                case 'month':
                    daysAgo = 30;
                    break;
                case 'year':
                    daysAgo = 365;
                    break;
                default:
                    daysAgo = 7;
            }

            const startDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
            dateFilter = { lastSearched: { $gte: startDate } };
        }

        const trendingMovies = await MovieSearch
            .find(dateFilter)
            .sort({
                searchCount: -1,
                lastSearched: -1
            })
            .limit(parseInt(limit))
            .select('-createdAt -__v');

        // Convert to TMDB-like format
        const formattedMovies = trendingMovies.map(movie => ({
            id: movie.movieId,
            title: movie.title,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            overview: movie.overview,
            searchCount: movie.searchCount,
            lastSearched: movie.lastSearched
        }));

        res.json({
            results: formattedMovies,
            total_results: formattedMovies.length,
            timeframe,
            message: 'Trending movies retrieved successfully'
        });
    } catch (error) {
        console.error('Error getting trending movies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get search statistics for a specific movie
export const getMovieSearchStats = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movieStats = await MovieSearch.findOne({ movieId });

        if (!movieStats) {
            return res.status(404).json({ error: 'Movie not found in search tracking' });
        }

        res.json({
            movieId: movieStats.movieId,
            title: movieStats.title,
            searchCount: movieStats.searchCount,
            lastSearched: movieStats.lastSearched,
            createdAt: movieStats.createdAt
        });
    } catch (error) {
        console.error('Error getting movie stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get overall trending statistics
export const getTrendingStats = async (req, res) => {
    try {
        const totalMovies = await MovieSearch.countDocuments();
        const totalSearches = await MovieSearch.aggregate([
            { $group: { _id: null, total: { $sum: '$searchCount' } } }
        ]);

        const topMovie = await MovieSearch
            .findOne()
            .sort({ searchCount: -1 })
            .select('title searchCount');

        const recentSearches = await MovieSearch
            .find()
            .sort({ lastSearched: -1 })
            .limit(5)
            .select('title searchCount lastSearched');

        res.json({
            totalMoviesTracked: totalMovies,
            totalSearches: totalSearches[0]?.total || 0,
            topMovie,
            recentSearches
        });
    } catch (error) {
        console.error('Error getting trending stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
