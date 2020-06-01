import React from "react";
import axios from "axios";
import {MyButton} from "./components/MyButton";
import FormLabelHorizontal from "./components/FormLabelHorizontal";
import FormTextfield from "./components/FormTextfield";
import {ButtonSubmit} from "./components/ButtonSubmit";
import {ButtonCancel} from "./components/ButtonCancel";
import MyModal from "./components/MyModal";

type State = {
    width: string
    height: string
    destination: string
    toggle: boolean
    isLoading: boolean
    error: string
}

type Props = {
    mediaName: string
    onSuccess: () => void
}

class EditorVideoResize extends React.Component<Props, State> {
    state: State = {
        width: '',
        height: '',
        destination: 'Resized ' + this.props.mediaName,
        toggle: false,
        isLoading: false,
        error: ''
    }

    toggle() {
        this.setState({toggle: !this.state.toggle})
    }

    crop() {
        this.setState({isLoading: true, error: ''})
        const data = {
            'source': this.props.mediaName,
            'destination':  this.state.destination,
            'width': this.state.width,
            'height': this.state.height
        }
        axios.post('http://127.0.0.1:8000/api/resize_video', data)
        .then(res => {
            this.setState({isLoading: false})
        })
        .catch((error) => {
            this.setState({isLoading: false, error: error})
        })
    }

    render() {
        const {mediaName} = this.props
        const {width, height, isLoading, error, destination} = this.state
        return (
            <div>
                <MyButton icon='arrows alternate' text='Resize' onClick={this.toggle.bind(this)} />
                {this.state.toggle &&
                <MyModal
                    body={() => (
                        <div>
                            {isLoading && 'Resizing...'}
                            {error && 'Error:' + error}
                            <FormLabelHorizontal label='Width'>
                                <FormTextfield value={width} onChange={value => this.setState({width: value})}/>
                            </FormLabelHorizontal>
                            <FormLabelHorizontal label='Height'>
                                <FormTextfield value={height} onChange={value => this.setState({height: value})}/>
                            </FormLabelHorizontal>
                            <FormLabelHorizontal label='Destination'>
                                <FormTextfield value={destination} onChange={value => this.setState({destination: value})}/>
                            </FormLabelHorizontal>
                        </div>
                    )}
                    footer={() => (
                        <div>
                            <ButtonSubmit onClick={this.crop.bind(this)}/>
                            <ButtonCancel onClick={this.toggle.bind(this)}/>
                        </div>
                    )}
                    onClose={this.toggle.bind(this)}
                    title={`Resize ${mediaName}`} />
                }
            </div>
        )
    }
}

export default EditorVideoResize
