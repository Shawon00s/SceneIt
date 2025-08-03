import mongoose from 'mongoose';

const movieSearchSchema = new mongoose.Schema({
    movieId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    poster_path: {
        type: String
    },
    vote_average: {
        type: Number
    },
    release_date: {
        type: String
    },
    overview: {
        type: String
    },
    searchCount: {
        type: Number,
        default: 1
    },
    lastSearched: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
movieSearchSchema.index({ searchCount: -1, lastSearched: -1 });
movieSearchSchema.index({ movieId: 1 });

const MovieSearch = mongoose.model('MovieSearch', movieSearchSchema);

export default MovieSearch;
