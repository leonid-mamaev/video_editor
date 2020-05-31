import React, {createRef} from 'react'
import axios from 'axios'
import {MyButton} from "./components/MyButton";

type Props = {
    onUpload: () => void
}

type State = {
    isLoading: boolean
}

class UploadMediaFile extends React.Component<Props, State> {
    uploadRef: any
    state: State = {
        isLoading: false
    }

    constructor(props: Props) {
        super(props)
        this.uploadRef = createRef()
    }

    onChangeHandler(event: any) {
        const data = new FormData()
        data.append('file', event.target.files[0])
        this.setState({isLoading: true})
        axios.post("http://127.0.0.1:8000/api/upload_file", data, {})
        .then(res => {
            this.setState({isLoading: false})
            this.props.onUpload()
        })
    }

    render() {
        const {isLoading} = this.state
        if (isLoading) return 'Uploading...'
        return (
            <div className='uploadFile'>
                <input ref={this.uploadRef} hidden type="file" name="file" onChange={this.onChangeHandler.bind(this)}/>
                <MyButton icon='upload' onClick={() => {this.uploadRef.current.click()}} text='Upload Media File' />
          </div>
        )
    }
}

export default UploadMediaFile
