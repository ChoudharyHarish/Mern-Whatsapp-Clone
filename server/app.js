require("dotenv").config()
const connectDB = require("./db/connection")
const cors = require("cors");
const express = require("express")
const authMiddleWare = require("./middleware/authMiddleWare");
const authRouter = require('./routes/auth')
const messageRouter = require("./routes/message");
const bodyParser = require('body-parser')
const { addUser, getUser, removeUser, users } = require("./socket/index");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '60mb', extended: true }));


app.get("/", (req, res) => {
    res.json({ "message": "Build Succeded" })
})

app.use("/api/auth", authRouter);
app.use("/api/chats", authMiddleWare, messageRouter);

const start = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        await connectDB(process.env.MONGO_URL);
        const server = app.listen(PORT, () => {
            console.log("Server started successfully");
        })
        console.log('Here')
        const io = require('socket.io')(server, {
            cors: {
                origin: ['http://mern-whatsapp-clone-h38r.vercel.app/']
                // origin: ['http://localhost:3000']
            }
        });
        io.on('connection', (socket) => {
            console.log('user connected')

            //connect
            socket.on("addUser", userData => {
                addUser(userData, socket.id);
                io.emit("getUsers", users);
            })

            //send message
            socket.on('sendMessage', (data) => {
                const user = getUser(data.recieverId);

                io.to(user?.socketId).emit('getMessage', data)
            })

            //disconnect
            socket.on('disconnect', () => {
                console.log('user disconnected');
                removeUser(socket.id);
                io.emit('getUsers', users);
            })
        })
    }
    catch (error) {
        console.log('Database connection not completed');
    }
}


start();

module.exports = app;
