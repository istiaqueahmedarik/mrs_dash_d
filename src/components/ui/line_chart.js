import React from 'react'

function LineChart(props) {
  return (
    <div className="text-white m-auto w-fit">
    <LineChart
      xAxis={[{ data: props.xData }]}
      series={[
        {
          data: props.yData,
        },
      ]}
      width={props.width}
      height={props.height}
      sx={{
        '& .MuiChartsAxis-tickLabel': {
          color: 'white',
          fill: 'white !important',
        },
        '& .MuiChartsAxis-line': {
          stroke: 'white !important',
        },
      }}
    />
    <h1 className="text-center">{props.title}</h1>
  </div>
  )
}

export default LineChart;