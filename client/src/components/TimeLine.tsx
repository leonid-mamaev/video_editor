import React from "react";


type TimeProps = {
    time: number
    totalTime: number
}
export const TimeLine = ({time, totalTime}: TimeProps) => {
    return (
        <div>Time: {time} / {totalTime}</div>
    )
}
