import React, {RefObject, createRef} from 'react'
import Input, {InputOnChangeData} from 'semantic-ui-react/dist/commonjs/elements/Input/Input'

type Props = {
    onChange: (value: string) => void
    value?: string
    placeholder?: string
    isFluid?: boolean
    size?: 'mini' | 'small'
    icon?: 'filter'
    autofocus?: boolean
}

type State = {
    ref: RefObject<any>
}

export default class FormTextfield extends React.Component<Props, State> {
    state: State = {
        ref: createRef()
    }

    static defaultProps = {
        isFluid: true,
        size: 'small'
    }

    componentDidMount(): void {
        if (!this.props.autofocus) return
        this.state.ref.current.focus()
    }

    render() {
        return (
            <Input
                ref={this.state.ref}
                value={this.props.value}
                fluid={this.props.isFluid}
                placeholder={this.props.placeholder}
                onChange={(event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => this.props.onChange(data.value)}
                size={this.props.size}
                icon={this.props.icon}/>
        )
    }
}
