import { Request,Response,NextFunction,RequestHandler } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

export const authMiddleware=(
    req:Request,
    res:Response,
    next:NextFunction
):void=>{
    const authHeader=req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    
    res.status(401).json({ message: 'Unauthorized - No token' });
    return 
  }

  const token = authHeader.split(' ')[1];

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };

    (req as any).user = decoded;
    next()
  }catch(error){
    
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
    
  }
}