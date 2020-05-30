import React from 'react'
import {Bar, BarChart, Tooltip, XAxis, YAxis} from 'recharts'

type Props = {
    data: any
    highlightPosition?: any
    totalTime: number
    onClick: (position: number) => void
}

type State = {
}

class WaveFormChart extends React.Component<Props, State> {
    state: State = {
    }

    onClick(event: any) {
        this.props.onClick(event.time)
    }

    calculateHighlightPosition() {
        const {data, highlightPosition} = this.props
        if (data.length === 0) return 0
        return highlightPosition / data[data.length - 1].time * 989
    }

    render() {
        const {data, highlightPosition, totalTime} = this.props
        return (
            <div className='wave-form-chart-container'>
                <div className='wave-form-chart'>
                    <div key={`position-${highlightPosition}`} className='slider' style={{'width': this.calculateHighlightPosition()}} />
                    <BarChart barCategoryGap={0} width={1000} height={300} data={data}>
                        <Tooltip content={() => {return null}} cursor={{ stroke: '#bbbdbf', strokeWidth: 1 }} />
                        <XAxis tick={false} dataKey="time" />
                        <YAxis hide tick={false} />
                        <Bar onClick={this.onClick.bind(this)} dataKey='signal' fill="#bbbdbf" />
                    </BarChart>
                </div>
                <ShowTime time={highlightPosition} totalTime={totalTime} />
            </div>
        )
    }
}


type TimeProps = {
    time: number
    totalTime: number
}
export const ShowTime = ({time, totalTime}: TimeProps) => {
    return (
        <div>Time: {time} / {totalTime}</div>
    )
}

export default WaveFormChart
