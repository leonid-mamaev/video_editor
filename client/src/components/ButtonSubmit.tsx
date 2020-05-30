import React from 'react'
import {MyButton} from "./MyButton"

type Props = {
    onClick: () => void
    text?: string
    color?: 'green' | 'red'
}

export const ButtonSubmit = ({onClick, text = 'Submit', color = 'green'}: Props) => {
    return (
        <MyButton
            text={text}
            color={color}
            icon='check'
            onClick={onClick}/>
    )
}
