import mongoose,{Schema, Document} from "mongoose";

export interface IStudentOtp extends Document {
    email:string,
    otp:string,
    expiresAt:Date,
    createdAt:Date
}

const studentOtpSchema= new Schema<IStudentOtp>(
    {
        email:{type:String,required:true},
        otp:{type:String,required:true},
        expiresAt:{type:Date,required:true},
        createdAt:{type:Date,default:Date.now}
    },
    {
        timestamps:false
    }
)

studentOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IStudentOtp>('StudentOtp', studentOtpSchema);