import React from "react";
import axios from 'axios'
import {Menu} from 'semantic-ui-react'
import ListMediaFiles from './ListMediaFiles'
import PlayMediaFile from './PlayMediaFile'
import EditorJoinVideos from './EditorJoinVideos'
import EditorApplyAudioToVideo from './EditorApplyAudioToVideo'
import {MyButton} from "./components/MyButton";

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
                    <Menu.Item>
                        <EditorJoinVideos mediaItems={mediaItems} onSuccess={this.refresh.bind(this)} />
                    </Menu.Item>
                    <Menu.Item>
                        <EditorApplyAudioToVideo mediaItems={mediaItems} onSuccess={this.refresh.bind(this)} />
                    </Menu.Item>
                </Menu>
                <div className='mainPanel'>
                    <div className={selectorCollapsed ? 'mediaList collapsed' : 'mediaList'}>
                        <div className='mediaListToggle'>
                            <MyButton
                                size='mini'
                                icon={selectorCollapsed ? 'caret right' : 'caret left'}
                                onClick={this.toggleSelector.bind(this)} />
                        </div>
                        {!selectorCollapsed &&
                            <ListMediaFiles
                                items={mediaItems}
                                onSelect={this.selectMedia.bind(this)}
                                onDelete={this.refresh.bind(this)} />
                        }
                    </div>
                    <div className='MediaFileView'>
                        {selectedMedia && <PlayMediaFile onRename={this.refresh.bind(this)} key={selectedMedia} mediaName={selectedMedia} /> }
                    </div>
                </div>
            </div>
        )
    }
}


export default MainPanel
