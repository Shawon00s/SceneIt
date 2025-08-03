import express from 'express';
import {
    trackMovieSearch,
    getTrendingMovies,
    getMovieSearchStats,
    getTrendingStats
} from '../controllers/trendingController.js';

const router = express.Router();

// POST /api/trending/track - Track a movie search
router.post('/track', trackMovieSearch);

// GET /api/trending/movies - Get trending movies
// Query params: limit (default: 20), timeframe (all|week|month|year)
router.get('/movies', getTrendingMovies);

// GET /api/trending/stats/:movieId - Get search stats for specific movie
router.get('/stats/:movieId', getMovieSearchStats);

// GET /api/trending/stats - Get overall trending statistics
router.get('/stats', getTrendingStats);

export default router;
