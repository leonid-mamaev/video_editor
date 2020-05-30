import React from 'react'
import FormTextfield from './components/FormTextfield'
import {ButtonSubmit} from './components/ButtonSubmit'
import axios from 'axios'

type Props = {
    onSuccess: () => void
}

type State = {
    video1: string
    video2: string
    isLoading: boolean
}

class EditorJoinVideos extends React.Component<Props, State> {
    state: State = {
        video1: '',
        video2: '',
        isLoading: false
    }

    submit() {
        this.setState({isLoading: true})
        const data = {
            'video_1': this.state.video1,
            'video_2': this.state.video2,
            'destination':  `Joined videos by react.mp4`
        }
        axios.post('http://127.0.0.1:8000/api/join_videos', data, {})
        .then(res => {
            this.setState({isLoading: false})
            this.props.onSuccess()
        })
    }

    render() {
        const {video1, video2, isLoading} = this.state
        if (isLoading) return 'Loading...'
        return (
            <div>
                <h3>Join Videos</h3>
                <FormTextfield placeholder='Video 1' value={video1} onChange={value => this.setState({video1: value})} />
                <FormTextfield placeholder='Video 2' value={video2} onChange={value => this.setState({video2: value})} />
                <ButtonSubmit onClick={this.submit.bind(this)} />
            </div>
        )
    }
}

export default EditorJoinVideos
