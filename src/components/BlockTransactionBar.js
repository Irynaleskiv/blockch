import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';

export default class BlockTransactionBar extends React.Component {

  render() {
    const { allBlocks } = this.props.data;
    const svgWidth = 960,
      svgHeight = 500;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = svgWidth - margin.left - margin.right,
      height = svgHeight - margin.top - margin.bottom;

    const x = scaleBand()
        .rangeRound([0, width])
        .padding(0.1),
      y = scaleLinear().rangeRound([height, 0]);

    x.domain(allBlocks.map(block => block.index));
    y.domain([0, max(allBlocks, block => block.transactions.length)]);

     return (

       <svg width={svgWidth} height={svgHeight}>
         <g transform={`translate(${margin.left}, ${margin.top})`}>
           <g
             className="axis axis--x"
             transform={`translate(0, ${height})`}
           >
             <g ref={node => select(node).call(axisBottom(x))} />
             <text fill="white" x="860" y="15" dy="0.71em" textAnchor="center">
               Block
             </text>
           </g>
           <g className="axis axis--y">
             <g ref={node => select(node).call(axisLeft(y))} />
             <text fill="white" transform="rotate(-90)" y="6" dy="0.71em" textAnchor="end">
               Transactions per block
             </text>
           </g>
           {allBlocks.map(block => (
             <rect
               key={block.index}
               className="bar"
               x={x(block.index)}
               y={y(block.transactions.length)}
               width={x.bandwidth()}
               height={height - y(block.transactions.length)}
               style={{ fill: '#235A6F' }}
             />
           ))}
         </g>
       </svg>
     )
  }
}