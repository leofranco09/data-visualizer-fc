import * as d3 from "d3";
import React, { useEffect, useRef } from 'react';



const BarChart = ({ dataset }) => {
  const svgRef = useRef()

  useEffect(() => {
    if(dataset.length === 0) return;

    const w = 900;
    const h = 460;
    const padding = 40;

    const parseData = dataset.map(d => ({
      date: new Date(d[0]),
      value: d[1]
    }));
    // escale de X con las fechas
    const xScale = d3.scaleTime()
      .domain(d3.extent(parseData, d => d.date))
      .range([padding, w - 2 * padding]);
    
      //escala de Y con el PIB
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(parseData, d => d.value)])
      .range([h - padding, padding]);
    
    const anchocdBar = (h - 2 * padding) / parseData.length;

    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h);

    // Eleminar dibujos anteriores
    svg.selectAll("*").remove()

    // texto 
    if (svg.select("#title").empty()) {
      svg.append("text")
        .attr("id", "title")
        .attr("x", w / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "24px")
        .attr("fill", "black")
        .text("USA GDP");
    }

    // crear Ejes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
      .attr("transform", `translate(10, ${h - padding})`)
      .attr("id", "x-axis")
      .attr("class", "tick")
      .call(xAxis)
    
    svg.append("g")
      .attr("transform",`translate(${padding + 10}, 0)` )
      .attr("id", "y-axis")
      .attr("class", "tick")
      .call(yAxis)
    
    const tooltip = d3.select("#tooltip");
      // Dibujar las barras
    svg.selectAll("rect")
      .data(parseData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d.date.toISOString().split("T")[0])
      .attr("data-gdp", d => d.value)
      .attr("x", d => xScale(d.date)  - anchocdBar / 2 + 10)
      .attr("y", d => yScale(d.value))
      .attr("width", anchocdBar)
      .attr("height", d => Math.abs(yScale(0) - yScale(d.value)))
      .attr("fill", "yellowgreen")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
        .html(`Año: ${d.date.getFullYear()}<br/> PIB: $${d.value}B`)
        .attr("data-date", d.date.toISOString().split("T")[0])
        .style("left", `${event.pageX + 20}px`)
        .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden")
      })
  }, [dataset]);


  return ( 
    
    <svg ref={svgRef}>
      <text id="title" x="350" y="40">USA GDP</text>
    </svg>
    
   );
}
 
export default BarChart;