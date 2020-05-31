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
      const is_video = mediaName.indexOf('mp3') === -1
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
    name: string
    newName: string
    isLoading: boolean
}

class RenameMediaFile extends React.Component<RenameMediaFileProps, RenameMediaFileState> {
    state: RenameMediaFileState = {
        toggle: false,
        name: this.props.mediaName,
        newName: this.props.mediaName,
        isLoading: false
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
        this.setState({isLoading: true})
        axios.post('http://127.0.0.1:8000/api/rename', data, {})
        .then(res => {
            this.props.onSuccess()
            this.setState({toggle: false, name: this.state.newName, isLoading: false})
        })
    }

    render() {
      const { toggle, name, newName, isLoading } = this.state
      return (
        <div>
            {!toggle &&
                <Header
                    className='mediaNameHeader'
                    title='Click to rename'
                    as='h1'
                    onClick={this.toggle.bind(this)}>
                    {name}
                </Header>
            }
            {toggle &&
                <div>
                    <FormTextfield loading={isLoading} isFluid={false} value={newName} onChange={this.onChange.bind(this)}/>
                    <ButtonSubmit onClick={this.renameMediaFile.bind(this)} />
                    <ButtonCancel onClick={this.toggle.bind(this)} />
                </div>
            }
        </div>
      )
    }
}

export default PlayMediaFile
