import dotenv from "dotenv"
import { User } from "../models/user-model"
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express"

dotenv.config()

const generateAccessToken = (payload: JwtPayload) => {
    return jwt.sign(payload, `${process.env.ACCESS_SECRET_KEY}`, { expiresIn: '15m' })
}

const generateRefreshToken = (payload: JwtPayload) => {
    return jwt.sign(payload, `${process.env.REFRESH_SECRET_KEY}`, { expiresIn: '7d' })
}

export const postSignup = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email, password} = req.body
        let existingUser = await User.findOne({ email })
        //User already exists
        if(existingUser){
            return res.status(409).json({message: 'User already exists, try login instead'})
        }
        let hashedPassword = await bcrypt.hash(password, 12)
        //Create user
        let newUser = new User({
            name,
            email,
            password: hashedPassword,
            playlists: []
        })
        //Generating token
        let accessToken = generateAccessToken({ _id: newUser._id })
        let refreshToken = generateRefreshToken({ _id: newUser._id })
        newUser.refreshToken = await bcrypt.hash(refreshToken, 12);
        await newUser.save()
        res.status(200).json({accessToken, refreshToken, name: newUser.name, email: newUser.email})
    }
    catch(err) {
        next(err)
    }
}

export const postLogin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        let existingUser = await User.findOne({ email })
        //Email doesn't exist, so signup
        if(!existingUser){
            return res.status(404).json({message: 'No User found. Try signup instead'})
        }
        let validPassword = await bcrypt.compare(password, existingUser.password)
        //Incorrect password
        if(!validPassword){
            return res.status(401).json({message: 'Incorrect password'})
        }
        //Generating token
        let accessToken = generateAccessToken({ _id: existingUser._id })
        let refreshToken = generateRefreshToken({ _id: existingUser._id })
        existingUser.refreshToken = await bcrypt.hash(refreshToken, 12);
        await existingUser.save()
        res.status(200).json({accessToken, refreshToken, name: existingUser.name, email})
    }
    catch(err){
        next(err)
    }
}

export const postLogout = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let authorization = await req.headers.authorization
        if(!authorization) return res.status(401).json({message: 'Unauthorized'})
        //Not a token
        let token = await authorization.split(' ')[1]
        let decodedToken
        try {
            decodedToken = await jwt.verify(token, `${process.env.ACCESS_SECRET_KEY}`) as JwtPayload;
        } 
        catch(err) {
            return res.status(401).json({ message: 'Invalid refresh token' })
        }
        const userId = decodedToken._id;
        if (!userId) return res.status(400).json({ message: 'Invalid token' });
        //Update
        await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
        res.status(200).json({message: 'Logged out successfully'})
    }
    catch(err) {
        next(err)
    }
}

export const postRefreshToken = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body
        if(!refreshToken) return res.status(401).json({ message: 'Unauthorized' })
        let decodedToken
        try {
            decodedToken = await jwt.verify(refreshToken, `${process.env.REFRESH_SECRET_KEY}`) as JwtPayload
        } 
        catch(err) {
            return res.status(401).json({ message: 'Invalid refresh token' })
        }
        const user = await User.findById(decodedToken._id)
        if(!user || !user.refreshToken) return res.status(401).json({ message: 'Unauthorized' })
        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isMatch) return res.status(401).json({ message: "Unauthorized" });
        //Generate new to make refresh tokens single use
        const newAccessToken = generateAccessToken({_id: user._id})
        const newRefreshToken = generateRefreshToken({_id: user._id})
        user.refreshToken = await bcrypt.hash(newRefreshToken, 12);
        await user.save()
        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    }
    catch(err) {
        next(err)
    }
}

export const authorizationMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    try {
        //No authorization header set
        let authorization = await req.headers.authorization
        if(!authorization) return res.status(401).json({message: 'Unauthorized'})
        //Not a token
        let token = await authorization?.split(' ')[1]
        if(!token) return res.status(401).json({message: 'Unauthorized'})
        //Verify
        let decodedToken
        try {
            decodedToken = await jwt.verify(token, `${process.env.ACCESS_SECRET_KEY}`)
        }
        catch(err){
            if(err instanceof jwt.TokenExpiredError){
                return res.status(401).json({message: 'Token expired'})
            }
            return res.status(401).json({message: 'Invalid token'})
        }
        req.user = decodedToken
        next()
    }
    catch(err){
        next(err)
    }
}