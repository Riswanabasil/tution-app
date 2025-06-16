import mongoose, { Document, Schema } from "mongoose";

export interface Istudent extends Document {
    _id: string;
    name:string,
    email:string,
    password:string,
    phone:string,
    isGoogleSignup:boolean,
    isBlocked:boolean,
    role:'student',
    isVerified:boolean
}

const studentSchema= new Schema<Istudent>(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        phone:{type:String,required:false},
        password:{type:String,required:false},
        isGoogleSignup:{type:Boolean,default:false},
        isBlocked:{type:Boolean,default:false},
        role:{type:String,default:'student'},
        isVerified:{type:Boolean,default:false}
    },{
        timestamps:true
    }
)
const Student= mongoose.model<Istudent>("Student",studentSchema)
export default Student