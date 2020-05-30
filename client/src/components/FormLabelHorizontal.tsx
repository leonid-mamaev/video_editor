import React, {ReactNode} from 'react'
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid/Grid'


type Props = {
    label: string
    children: ReactNode
}

export const FormLabelHorizontal = ({label, children}: Props) => {
    return (
        <Grid columns='two'>
            <Grid.Row>
                <Grid.Column width={2}>
                    <label>{label}</label>
                </Grid.Column>
                <Grid.Column width={12}>
                    {children}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
export default FormLabelHorizontal
