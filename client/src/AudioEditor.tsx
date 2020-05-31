import React, {createRef, RefObject} from 'react'
import FormTextfield from './components/FormTextfield'
import {ButtonSubmit} from './components/ButtonSubmit'
import axios from 'axios'
import {MyButton} from './components/MyButton'
import WaveFormChart from './components/WaveFormChart'
import {TimeLine} from "./components/TimeLine";


type Props = {
    mediaName: string
}

type State = {
    cutFrom: string
    cutTo: string
    waveFormData: []
    playProgress: number
}

class AudioEditor extends React.Component<Props, State> {
    audioRef: RefObject<any>
    state: State = {
        cutFrom: '',
        cutTo: '',
        waveFormData: [],
        playProgress: 0,
    }

    constructor(props: Props) {
        super(props)
        this.audioRef = createRef()
    }

    componentDidMount() {
        this.getAudioWaveForm()
    }

    componentWillUnmount() {
        this.audioRef.current.pause()
    }

    getAudioWaveForm() {
        const data = {name: this.props.mediaName}
        axios.get('http://127.0.0.1:8000/api/get_audio_wave_form', {params: data})
        .then(res => {
            this.setState({waveFormData: res.data})
        })
    }

    cut() {
        const data = {
            'source_file_name': this.props.mediaName,
            'destination_file_name':  'Cut ' + this.props.mediaName,
            'start': this.state.cutFrom,
            'end': this.state.cutTo
        }
        axios.post('http://127.0.0.1:8000/api/cut_audio', data)
        .then(res => {
            console.log(res.statusText)
        })
    }

    play() {
        this.audioRef.current.play()
    }

    pause() {
        this.audioRef.current.pause()
    }

    stop() {
        this.audioRef.current.currentTime = 0
    }

    onPlayUpdate() {
        this.setState({playProgress: this.audioRef.current.currentTime})
    }

    setPosition(position: number) {
        this.audioRef.current.currentTime = position
    }

    render() {
        const {cutFrom, cutTo, waveFormData, playProgress} = this.state
        const {mediaName} = this.props
        return (
            <div>
                <WaveFormChart
                    onClick={this.setPosition.bind(this)}
                    highlightPosition={playProgress}
                    data={waveFormData} />
                <audio onTimeUpdate={this.onPlayUpdate.bind(this)} ref={this.audioRef} autoPlay={false} controls={false}>
                    <source src={`http://127.0.0.1:8000/store/` + mediaName} type="audio/mp3" />
                </audio>
                <TimeLine
                    time={playProgress}
                    totalTime={this.audioRef.current ? this.audioRef.current.duration : 0} />
                <MyButton text='Play' icon='play' onClick={this.play.bind(this)} />
                <MyButton text='Pause' icon='pause' onClick={this.pause.bind(this)} />
                <MyButton text='Stop' icon='stop' onClick={this.stop.bind(this)} />
                <h3>Slice</h3>
                <FormTextfield
                    placeholder='From'
                    isFluid={false}
                    value={cutFrom}
                    onChange={value => this.setState({cutFrom: value})} />
                <FormTextfield
                    placeholder='To'
                    isFluid={false}
                    value={cutTo}
                    onChange={value => this.setState({cutTo: value})} />
                <ButtonSubmit onClick={this.cut.bind(this)} />
            </div>
        )
    }
}

export default AudioEditor
