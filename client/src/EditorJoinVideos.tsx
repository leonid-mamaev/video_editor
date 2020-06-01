import React from 'react'
import FormTextfield from './components/FormTextfield'
import {ButtonSubmit} from './components/ButtonSubmit'
import axios from 'axios'
import {MyButton} from './components/MyButton'
import {List} from 'semantic-ui-react'
import {ButtonCancel} from "./components/ButtonCancel";
import MyModal from "./components/MyModal";

type Props = {
    onSuccess: () => void
    mediaItems: []
}

type State = {
    video1: string
    video2: string
    isLoading: boolean
    toggle: boolean
}

class EditorJoinVideos extends React.Component<Props, State> {
    state: State = {
        video1: '',
        video2: '',
        isLoading: false,
        toggle: false
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

    close() {
        this.setState({toggle: false})
    }

    open() {
        this.setState({toggle: true})
    }

    render() {
        const {mediaItems} = this.props
        const {video1, video2, isLoading, toggle} = this.state
        return (
            <div>
                <MyButton text='Join Videos' onClick={this.open.bind(this)} />
                {toggle &&
                <MyModal
                    body={() => {
                        return (
                            <div>
                                {isLoading && 'Loading...'}
                                <List>
                                    {mediaItems.map((item: string) => {
                                        if (item.indexOf('mp4') === -1) return ''
                                        return <List.Item>{item}</List.Item>
                                    })}
                                </List>
                                <FormTextfield placeholder='Video 1' value={video1} onChange={value => this.setState({video1: value})} />
                                <FormTextfield placeholder='Video 2' value={video2} onChange={value => this.setState({video2: value})} />
                            </div>
                        )
                    }}
                    footer={() => (
                        <div>
                            <ButtonSubmit text='Submit' onClick={this.submit.bind(this)} />
                            <ButtonCancel text='Cancel' onClick={this.close.bind(this)} />
                        </div>
                    )}
                    onClose={this.close.bind(this)}
                    title='Join Videos'/>
                }
            </div>
        )
    }
}

export default EditorJoinVideos
