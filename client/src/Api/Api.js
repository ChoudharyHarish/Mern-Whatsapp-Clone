import axios from 'axios'

// const url = "http://localhost:5000/api";
const url = "https://mern-whatsapp-clone.vercel.app/api";

const signUp = (form) => axios.post(`${url}/auth/signup`, form);
const signIn = (form) => axios.post(`${url}/auth/signIn`, form);

const getMessage = (id, token) => axios.post(`${url}/chats/getMessage`, { id }, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
const sendMessage = (data, token) => axios.post(`${url}/chats/messages`, { id: data.recieverId, message: data.message }, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
const getAllUsers = (token) => axios.get(`${url}/chats/messages`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const deleteMesssages = (id, token) => axios.post(`${url}/chats/messages/delete`, { id }, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
})


export { signUp, signIn, getMessage, sendMessage, getAllUsers, deleteMesssages };