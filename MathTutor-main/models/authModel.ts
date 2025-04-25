import mongoose from "mongoose"

const authSchema= new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is already taken"],
        unique: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isGoogleSignedIn: {
        type: Boolean,
        default: false
    },
    credits: {
        type: Number,
        default: 50
    },
    resetPasswordToken: {
        type: String,
        default: ""
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    plan: {
        type:String,
        default: ""
    },
    customer: {
        type:String,
        default: ""
    },
    roadmapCreated: {
        type: Number,
        default: 0
    },
    subscriptionId: {
        type:String,
        default: ""
    }
}, {timestamps: true})


const UserAuthenticationModel = mongoose.models.Authentication || mongoose.model("Authentication", authSchema);
export default UserAuthenticationModel