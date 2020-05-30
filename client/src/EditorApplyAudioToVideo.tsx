import React from 'react'
import FormTextfield from "./components/FormTextfield";
import {ButtonSubmit} from "./components/ButtonSubmit";
import axios from "axios";

type Props = {
    onSuccess: () => void
}

type State = {
    video: string
    audio: string
    isLoading: boolean
}

class EditorApplyAudioToVideo extends React.Component<Props, State> {
    state: State = {
        video: '',
        audio: '',
        isLoading: false
    }

    submit() {
        this.setState({isLoading: true})
        const data = {
            'video': this.state.video,
            'audio': this.state.audio,
            'destination':  `Audio applied to video by react.mp4`
        }
        axios.post('http://127.0.0.1:8000/api/apply_audio', data, {})
        .then(res => {
            this.setState({isLoading: false})
            this.props.onSuccess()
        })
    }

    render() {
      const {video, audio, isLoading} = this.state
        if (isLoading) return 'Loading...'
      return (
        <div>
            <h3>Apply Audio To Video</h3>
            <FormTextfield placeholder='Video' value={video} onChange={value => this.setState({video: value})} />
            <FormTextfield placeholder='Audio' value={audio} onChange={value => this.setState({audio: value})} />
            <ButtonSubmit onClick={this.submit.bind(this)} />
        </div>
      )
    }
}

export default EditorApplyAudioToVideo
