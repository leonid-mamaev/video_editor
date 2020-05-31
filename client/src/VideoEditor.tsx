import React, {createRef} from 'react'
import FormTextfield from "./components/FormTextfield";
import {ButtonSubmit} from "./components/ButtonSubmit";
import axios from "axios";
import WaveFormChart from "./components/WaveFormChart";
import {MyButton} from "./components/MyButton";
import {Grid} from "semantic-ui-react";
import {TimeLine} from "./components/TimeLine";

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
            <Grid divided columns={2}>
                <Grid.Row>
                    <Grid.Column width={14}>
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
                        <video
                            onTimeUpdate={this.onPlayUpdate.bind(this)}
                            ref={this.videoRef}
                            key={mediaName}
                            autoPlay={false}
                            width='100%'
                            onClick={this.onVideoClick.bind(this)}
                            controls={false}>
                            <source src={`http://127.0.0.1:8000/store/` + mediaName} type='video/mp4' />
                        </video>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <EditorCropVideo mediaName={mediaName} />
                        <EditorSliceVideo mediaName={mediaName} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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
        const {cropX1, cropX2, isLoading} = this.state
        if (isLoading) return 'Cropping...'
        return (
            <div>
                <MyButton onClick={this.toggle.bind(this)}>Crop</MyButton>
                {this.state.toggle &&
                    <div>
                        <FormTextfield placeholder='X1' value={cropX1} onChange={value => this.setState({cropX1: value})}/>
                        <FormTextfield placeholder='X2' value={cropX2} onChange={value => this.setState({cropX2: value})}/>
                        <ButtonSubmit onClick={this.crop.bind(this)}/>
                    </div>
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
        const {cutFrom, cutTo, isLoading} = this.state
        if (isLoading) return 'Slicing...'
        return (
            <div>
                <MyButton onClick={this.toggle.bind(this)}>Slice</MyButton>
                {this.state.toggle &&
                    <div>
                        <FormTextfield placeholder='From' value={cutFrom} onChange={value => this.setState({cutFrom: value})}/>
                        <FormTextfield placeholder='To' value={cutTo} onChange={value => this.setState({cutTo: value})}/>
                        <ButtonSubmit onClick={this.slice.bind(this)}/>
                    </div>
                }
            </div>
        )
    }
}

export default VideoEditor
