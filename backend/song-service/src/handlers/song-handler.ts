import { sendUnaryData, ServerWritableStream, status } from "@grpc/grpc-js"
import { SongRequest } from "../generated/song/SongRequest"
import { SongServiceHandlers } from "../generated/song/SongService"
import { SongResponse } from "../generated/song/SongResponse"
import { Empty } from "../generated/song/Empty"
import { Song } from "../models/song-model"

//Implementation for RPC, as defined in song.proto
export const handlers: SongServiceHandlers = {
    GetSong: async(call: { request: SongRequest }, callback: sendUnaryData<SongResponse>) => {
        try {
            console.log("Handler called, request:", call.request);
            let { id } = call.request
            const song = await Song.findById(id)
            if(!song){
                return callback({ code: status.NOT_FOUND, message: "Song not found" } as any, null)
            }
            const response: SongResponse = {
                id: song._id.toString(),
                title: song.title,
                artists: song.artists,
                album: song.album,
                year: song.year,
                audioUrl: song.audioUrl
            }
            callback(null, response)
        }
        catch(err){
            callback({ code: status.INTERNAL, message: (err as Error).message } as any, null)
        }
    },
    //No input, just stream all songs
    StreamSongs: async(call: ServerWritableStream<Empty, SongResponse>) => {   
        try {
            const songs = await Song.find()
            songs.forEach(song => {
                const response: SongResponse = {
                    id: song._id.toString(),
                    title: song.title,
                    artists: song.artists,
                    album: song.album,
                    year: song.year,
                    audioUrl: song.audioUrl
                }
                call.write(response)
            })
            call.end()
        }
        catch(err){
            call.emit('error', { code: status.INTERNAL, message: (err as Error).message } as any)
        }
    }
}