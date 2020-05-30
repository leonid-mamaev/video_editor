import React from 'react'
import VideoEditor from './VideoEditor'
import AudioEditor from './AudioEditor'
import { Header } from 'semantic-ui-react'
import FormTextfield from "./components/FormTextfield";
import {ButtonSubmit} from "./components/ButtonSubmit";
import {ButtonCancel} from "./components/ButtonCancel";
import axios from "axios";

type Props = {
    mediaName: string
    onRename: () => void
}

class PlayMediaFile extends React.Component<Props> {

    render() {
      const { mediaName } = this.props
      const is_video = mediaName.indexOf('mp3') == -1
      return (
        <div>
            <RenameMediaFile onSuccess={this.props.onRename} mediaName={mediaName} />
            {is_video && <VideoEditor mediaName={mediaName} />}
            {!is_video && <AudioEditor mediaName={mediaName} />}
        </div>
      )
    }
}


type RenameMediaFileProps = {
    mediaName: string
    onSuccess: () => void
}

type RenameMediaFileState = {
    toggle: boolean
    newName: string
}


class RenameMediaFile extends React.Component<RenameMediaFileProps, RenameMediaFileState> {
    state: RenameMediaFileState = {
        toggle: false,
        newName: this.props.mediaName
    }

    toggle() {
        this.setState({toggle: !this.state.toggle})
    }

    onChange(value: string) {
        this.setState({newName: value})
    }

    renameMediaFile() {
        const data = {
            'name': this.props.mediaName,
            'new_name': this.state.newName
        }
        axios.post('http://127.0.0.1:8000/api/rename', data, {})
            .then(res => {
                this.props.onSuccess()
            })
    }

    render() {
      const { mediaName } = this.props
      const { toggle, newName } = this.state
      return (
        <div>
            {!toggle && <Header as='h2' onClick={this.toggle.bind(this)}>{mediaName}</Header>}
            {toggle &&
                <div>
                    <FormTextfield value={newName} onChange={this.onChange.bind(this)}/>
                    <ButtonSubmit onClick={this.renameMediaFile.bind(this)} />
                    <ButtonCancel onClick={this.toggle.bind(this)} />
                </div>
            }
        </div>
      )
    }
}

export default PlayMediaFile
