import React, {ReactNode} from "react"
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button'

type Props = {
    onClick?: () => void
    text?: string
    title?: string
    color?: 'green' | 'red' | 'grey'
    icon?: 'check' | 'trash' | 'close'
    size?: 'mini' | 'tiny' | 'small'
    children?: ReactNode
}

export const MyButton = ({onClick, text, title, icon, color, size = 'tiny', children}: Props) => {
    return (
        <Button title={title} color={color} content={text} icon={icon} size={size} onClick={onClick}>
            {children}
        </Button>
    )
}
