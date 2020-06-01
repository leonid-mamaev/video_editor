import React, {ReactNode} from 'react'
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal'


type Props = {
    title: string
    body: () => ReactNode
    footer: () => ReactNode
    onClose?: () => void
}

export const MyModal = ({title, body, footer, onClose}: Props) => {
    return (
        <Modal open={true} onClose={onClose}>
            <Modal.Header>
                {title}
            </Modal.Header>
            <Modal.Content>
                {body()}
            </Modal.Content>
            <Modal.Actions>
                {footer()}
            </Modal.Actions>
        </Modal>
    )
}

export default MyModal
