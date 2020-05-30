import React, {createRef, RefObject} from 'react'
import FormTextfield from './components/FormTextfield'
import {ButtonSubmit} from './components/ButtonSubmit'
import axios from 'axios'
import {MyButton} from './components/MyButton'
import WaveFormChart from './components/WaveFormChart'


type Props = {
    mediaName: string
}

type State = {
    cutFrom: string
    cutTo: string
    waveFormData: []
    playProgress: number
    audioRef: RefObject<any>
}

class AudioEditor extends React.Component<Props, State> {
    state: State = {
        cutFrom: '',
        cutTo: '',
        waveFormData: [],
        playProgress: 0,
        audioRef: createRef()
    }

    componentDidMount() {
        this.getAudioWaveForm()
    }

    componentWillUnmount() {
        this.state.audioRef.current.pause()
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
        this.state.audioRef.current.play()
    }

    pause() {
        this.state.audioRef.current.pause()
    }

    stop() {
        this.state.audioRef.current.currentTime = 0
    }

    onPlayUpdate() {
        this.setState({playProgress: this.state.audioRef.current.currentTime})
    }

    setPosition(position: number) {
        this.state.audioRef.current.currentTime = position
    }

    render() {
        const {cutFrom, cutTo, waveFormData, playProgress} = this.state
        const {mediaName} = this.props
        return (
            <div>
                <WaveFormChart
                    onClick={this.setPosition.bind(this)}
                    highlightPosition={playProgress}
                    totalTime={this.state.audioRef.current ? this.state.audioRef.current.duration : 0}
                    data={waveFormData} />
                <audio onTimeUpdate={this.onPlayUpdate.bind(this)} ref={this.state.audioRef} autoPlay={false} controls={false}>
                    <source src={`http://127.0.0.1:8000/store/` + mediaName} type="audio/mp3" />
                </audio>
                <MyButton text='Play' onClick={this.play.bind(this)} />
                <MyButton text='Pause' onClick={this.pause.bind(this)} />
                <MyButton text='Stop' onClick={this.stop.bind(this)} />
                <FormTextfield placeholder='From' value={cutFrom} onChange={value => this.setState({cutFrom: value})} />
                <FormTextfield placeholder='To' value={cutTo} onChange={value => this.setState({cutTo: value})} />
                <ButtonSubmit onClick={this.cut.bind(this)} />
            </div>
        )
    }
}

export default AudioEditor
