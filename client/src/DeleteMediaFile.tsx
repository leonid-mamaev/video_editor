import React from 'react'
import axios from 'axios'
import {ButtonDelete} from './components/ButtonDelete'

type Props = {
  name: string
  onSuccess: () => void
}

class DeleteMediaFile extends React.Component<Props> {

    submit() {
        const data = {
            'names': [this.props.name]
        }
        axios.post('http://127.0.0.1:8000/api/remove', data)
        .then(res => {
            this.props.onSuccess()
        })
    }

    render() {
        return (
            <ButtonDelete onClick={this.submit.bind(this)} />
        )
    }
}

export default DeleteMediaFile
