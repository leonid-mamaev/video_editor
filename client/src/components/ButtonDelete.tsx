import React from 'react'
import {MyButton} from "./MyButton"

type Props = {
    onClick: () => void
}

export const ButtonDelete = ({onClick}: Props) => {
    return (
        <MyButton icon='trash' size='mini' onClick={onClick}/>
    )
}
