import dotenv from "dotenv"
import path from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { ProtoGrpcType } from "./generated/song"
import { handlers } from "./handlers/song-handler"
import mongoose from "mongoose"

dotenv.config()

//Define path to load definitions
const PROTO_PATH = path.join(__dirname, "../src/proto/song.proto")

//Parse to js object
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

//Convert to usable grpc object
let protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType

//Create server
const server = new grpc.Server();

//Register service and map proto RPC methods to actual handlers
server.addService((protoDescriptor.song.SongService).service, handlers)


const startServer = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        //Bind server to port (Host: 0.0.0.0 and Port: 50051)
        server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err) => {
            if(err){
                console.error(err)
                return;
            }
            else server.start();
        })
    }
    catch(err){
        console.error(err)
    }
}

startServer()