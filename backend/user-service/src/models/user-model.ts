import mongoose from "mongoose"
const schema = mongoose.Schema

const user = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    playlists: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Playlist'
    }],
    refreshToken: {
        type: String
    }
})

export const User = mongoose.model("User", user);