import React from 'react'
import {Icon, List} from 'semantic-ui-react'
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
            <List.Item as='a' key={`item-${index}`}>
                <DeleteMediaFile onSuccess={onDelete} name={item} />
                <List.Header>
                    <Icon size='large' name='file' />
                    <span onClick={() => this.props.onSelect(item)}>{item}</span>
                </List.Header>
            </List.Item>
        )
        return (
            <div>
                <UploadMediaFile onUpload={this.props.onDelete} />
                <List className='list-media-files'>
                    {ListItems}
                </List>
            </div>
        )
    }
}

export default ListMediaFiles
