const User = require("../models/User")
const jwt = require("jsonwebtoken")



const signUp = async (req, res) => {
    const data = req.body;
    const { email } = data;
    // console.log(data);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status("404").json({ message: "User already exists" });
        }
        const user = await User.create(data);
        const token = jwt.sign({ email: user.email, id: user._id, username: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, userImage: user.profileImage });
    }
    catch (error) {
        // console.log(error.message)
        res.status(500).json({ 'msg': "Something want wrong" })

    }
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.password === password) {
                const token = jwt.sign({ email: existingUser.email, id: existingUser._id, username: existingUser.name, }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.status(200).json({ token, userImage: existingUser.profileImage });
            }
            else {
                return res.status(404).json({ message: "Password not matches" });
            }

        }
        return res.status(404).json({ message: "Invalid Credientials" });
    }
    catch (error) {
        // console.log(error)
        res.status(500).json({ 'msg': "Something want wrong" })

    }
}


module.exports = { signUp, signIn }; 