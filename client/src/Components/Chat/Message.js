import React from 'react'

export default function Message({ state, message, timeStamp }) {
    return (
        <div className={`chat_message ${state}`}>
            <p>{message}</p>
            <span className="time_stamp">{timeStamp}</span>
        </div>
    )
}
