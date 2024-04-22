// Generate an array of 50 data points
var data = [];
for (var i = 0; i < 50; i++) {
    data.push({
        Ozone: Math.random() * 100,
        CO: Math.random() * 100,
        SO2: Math.random() * 100,
        NO2: Math.random() * 100,
    });
}

// Create SVG
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

// Create scales
var xScale = d3.scaleLinear().domain([0, 100]).range([50, 450]);
var yScale = d3.scaleLinear().domain([0, 100]).range([450, 50]);

// Create color scale
var colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

// Create scatterplot
svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return xScale(d.Ozone);
    })
    .attr("cy", function (d) {
        return yScale(d.CO);
    })
    .attr("r", 5)
    .attr("fill", function (d) {
        return colorScale(d.CO);
    }); // Apply color scale to 'Ozone' value
