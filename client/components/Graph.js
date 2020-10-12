import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chartjs-plugin-annotation'

var ticks = [2500, 2000, 1800, 1650, 1500]
var datas = []
var annotations = [
  {
    drawTime: 'beforeDatasetsDraw',
    type: 'box',
    xScaleID: 'x-axis-0',
    yScaleID: 'y-axis-0',
    yMin: 2500,
    backgroundColor: 'rgba(255, 133, 27, 0.5)',
    borderWidth: 0,
  },
  {
    drawTime: 'beforeDatasetsDraw',
    type: 'box',
    xScaleID: 'x-axis-0',
    yScaleID: 'y-axis-0',
    yMin: 2000,
    yMax: 2500,
    backgroundColor: 'rgba(174, 129, 255, 0.5)',
    borderWidth: 0,
  },
  {
    drawTime: 'beforeDatasetsDraw',
    type: 'box',
    xScaleID: 'x-axis-0',
    yScaleID: 'y-axis-0',
    yMin: 1800,
    yMax: 2000,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 0,
  },
  {
    drawTime: 'beforeDatasetsDraw',
    type: 'box',
    xScaleID: 'x-axis-0',
    yScaleID: 'y-axis-0',
    yMin: 1650,
    yMax: 1800,
    backgroundColor: 'rgba(249, 38, 114, 0.5)',
    borderWidth: 0,
  },
  {
    drawTime: 'beforeDatasetsDraw',
    type: 'box',
    xScaleID: 'x-axis-0',
    yScaleID: 'y-axis-0',
    yMin: 1500,
    yMax: 1650,
    backgroundColor: 'rgba(166, 226, 46, 0.5)',
    borderWidth: 0,
  },
  {
    drawTime: 'beforeDatasetsDraw',
    type: 'box',
    xScaleID: 'x-axis-0',
    yScaleID: 'y-axis-0',
    yMin: 1000,
    yMax: 1500,
    backgroundColor: 'rgba(102, 217, 239, 0.5)',
    borderWidth: 0,
  },
]

const median = (arr) => {
  if (arr.length == 0) return 1500
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a.y - b.y)
  return arr.length % 2 !== 0
    ? nums[mid].y
    : (nums[mid - 1].y + nums[mid].y) / 2
}

const mnX = (arr) =>
  arr.length == 0
    ? null
    : arr.length == 1
    ? arr[0].x - 24 * 3600 * 1000
    : arr[0].x
const mxX = (arr) =>
  arr.length == 0
    ? null
    : arr.length == 1
    ? arr[0].x + 24 * 3600 * 1000
    : arr[arr.length - 1].x

const changeUnit = (arr) => {
  if (arr.length == 1) return 'day'
  var diff = mxX(arr) - mnX(arr)
  if (diff < 7 * 24 * 3600 * 1000) return 'day'
  else if (diff < 30 * 24 * 3600 * 1000) return 'week'
  else if (diff < 3 * 30 * 24 * 3600 * 1000) return 'month'
  else if (diff < 12 * 30 * 24 * 3600 * 1000) return 'quarter'
  else return 'year'
}
const Data = (datas) => ({
  datasets: [
    {
      fill: false,
      lineTension: 0.1,
      borderCapStyle: 'round',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 3,
      pointRadius: 5,
      pointHitRadius: 10,
      data: datas,
    },
  ],
})

const option = (datas) => ({
  legend: {
    display: false,
  },
  resposive: true,
  tooltips: {
    callbacks: {
      title: function (tooltipItem, data) {
        var param = data.datasets[0].data[tooltipItem[0].index]
        return `• ${param.id} ${param.conName}`
      },
      label: function (tooltipItem, data) {
        var param = data.datasets[0].data[tooltipItem.index]
        return [`Rank: ${param.rank}`, `Rating: ${param.y}`]
      },
    },
    backgroundColor: 'rgba(255,255,255,0.83)',
    titleFontSize: 16,
    titleFontColor: '#ff851b',
    bodyFontColor: '#000',
    bodyFontSize: 14,
    displayColors: false,
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          unit: changeUnit(datas),
        },
        ticks: {
          min: mnX(datas),
          max: mxX(datas),
        },
        gridLines: {
          lineWidth: 1,
          color: 'rgba(0,0,0,0.1)',
        },
      },
    ],
    yAxes: [
      {
        stacked: true,
        ticks: {
          autoSkip: false,
          min: 1200,
          suggestedMax: median(datas) + 300,
        },
        afterBuildTicks: function (scale) {
          scale.ticks = ticks
          return
        },
        beforeUpdate: function (oScale) {
          return
        },
        gridLines: {
          lineWidth: 0,
          color: 'rgba(0,0,0,0.1)',
        },
      },
    ],
  },
  onClick: function (evt) {
    var element = this.getElementAtEvent(evt)
    console.log(element)
  },
  annotation: {
    annotations: annotations,
  },
})
const Graph = ({ history }) => {
  return (
    <div>
      <Line data={Data(history)} options={option(history)} />
    </div>
  )
}
export default Graph
