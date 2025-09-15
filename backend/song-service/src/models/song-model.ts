import mongoose from "mongoose"

const song = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        unique: true
    },
    artists: [String],  
    album: String,
    year: Number,
    duration: Number,
    audioUrl: String    
});

export const Song = mongoose.model("Song", song);