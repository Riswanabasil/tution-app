import jwt from 'jsonwebtoken'

const ACCESS_TOKEN=process.env.JWT_SECRET as string
const REFRESH_TOKEN=process.env.JWT_REFRESH_SECRET as string

export const generateAccessToken=(id:string,email:string,role:string):string=>{
    return jwt.sign({id,email,role},ACCESS_TOKEN,{ expiresIn: '15m' })
}


export const generateRefreshToken=(id:string,email:string,role:string):string=>{
    return jwt.sign({id,email,role},REFRESH_TOKEN,{ expiresIn: '7d' })
}
