import mongoose,{Schema,Document, Types} from "mongoose";

export interface ITutor extends Document{
     _id: string,
    name:string,
    email:string,
    phone:string,
    password:string,
    isGoogleSignup:boolean,
    status:'pending'|'verification-submitted'|'approved'|'rejected',
    role:'tutor',
     assignedCourses: Types.ObjectId[]
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
    isGoogleSignup:{type:Boolean,default:false},
    status:{type:String,enum:['pending','verification-submitted','approved','rejected'],default:'pending'},
    role:{type:String,default:'tutor'},
    assignedCourses:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
     verificationDetails: {
    summary: String,
    education: String,
    experience: String,
    idProof: String,
    resume: String,
  },
  
},{ timestamps: true })

const Tutor = mongoose.model<ITutor>('Tutor', tutorSchema);
export default Tutor;