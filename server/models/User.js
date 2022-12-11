const mongoose = require("mongoose")



//Id field bcoz of google auth token
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: {
        type: String
    },
    id: { type: String },
    tagLine: String,
    network: [{
        userId: String,
        recieverId: String,
        sendMessages: { type: Array, default: [] },
        recievedMessages: { type: Array, default: [] }
    }],
},
    {
        timestamps: true,
    })




const User = new mongoose.model('User', UserSchema);

module.exports = User;