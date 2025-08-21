import mongoose,{Schema,Document, Types} from "mongoose";

export interface ITutor extends Document{
     _id: string,
    name:string,
    email:string,
    phone:string,
    password:string,
    profilePic: string;
    isGoogleSignup:boolean,
    status:'pending'|'verification-submitted'|'approved'|'rejected',
    role:'tutor',
    walletBalance:number;
    verificationDetails?:{
    summary: string;
    education: string;
    experience: string;
    idProof: string;
    resume: string;
   
    }
}

const tutorSchema= new Schema<ITutor>({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String},
    password:{type:String},
    profilePic: {
      type: String,
      default:
        "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg",
    },
    isGoogleSignup:{type:Boolean,default:false},
    status:{type:String,enum:['pending','verification-submitted','approved','rejected'],default:'pending'},
    role:{type:String,default:'tutor'},
     walletBalance: { type: Number, default: 0 },
     verificationDetails: {
    summary: String,
    education: String,
    experience: String,
    idProof: String,
    resume: String,
  },
  
},{ timestamps: true })

const Tutor = mongoose.model<ITutor>('Tutor', tutorSchema);
tutorSchema.index({ status: 1, createdAt: -1 });
tutorSchema.index({ email: 1 }, { unique: true });
export default Tutor;