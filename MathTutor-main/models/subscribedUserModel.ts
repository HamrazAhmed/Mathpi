import mongoose from "mongoose"

const authSchema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already subscribed"]
    },
    name: {
        type: String,
        trim: true
    },
}, {timestamps: true})


const SubscribedAuthenticationModel = mongoose.models.Authentication || mongoose.model("subscribedUsers", authSchema);
export default SubscribedAuthenticationModel