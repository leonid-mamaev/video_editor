import React, {createRef} from 'react'
import FormTextfield from "./components/FormTextfield";
import {ButtonSubmit} from "./components/ButtonSubmit";
import axios from "axios";
import WaveFormChart from "./components/WaveFormChart";
import {MyButton} from "./components/MyButton";
import {TimeLine} from "./components/TimeLine";
import {ButtonCancel} from "./components/ButtonCancel";
import FormLabelHorizontal from "./components/FormLabelHorizontal";
import EditorVideoResize from "./EditorVideoResize";
import MyModal from "./components/MyModal";

type Props = {
    mediaName: string
}

type State = {
    waveFormData: []
    playProgress: number
    isLoading: boolean
}

class VideoEditor extends React.Component<Props, State> {
    videoRef: any
    state: State = {
        waveFormData: [],
        playProgress: 0,
        isLoading: false
    }

    constructor(props: Props) {
        super(props)
        this.videoRef = createRef()
    }

    componentDidMount() {
        this.getAudioWaveForm()
    }

    getAudioWaveForm() {
        const data = {name: this.props.mediaName}
        axios.get('http://127.0.0.1:8000/api/get_video_wave_form', {params: data})
        .then(res => {
            this.setState({waveFormData: res.data})
        })
    }

    play() {
        this.videoRef.current.play()
    }

    pause() {
        this.videoRef.current.pause()
    }

    stop() {
        this.videoRef.current.currentTime = 0
    }

    onPlayUpdate() {
        this.setState({playProgress: this.videoRef.current.currentTime})
    }

    setPosition(position: number) {
        this.videoRef.current.currentTime = position
    }

    onVideoClick() {
        this.videoRef.current.paused ? this.videoRef.current.play() : this.videoRef.current.pause()
    }

    render() {
        const { mediaName } = this.props
        const {waveFormData, playProgress} = this.state
        return (
            <div>
                <WaveFormChart
                    onClick={this.setPosition.bind(this)}
                    highlightPosition={playProgress}
                    data={waveFormData} />
                {this.videoRef.current &&
                <div>
                    Video Size: {this.videoRef.current.videoWidth}X{this.videoRef.current.videoHeight}
                    <TimeLine
                        time={playProgress}
                        totalTime={this.videoRef.current ? this.videoRef.current.duration : 0} />
                </div>
                }
                <div className='controls'>
                    <MyButton text='Play' icon='play' onClick={this.play.bind(this)} />
                    <MyButton text='Pause' icon='pause' onClick={this.pause.bind(this)} />
                    <MyButton text='Stop' icon='stop' onClick={this.stop.bind(this)} />
                </div>
                <div className='video-editor-controls'>
                    <EditorCropVideo mediaName={mediaName} />
                    <EditorSliceVideo mediaName={mediaName} />
                    <EditorVideoResize mediaName={mediaName} onSuccess={() => {}} />
                </div>
                <video
                    onTimeUpdate={this.onPlayUpdate.bind(this)}
                    ref={this.videoRef}
                    key={mediaName}
                    autoPlay={false}
                    onClick={this.onVideoClick.bind(this)}
                    controls={false}>
                    <source src={`http://127.0.0.1:8000/store/` + mediaName} type='video/mp4' />
                </video>
            </div>
        )
    }
}


type CropProps = {
    mediaName: string
}

type CropState = {
    cropX1: string
    cropX2: string
    isLoading: boolean
    toggle: boolean
}

class EditorCropVideo extends React.Component<CropProps, CropState> {
    state: CropState = {
        cropX1: '',
        cropX2: '',
        toggle: false,
        isLoading: false
    }

    toggle() {
        this.setState({toggle: !this.state.toggle})
    }

    crop() {
        this.setState({isLoading: true})
        const data = {
            'source_file_name': this.props.mediaName,
            'destination_file_name':  'Cropped ' + this.props.mediaName,
            'x1': this.state.cropX1,
            'x2': this.state.cropX2
        }
        axios.post('http://127.0.0.1:8000/api/crop_video', data)
        .then(res => {
            this.setState({isLoading: false})
        })
    }

    render() {
        const {mediaName} = this.props
        const {cropX1, cropX2, isLoading} = this.state
        return (
            <div>
                <MyButton icon='crop' text='Crop' onClick={this.toggle.bind(this)} />
                {this.state.toggle &&
                    <MyModal
                        body={() => (
                            <div>
                                {isLoading && 'Cropping...'}
                                <FormLabelHorizontal label='X1'>
                                    <FormTextfield value={cropX1} onChange={value => this.setState({cropX1: value})}/>
                                </FormLabelHorizontal>
                                <FormLabelHorizontal label='X2'>
                                    <FormTextfield value={cropX2} onChange={value => this.setState({cropX2: value})}/>
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
                        title={`Crop ${mediaName}`} />
                }
            </div>
        )
    }
}

type SliceProps = {
    mediaName: string
}

type SliceState = {
    cutFrom: string
    cutTo: string
    isLoading: boolean
    toggle: boolean
}

class EditorSliceVideo extends React.Component<SliceProps, SliceState> {
    state: SliceState = {
        cutFrom: '',
        cutTo: '',
        toggle: false,
        isLoading: false
    }

    toggle() {
        this.setState({toggle: !this.state.toggle})
    }

    slice() {
        this.setState({isLoading: true})
        const data = {
            'source_file_name': this.props.mediaName,
            'destination_file_name':  'Sliced ' + this.props.mediaName,
            'start': this.state.cutFrom,
            'end': this.state.cutTo
        }
        axios.post('http://127.0.0.1:8000/api/slice_video', data)
        .then(res => {
            this.setState({isLoading: false})
        })
        .catch((error) => {
            this.setState({isLoading: false})
        })
    }

    render() {
        const {mediaName} = this.props
        const {cutFrom, cutTo, isLoading} = this.state
        return (
            <div>
                <MyButton icon='hand scissors' text='Slice' onClick={this.toggle.bind(this)} />
                {this.state.toggle &&
                    <MyModal
                        body={() => (
                            <div>
                                {isLoading && 'Slicing...'}
                                <FormTextfield placeholder='From' value={cutFrom} onChange={value => this.setState({cutFrom: value})}/>
                                <FormTextfield placeholder='To' value={cutTo} onChange={value => this.setState({cutTo: value})}/>
                            </div>
                        )}
                        footer={() => (
                            <div>
                                <ButtonSubmit onClick={this.slice.bind(this)}/>
                                <ButtonCancel onClick={this.toggle.bind(this)}/>
                            </div>
                        )}
                        onClose={this.toggle.bind(this)}
                        title={`Slice ${mediaName}`} />
                }
            </div>
        )
    }
}

export default VideoEditor
