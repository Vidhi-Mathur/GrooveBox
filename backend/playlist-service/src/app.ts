import path from "path"
import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import { handlers } from "./handlers/playlist-handler" 
import mongoose from "mongoose" 
import dotenv from "dotenv"
import { ProtoGrpcType } from "./generated/playlist"

dotenv.config()

//Define path to load definitions
const PROTO_PATH = path.join(__dirname, "../src/proto/playlist.proto")

//Parse to js object
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

//Convert to usable grpc object
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType

//Create server
const server = new grpc.Server();

//Register service and map proto RPC methods to actual handlers
server.addService((protoDescriptor.playlist.PlaylistService).service, handlers)

const startServer = async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        //Bind server to port (Host: 0.0.0.0 and Port: 50052)
        server.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), (err) => {
            if(err){
                console.error(err)
            }
            else server.start();
        })      
    }
    catch(err){
        console.error(err)
    }
}

startServer()