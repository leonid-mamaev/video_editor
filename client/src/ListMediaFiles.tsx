import React from 'react'
import {Grid} from 'semantic-ui-react'
import UploadMediaFile from './UploadMediaFile'
import DeleteMediaFile from './DeleteMediaFile'

type Props = {
    onSelect: (media: string) => void
    items: []
    onDelete: () => void
}

class ListMediaFiles extends React.Component<Props> {

    render() {
        const { items, onDelete } = this.props
        const ListItems = items.map((item: string, index: number) =>
            <Grid.Row key={`media-list-item-${index}`}>
                <Grid.Column width={12} key={`name-${index}`}>
                    {item}
                </Grid.Column>
                <Grid.Column width={2} key={`show-${index}`}>
                    <div onClick={() => this.props.onSelect(item)}>Show</div>
                </Grid.Column>
                <Grid.Column width={2} key={`delete-${index}`}>
                    <DeleteMediaFile onSuccess={onDelete} name={item} />
                </Grid.Column>
            </Grid.Row>
        )
        return (
            <div>
                <UploadMediaFile />
                <Grid key='media-list' columns={3}>
                    {ListItems}
                </Grid>
            </div>
        )
    }
}

export default ListMediaFiles
