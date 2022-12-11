import React, { useEffect, useState } from 'react'
import CommentIcon from '@mui/icons-material/Comment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';
import Avatar from '@mui/material/Avatar'
// import image from "./Harish.jpeg"
import "./SideBar.css"
// import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import SideBarPreview from './SideBarPreview';
import { IconButton } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import { useSelector, useDispatch } from 'react-redux';
import { toggleIsClicked, GetMessage, setUserName } from "../../Store/AuthSlice";


function SideBar() {

    const dispatch = useDispatch();
    let serverUsers = useSelector((state) => state.auth.users);
    const profile = localStorage.getItem('image')
    const userId = useSelector((state) => state.auth.userId);
    const [search, setSearch] = useState("");
    serverUsers = serverUsers.filter((user) => user.id !== userId)
    let [users, setUsers] = useState();


    useEffect(() => {
        console.log(profile)

    }, [profile]);

    // console.log(users);
    const getMessage = (id, username, tagLine, profileImage) => {

        dispatch(toggleIsClicked());
        document.querySelector(".sideBar").classList.add('hidePreview');
        dispatch(setUserName({ username, tagLine, profileImage }))
        dispatch(GetMessage(id, username, tagLine, profileImage));
    }



    const handleChange = (e) => {
        console.log(e.target.value);
        let { value } = e.target;
        serverUsers = users
        setSearch(value);
        if (value === "") {
            setUsers(serverUsers);
            return;
        }
        value = value.toLowerCase();
        users = users.filter((user) => user.username.toLowerCase().indexOf(value) > -1)
        setUsers(users);
        if (users.length === 0) {
            setUsers(serverUsers);
            return;
        }
        console.log(users);
    }

    return (
        <div className="sideBar">
            <div className="sideBar_header">
                <div className="avatar">
                    <IconButton>
                        {profile ? <Avatar src={profile} /> :
                            <Avatar sx={{ bgcolor: deepPurple[500] }} src={profile} />
                        }
                    </IconButton>
                </div>
                <div className="icons">
                    <IconButton>
                        <DataSaverOffIcon />
                    </IconButton>
                    <IconButton>
                        <CommentIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sideBar_search">
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <input type="text" placeholder="Search or start new chat" value={search} onChange={(e) => handleChange(e)} />
            </div>
            <div className="sideBar_chats">
                <h2>Add New Chat</h2>
                {/* This will be a seperate component name sideBar preview */}
                <div style={{ marginTop: "1rem" }}>
                    {serverUsers?.map((obj) => {
                        return <div key={obj.id} onClick={() => getMessage(obj.id, obj.username, obj.tagLine, obj.profileImage)} >
                            <SideBarPreview username={obj.username} message={obj.tagLine} letter={obj.username[0]} id={obj.id} profileImage={obj?.profileImage} />

                        </div>
                    })}
                </div>
            </div>
        </div>
    )

}

export default SideBar;        