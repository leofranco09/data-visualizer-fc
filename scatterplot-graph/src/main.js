import * as d3 from "d3";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 900;
const h = 500;
const padding = 40;

let dataset = [];
let xScale;
let yScale;
let xAxis;
let yAxis;

const svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              .style("background-color", "whitesmoke");

const tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")              

function generateScales() {
   xScale = d3.scaleLinear()
               .domain([d3.min(dataset, d => d.Year - 1), d3.max(dataset, d => d.Year + 1 )])
               .range([padding, w - padding]);

   yScale = d3.scaleTime()
               .domain([d3.min(dataset, d => new Date(d.Seconds * 1000)), d3.max(dataset, d => new Date(d.Seconds * 1000))])
               .range([padding, h - padding]);
}

// dibujar puntos
function drawPoints() {
   svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => new Date(d.Seconds * 1000))
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
      .attr("r", 5)
      .attr("fill", d => d.Doping ? "orange" : "lightgreen")
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
        .html(`
         ${d.Name}: ${d.Nationality}<br/>
         Year: ${d.Year}, Time: ${d.Time}<br/>
         ${d.Doping}
         `)
        .attr("data-year", d.Year )
        .style("left", `${event.pageX + 20}px`)
        .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden")
      })
}

// generar axis
function generateAxis() {
   xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format("d"));
   yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat("%M:%S"));

   svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h - padding})`)
      .call(xAxis);

   svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);
}


d3.json(url)
   .then(data => {
      dataset = data;
console.log(dataset);

// title
svg.append("text")
   .text("Doping in Professional Bicycle Racing")
   .attr("id", "title")
   .attr("x", w / 2)
   .attr("y", 50)
   .attr("text-anchor", "middle")
   .attr("font-size", "30px")

// subtitle              
svg.append("text")
   .text("35 Fastest times up Alpe d'Huez")
   .attr("id", "subtitle")
   .attr("x", w / 2)
   .attr("text-anchor", "middle ")
   .attr("y", 85)
   .attr("font-size", "20px"); 

      


   generateScales()
   drawPoints()
   generateAxis()

   // lagend
   const legendData = [
      { label: "No doping allegations", color: "lightgreen" },
      { label: "Riders with doping allegations", color: "orange" }
   ];

   const legend = svg.append("g")
     .attr("id", "legend")
     // posiciona el legend cerca del borde derecho
     .attr("transform", `translate(${w - padding }, ${h / 2 - 30})`);

   const item = legend.selectAll(".legend-label")
     .data(legendData)
     .enter()
     .append("g")
     .attr("class", "legend-label")
     .attr("transform", (d, i) => `translate(0, ${i * 24})`);

   item.append("rect")
     .attr("x", -18)      
     .attr("width", 18)
     .attr("height", 18)
     .attr("fill", d => d.color);

   item.append("text")
     .attr("x", -24)
     .attr("y", 9)
     .attr("dy", ".35em")
     .style("text-anchor", "end")
     .style("font-size", "12px")
     .text(d => d.label);

   })
   .catch(err => console.log(err));