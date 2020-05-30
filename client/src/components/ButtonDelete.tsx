import React from 'react'
import {MyButton} from "./MyButton"

type Props = {
    onClick: () => void
}

export const ButtonDelete = ({onClick}: Props) => {
    return (
        <MyButton icon='close' color='red' size='mini' onClick={onClick}/>
    )
}
