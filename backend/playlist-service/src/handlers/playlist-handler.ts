import { sendUnaryData, status } from "@grpc/grpc-js";
import { PlaylistServiceHandlers } from "../generated/playlist/PlaylistService";
import { PlaylistResponse } from "../generated/playlist/PlaylistResponse";
import { PlaylistIDRequest } from "../generated/playlist/PlaylistIDRequest";
import { Playlist } from "../models/playlist-model";
import { CreatePlaylistRequest } from "../generated/playlist/CreatePlaylistRequest";
import { PlaylistIDResponse } from "../generated/playlist/PlaylistIDResponse";
import { UpdatePlaylistRequest } from "../generated/playlist/UpdatePlaylistRequest";

export const handlers: PlaylistServiceHandlers = {
    GetPlaylist: async(call: {request: PlaylistIDRequest}, callback: sendUnaryData<PlaylistResponse>) => {
        try {
            let { id } = call.request
            const playlist = await Playlist.findById(id)
            if(!playlist){
                return callback({ code: status.NOT_FOUND, message: "Playlist not found" } as any, null)
            }
            let response: PlaylistResponse = {
                id: playlist._id.toString(),
                name: playlist.name,
                songId: playlist.songId.map(id => id.toString()),
                userId: playlist.userId.toString()
            }
            callback(null, response)    
        }
        catch(err){
            callback({ code: status.INTERNAL, message: (err as Error).message } as any, null)
        }
    },
    CreatePlaylist: async(call: {request: CreatePlaylistRequest}, callback: sendUnaryData<PlaylistIDResponse>) => {
        try {
            const { name, songId, userId } = call.request
            const playlist = new Playlist({ 
                name, 
                songId,
                userId
            })
            await playlist.save()
            let response: PlaylistIDResponse = {
                id: playlist._id.toString()
            }
            callback(null, response)
        }
        catch(err){
            callback({ code: status.INTERNAL, message: (err as Error).message } as any, null)
        }
    },
    UpdatePlaylist: async(call: {request: UpdatePlaylistRequest}, callback: sendUnaryData<PlaylistIDResponse>) => {
        try {
            let { id, name, songId } = call.request
            const playlist = await Playlist.findByIdAndUpdate(id, {
                name, 
                songId
            }, { new: true })
            if(!playlist){
                return callback({ code: status.NOT_FOUND, message: "Playlist not found" } as any, null)
            }
            let response: PlaylistIDResponse = {
                id: playlist._id.toString()
            }
            callback(null, response)
        }
        catch(err){
            callback({ code: status.INTERNAL, message: (err as Error).message } as any, null)
        }
    },
    DeletePlaylist: async(call: {request: PlaylistIDRequest}, callback: sendUnaryData<PlaylistIDResponse>) => {
        try {
            let { id } = call.request
            const playlist = await Playlist.findByIdAndDelete(id)
            if(!playlist){
                return callback({ code: status.NOT_FOUND, message: "Playlist not found" } as any, null)
            }
            let response: PlaylistIDResponse = {
                id: playlist._id.toString()
            }
            callback(null, response)
        }
        catch(err){
            callback({ code: status.INTERNAL, message: (err as Error).message } as any, null)
        }
    }
}