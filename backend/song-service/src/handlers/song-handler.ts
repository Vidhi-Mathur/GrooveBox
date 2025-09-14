import { sendUnaryData, ServerWritableStream, status } from "@grpc/grpc-js";
import { SongRequest } from "../generated/song/SongRequest";
import { SongServiceHandlers } from "../generated/song/SongService";
import { SongResponse } from "../generated/song/SongResponse";
import { Empty } from "../generated/song/Empty";

const songs: SongResponse[] = [
  { id: "1", title: "Imagine", artist: "John Lennon", album: "Imagine", year: 1971, duration: 183 },
  { id: "2", title: "Billie Jean", artist: "Michael Jackson", album: "Thriller", year: 1982, duration: 294 },
];

//Implementation for RPC, as defined in song.proto
export const handlers: SongServiceHandlers = {
    GetSong: (call: { request: SongRequest }, callback: sendUnaryData<SongResponse>) => {
        let { id } = call.request;
        const song = songs.find(s => s.id === id);
        if(song) callback(null, song);
        else callback({ code: status.NOT_FOUND, message: "Song not found" } as any, null);
    },
    //No input, just stream all songs
    StreamSongs: (call: ServerWritableStream<Empty, SongResponse>) => {   
        songs.forEach(song => call.write(song))
        call.end()
    }
}