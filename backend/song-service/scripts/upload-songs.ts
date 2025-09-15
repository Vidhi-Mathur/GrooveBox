import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Song } from "../src/models/song-model"

dotenv.config()

const region = process.env.AWS_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const mongoUrl = process.env.MONGODB_URL
const songsDirectory = process.env.SONGS_DIRECTORY

//Settings for AWS S3
const s3 = new S3Client({ region })

const uploadSongs = async() => {
    console.log("Starting upload")
    console.log("Local Directory: ", songsDirectory)

    //Connect to DB
    await mongoose.connect(`${mongoUrl}`)
    console.log("Connected to MongoDB")

    //Read files
    const files = fs.readdirSync(`${songsDirectory}`).filter(f => f.endsWith(".mp3"))

    for(const file of files){
        try {
            const [title, album, allArtists, yearRaw] = file.replace(".mp3", "").split("_")
            const artists = allArtists.split("-")
            const year = parseInt(yearRaw)
            const filePath = path.join(`${songsDirectory}`, file)

            //Duplicate
            const existingSong = await Song.findOne({ title });
            if(existingSong){
                console.log(`⚠️ Skipped (already in DB): ${title}`);
                continue;
            }

            //Upload to S3
            const fileStream = fs.createReadStream(filePath)

            await s3.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: title,
                    Body: fileStream,
                    ContentType: "audio/mpeg",
                })
            )
            console.log(`Uploaded to S3: ${title}`)

            //Build public URL
            const audioUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${title}`

            //Save metadata to DB
            const song = new Song({
                title,
                album,
                artists,
                year,
                duration: null,
                audioUrl
            })
            await song.save()
            console.log(`Saved in DB: ${song.title}`)
        } 
        catch(err){
            console.error(`Failed for ${file}`, err)
        }
    }
    await mongoose.disconnect()
    console.log("Upload completed")
}

uploadSongs().catch(err => {
    console.error("Error in uploadSongs:", err)
    mongoose.disconnect()
})  