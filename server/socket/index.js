let users = [];
const addUser = (userData, socketId) => {
    if (userData.receiverId === "") {
        return;
    }
    if (users.find(user => user.userId === userData.userId != undefined)) {
        console.log('here');
        users = users.filter(user => user.userId !== userData.userId)
        users.push({ ...userData, socketId });
    }
    else {
        users.push({ ...userData, socketId })
    }
    // !users.some(user => user.recieverId === userData.recieverId) && users.push({ ...userData, socketId });
    // users.push({ userData, socketId });
}

const getUser = (id) => {
    // console.log(users);
    return users.find(user => user.userId === id);
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

module.exports = { getUser, addUser, removeUser, users };