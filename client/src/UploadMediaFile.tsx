import React from 'react'
import axios from 'axios'


class UploadMediaFile extends React.Component {

  onChangeHandler(event: any) {
    const data = new FormData()
    data.append('file', event.target.files[0])
    axios.post("http://127.0.0.1:8000/api/upload_file", data, {})
      .then(res => {
        console.log(res.statusText)
      })
  }

    render() {
      return (
         <input type="file" name="file" onChange={this.onChangeHandler}/>
      )
    }
}

export default UploadMediaFile
