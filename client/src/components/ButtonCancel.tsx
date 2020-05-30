import React from 'react'
import {MyButton} from "./MyButton"

type Props = {
    onClick: () => void
    text?: string
}

export const ButtonCancel = ({onClick, text = 'Cancel'}: Props) => {
    return (
        <MyButton
            text={text}
            icon='check'
            onClick={onClick}/>
    )
}
