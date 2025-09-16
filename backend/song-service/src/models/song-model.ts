import mongoose from "mongoose"

const song = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        unique: true
    },
    artists: [{
        type: String,
        required: true
    }],  
    album: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    audioUrl: {
        type: String,
        required: true, 
        unique: true
    }   
});

export const Song = mongoose.model("Song", song);