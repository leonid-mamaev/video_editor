import React from "react";
import axios from 'axios'
import {Grid, Menu} from 'semantic-ui-react'
import ListMediaFiles from './ListMediaFiles'
import PlayMediaFile from './PlayMediaFile'
import EditorJoinVideos from './EditorJoinVideos'
import EditorApplyAudioToVideo from './EditorApplyAudioToVideo'

type State = {
    selectedMedia: string
    selectorCollapsed: boolean
    mediaItems: []
    isLoading: boolean
    error: string
}

class MainPanel extends React.Component<{}, State> {
    state: State = {
        selectedMedia: '',
        selectorCollapsed: false,
        mediaItems: [],
        isLoading: false,
        error: ''
    }

    selectMedia(media: string): void {
        this.setState({selectedMedia: media})
    }

    toggleSelector() {
        this.setState({selectorCollapsed: !this.state.selectorCollapsed})
    }

    componentDidMount() {
        this.refresh()
    }

    refresh() {
        axios.get('http://127.0.0.1:8000/api/list')
        .then(result => {
            this.setState({isLoading: true, mediaItems: result.data})
        })
        .catch((error) => {
            console.log(error)
        })
        .then(() => {
            if (this.state.mediaItems.length === 0)
                this.setState({isLoading: true, error: 'Something went wrong'})
        })
    }

    render() {
        const {selectedMedia, selectorCollapsed, mediaItems, isLoading, error} = this.state
        if (!isLoading) return <div>Loading...</div>
        if (error) return <div>Error: {error}</div>
        return (
            <div>
                <Menu className='toolBelt'>
                    <Menu.Item name='Tool Belt' />
                    <Menu.Item name='Join Videos' />
                    <Menu.Item name='Join Video and Sound' />
                </Menu>
                <Grid columns={2} divided className='mainPanel'>
                    <Grid.Row>
                        <Grid.Column width={selectorCollapsed ? 1 : 3}>
                            <div className='selector-toggle' onClick={this.toggleSelector.bind(this)}>{selectorCollapsed ? 'Open' : 'Close'}</div>
                            {!selectorCollapsed && <ListMediaFiles items={mediaItems} onSelect={this.selectMedia.bind(this)} onDelete={this.refresh.bind(this)} />}
                            {/*<EditorJoinVideos onSuccess={this.refresh.bind(this)} />*/}
                            {/*<EditorApplyAudioToVideo onSuccess={this.refresh.bind(this)} />*/}
                        </Grid.Column>
                        <Grid.Column width={selectorCollapsed ? 15 : 13}>
                            {selectedMedia && <PlayMediaFile onRename={this.refresh.bind(this)} key={selectedMedia} mediaName={selectedMedia} /> }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default MainPanel
