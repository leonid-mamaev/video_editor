import React from 'react'
import FormTextfield from "./components/FormTextfield";
import {ButtonSubmit} from "./components/ButtonSubmit";
import axios from "axios";
import {MyButton} from "./components/MyButton";
import {List} from "semantic-ui-react";
import {ButtonCancel} from "./components/ButtonCancel";
import MyModal from "./components/MyModal";

type Props = {
    onSuccess: () => void
    mediaItems: []
}

type State = {
    video: string
    audio: string
    isLoading: boolean
    toggle: boolean
}

class EditorApplyAudioToVideo extends React.Component<Props, State> {
    state: State = {
        video: '',
        audio: '',
        isLoading: false,
        toggle: false
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

    close() {
        this.setState({toggle: false})
    }

    open() {
        this.setState({toggle: true})
    }

    render() {
        const {mediaItems} = this.props
        const {video, audio, isLoading, toggle} = this.state
        return (
            <div>
                <MyButton text='Apply Audio To Video' onClick={this.open.bind(this)} />
                {toggle &&
                <MyModal
                    body={() => (
                        <div>
                            {isLoading && 'Loading...'}
                            <List>
                                {mediaItems.map((item: string) => {
                                    return <List.Item>{item}</List.Item>
                                })}
                            </List>

                            <FormTextfield placeholder='Video' value={video} onChange={value => this.setState({video: value})}/>
                            <FormTextfield placeholder='Audio' value={audio} onChange={value => this.setState({audio: value})}/>
                        </div>
                    )}
                    footer={() => (
                        <div>
                            <ButtonSubmit text='Submit' onClick={this.submit.bind(this)} />
                            <ButtonCancel text='Cancel' onClick={this.close.bind(this)} />
                        </div>
                    )}
                    onClose={this.close.bind(this)}
                    title='Apply Audio To Video' />
                }
        </div>
      )
    }
}

export default EditorApplyAudioToVideo
