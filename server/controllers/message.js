const { connect } = require("mongoose");
const User = require("../models/User")

const getMessage = async (req, res) => {
    const userId = req.userId;
    const recieverId = req.body.id;
    let user = await User.findOne({ _id: userId });
    // console.log(userId, recieverId);
    try {
        let connection = user.network.filter((userObj) => userObj.recieverId === recieverId);
        if (connection.length == 0) {
            await User.update({ _id: userId }, {
                $push: {
                    network: {
                        userId: userId,
                        recieverId: recieverId,
                        sendMessages: [],
                        recievedMessages: []
                    }
                }
            })
        }
        user = await User.findOne({ _id: userId });
        connection = user.network.filter((userObj) => userObj.recieverId === recieverId);
        const { sendMessages, recievedMessages } = connection[0];
        res.status(200).json({ sendMessages, recievedMessages });
    }
    catch (error) {
        res.status(404).json("Id not given");
    }
}


const sendMessage = async (req, res) => {
    const userId = req.userId;
    const recieverId = req.body.id;
    const message = req.body.message;
    // console.log(userId, recieverId, message)
    try {
        let user = await User.findOne({ _id: userId });
        // console.log(user)
        const { network } = user;
        let connection = network.filter((userObj) => userObj.recieverId === recieverId);
        if (connection.length == 0) {
            await User.update({ _id: userId }, {
                $push: {
                    network: {
                        userId: userId,
                        recieverId: recieverId,
                        sendMessages: [],
                        recievedMessages: []
                    }
                }
            })
        }
        user = await User.findOne({ _id: userId });
        connection = user.network.filter((userObj) => userObj.recieverId === recieverId);
        connection[0].sendMessages.push(message);
        await user.save();

        let reciever = await User.findOne({ _id: recieverId });
        // console.log(reciever);
        let recieverConnection = reciever.network.filter((userObj) => userObj.recieverId === userId);
        // console.log(recieverConnection);
        if (recieverConnection.length == 0) {
            await User.update({ _id: recieverId }, {
                $push: {
                    network: {
                        userId: recieverId,
                        recieverId: userId,
                        sendMessages: [],
                        recievedMessages: []
                    }
                }
            })
        }
        reciever = await User.findOne({ _id: recieverId });
        recieverConnection = reciever.network.filter((userObj) => userObj.recieverId === userId);
        recieverConnection[0].recievedMessages.push(message);
        await reciever.save();

        res.status(200).json({ connection, recieverConnection });

    }
    catch (error) {
        // console.log(error.message);
        res.status(200).json("Send Message");
    }
}


const getAllUsers = async (req, res) => {
    try {
        const data = await User.find({});
        // console.log(data);
        const result = data.map((obj) => {
            return { username: obj.name, id: obj._id, profileImage: obj?.profileImage, tagLine: obj?.tagLine }
        });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json("Problem is in gettting all users");
    }

}


const deleteMesssages = async (req, res) => {
    try {
        const userId = req.userId;
        const recieverId = req.body.id;
        let user = await User.findOne({ _id: userId });
        // console.log(user)
        const { network } = user;
        let connection = network.filter((userObj) => userObj.recieverId === recieverId);
        connection[0].sendMessages = []
        connection[0].recievedMessages = []
        await user.save();
        res.status(200).json("Deleted Successfully");
    }
    catch (error) {
        console.log(error);
        // console.log(error.message);
        res.status(500).json("Deletion Unsuccessfull");
    }

}
module.exports = { getMessage, sendMessage, getAllUsers, deleteMesssages }