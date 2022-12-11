import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signUp, signIn, getAllUsers, getMessage, sendMessage, deleteMesssages } from "../Api/Api";
import jwt_decode from "jwt-decode";


export const signup = createAsyncThunk('/signup', async (formData) => {
    try {
        // console.log('here in client side');
        const { data } = await signUp(formData);
        // console.log('token');
        // console.log(data);
        return { token: data.token, isAuthenticated: true, userImage: data.userImage }
    }
    catch (error) {
        console.log(error.message)
    }
})

export const signin = createAsyncThunk('/signin', async (formData) => {
    try {
        const { data } = await signIn(formData);
        console.log(data);
        return { token: data.token, isAuthenticated: true, userImage: data.userImage }
    }
    catch (error) {
        console.log(error.response.data)
    }
})

export const getUsers = createAsyncThunk("/getUsers", async () => {
    try {
        const token = localStorage.getItem('profile');
        // console.log(token);
        const { data } = await getAllUsers(token);
        // console.log('Fucd');
        return data;
    }
    catch (error) {
        const { response: { data } } = error
        console.log("Her");
        console.log(error.response.data);
        return data;
    }
})

export const GetMessage = createAsyncThunk("/GetMessage", async (id) => {
    // console.log(profileImage, tagLine)
    try {
        const token = localStorage.getItem('profile');
        const { data } = await getMessage(id, token);
        console.log(data);
        console.log(data);
        return { data, id };
    }
    catch (error) {
        const { response: { data } } = error
        return data;

    }
})
export const SendMessage = createAsyncThunk("/SendMessage", async (formData) => {
    try {
        const token = localStorage.getItem('profile');
        const { data } = await sendMessage(formData, token);
        // console.log(data)
        const { connection } = data;
        const { sendMessages, recievedMessages } = connection[0];
        // console.log(sendMessages, recievedMessages)
        return { sendMessages, recievedMessages };
    }
    catch (error) {
        const { response: { data } } = error
        console.log(data);
        return data;
    }
})

export const deleteMesssage = createAsyncThunk("/deleteMessage", async (id) => {
    try {
        // console.log(id);
        const token = localStorage.getItem('profile');
        const { data } = await deleteMesssages(id, token);
        // console.log(data);
        return { data, id };
    }
    catch (error) {
        const { response: { data } } = error;
        // console.log("Here");
        // console.log(error)
        return data;

    }
})

const AuthSlice = createSlice({
    name: 'AuthSlice',
    initialState: {
        isAuthenticated: false,
        isClicked: false,
        userData: null,
        userId: "",
        recieverId: "",
        profile: "",
        recieverProfile: "",
        userImage: "",
        sendMessages: [],
        recievedMessages: [],
        users: [],
        serverMessages: [],
        isDeleted: false,
    },
    reducers: {
        toggleIsAuthenticated: (state, action) => {
            state.isAuthenticated = !state.isAuthenticated

        },
        checkAuthenticated: (state, action) => {
            const token = localStorage.getItem('profile');
            if (!token) {
                state.isAuthenticated = false;
                // console.log('rerer');
                return;
            }
            else {
                const decoded = jwt_decode(token);
                // console.log(decoded)
                const letter = decoded.email[0].toUpperCase();
                state.profile = letter;
                state.userImage = decoded.profileImage;
                state.isAuthenticated = true;
                state.userData = decoded;
                state.userId = decoded.id
                // console.log(state.userId)
            }
        },
        toggleIsClicked: (state, action) => {
            state.isClicked = true;
            state.sendMessages = [];
            state.recievedMessages = [];
            // console.log(state.sendMessages, state.recievedMessages)
        },
        setUserName: (state, action) => {
            // console.log(action.payload)
            const { username, profileImage, tagLine } = action.payload;
            state.userData = { username, profileImage, tagLine }
            state.recieverProfile = action.payload[0];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signup.fulfilled, (state, action) => {
            const { token, isAuthenticated, userImage } = action.payload;
            localStorage.setItem('profile', token);
            localStorage.setItem('image', userImage);
            state.isAuthenticated = isAuthenticated
            // console.log(state.isAuthenticated)
            const decode = jwt_decode(localStorage.getItem('profile'));
            state.userData = decode;
            state.userId = decode.id;
            state.userImage = userImage;

            console.log(state.userImage)
            // console.log('after signup');
        })
        builder.addCase(signin.fulfilled, (state, action) => {
            const { token, isAuthenticated, userImage } = action.payload;
            localStorage.setItem('profile', token);
            localStorage.setItem('image', userImage);
            state.isAuthenticated = true;
            const decode = jwt_decode(localStorage.getItem('profile'));
            state.userData = decode;
            state.userId = decode.id;
            state.userImage = userImage;
            console.log(state.userImage)


        })
        builder.addCase(getUsers.fulfilled, (state, action) => {
            // console.log("Here")
            console.log(action.payload);
            if (action.payload === "User not authenticated") {
                state.isAuthenticated = false;
                localStorage.removeItem('profile');
                return;
            }
            // console.log('after getting users');
            state.isAuthenticated = true;
            state.users = action.payload;
            console.log(state.users);
        })
        builder.addCase(getUsers.rejected, (state, action) => {
            console.log("Here")
            localStorage.removeItem('profile');
            localStorage.removeItem('image');
        }
        )
        builder.addCase(GetMessage.fulfilled, (state, action) => {
            const { sendMessages, recievedMessages } = action.payload.data;
            state.recieverId = action.payload.id;

            state.sendMessages = sendMessages.map((obj) => {
                return {
                    ...obj,
                    state: "sender",
                }
            });
            state.recievedMessages = recievedMessages.map((obj) => {
                return {
                    ...obj,
                    state: "reciever",
                }
            });
            state.serverMessages = state.sendMessages.concat(state.recievedMessages);
            // state.serverMessages.sort((a, b) => a.timeStamp?.localeCompare(b.timeStamp))
            state.serverMessages.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(b.time) - new Date(a.time);
            });
            console.log(state.serverMessages);

        })
        builder.addCase(SendMessage.fulfilled, (state, action) => {
            const { sendMessages, recievedMessages } = action.payload
            state.sendMessages = sendMessages;
            state.recievedMessages = recievedMessages;
        })
        builder.addCase(deleteMesssage.fulfilled, (state, action) => {
            state.sendMessages = [];
            state.recievedMessages = [];
            state.serverMessages = [];
            state.isDeleted = true;
            console.log("Hi")
        })
    }
})

export const { toggleIsAuthenticated, checkAuthenticated, toggleIsClicked, setUserName } = AuthSlice.actions;
export default AuthSlice.reducer;