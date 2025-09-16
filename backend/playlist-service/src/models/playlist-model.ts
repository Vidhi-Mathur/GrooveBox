import mongoose from "mongoose";

const playlist = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    songId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        required: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export const Playlist = mongoose.model("Playlist", playlist);