import React from "react"
import Avatar from '@mui/material/Avatar'
import { deepPurple } from '@mui/material/colors';
// import image from "./Harish.jpeg"

const SideBarPreview = ({ username, message, letter, profileImage, children }) => {
    return (
        <div className="sideBar_preview">
            <div className="avatar">
                <Avatar sx={{ bgcolor: deepPurple[500] }} children={letter} src={profileImage} />
            </div>
            <div className="sideBar_chat">
                <h5>{username}</h5>
                <p>{message}</p>
            </div>
        </div>

    )
}


export default SideBarPreview;
