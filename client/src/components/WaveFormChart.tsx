import React, {createRef, RefObject} from 'react'
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'

type Props = {
    data: any
    highlightPosition?: any
    onClick: (position: number) => void
}

type State = {
    chartWidth: number,
    chartRef: RefObject<any>
}

class WaveFormChart extends React.Component<Props, State> {
    state: State = {
        chartWidth: 1200,
        chartRef: createRef()
    }

    onClick(event: any) {
        this.props.onClick(event.time)
    }

    calculateHighlightPosition() {
        const {data, highlightPosition} = this.props
        if (data.length === 0) return 0
        return highlightPosition / data[data.length - 1].time * (this.state.chartRef.current.state.containerWidth - 12)
    }

    render() {
        const {data, highlightPosition} = this.props
        const {chartRef} = this.state
        return (
            <div className='wave-form-chart-container'>
                <div className='wave-form-chart'>
                    <div key={`position-${highlightPosition}`} className='slider' style={{'width': this.calculateHighlightPosition()}} />
                    <ResponsiveContainer ref={chartRef} height={300} width='100%'>
                        <BarChart barCategoryGap={0} data={data}>
                            <Tooltip content={() => {return null}} cursor={{ stroke: '#bbbdbf', strokeWidth: 1 }} />
                            <XAxis tick={false} dataKey="time" />
                            <YAxis hide tick={false} />
                            <Bar onClick={this.onClick.bind(this)} dataKey='signal' fill="#bbbdbf" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}

export default WaveFormChart
