var margin = { top: 30, right: 10, bottom: 10, left: 0 },
  width = 800 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3v4
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
function plotParallelCoordinates(state = "") {
  svg.selectAll("*").remove();
  d3v4.csv("formatted_data.csv", function (data_1) {
    // Filter data for the selected state
    if (state === "") {
      var data = data_1;
    } else {
      var data = data_1.filter(function (d) {
        return d.State === state;
      });
    }

    var color = d3v4
      .scaleOrdinal()
      .domain(["2021", "2022", "2023"])
      .range(["#440154ff", "#21908dff", "#fde725ff"]);

    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called State
    dimensions = d3v4.keys(data[0]).filter(function (d) {
      return d != "State";
    });

    // For each dimension, I build a linear scale. I store all in a y object
    var y = {};
    for (i in dimensions) {
      name = dimensions[i];
      if (name === "Year") {
        y[name] = d3v4
          .scaleOrdinal()
          .domain(["2021", "2022", "2023"])
          .range([height, height / 2, 0]);
      } else {
        y[name] = d3v4
          .scaleLinear()
          .domain(
            d3v4.extent(data, function (d) {
              return +d[name];
            })
          )
          .range([height, 0]);
      }
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3v4.scalePoint().range([0, width]).padding(1).domain(dimensions);

    // Highlight the year that is hovered
    var highlight = function (d) {
      selected_year = d.Year;

      // first every group turns grey
      d3v4
        .selectAll(".line")
        .transition()
        .duration(200)
        .style("stroke", "lightgrey")
        .style("opacity", "0.2");
      // Second the hovered year takes its color
      d3v4
        .selectAll("." + selected_year)
        .transition()
        .duration(200)
        .style("stroke", color(selected_year))
        .style("opacity", "1");
    };

    // Unhighlight
    var doNotHighlight = function (d) {
      d3v4
        .selectAll(".line")
        .transition()
        .duration(200)
        .delay(1000)
        .style("stroke", function (d) {
          return color(d.Year);
        })
        .style("opacity", "1");
    };

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
      return d3v4.line()(
        dimensions.map(function (p) {
          return [x(p), y[p](d[p])];
        })
      );
    }

    // Draw the lines
    svg
      .selectAll("myPath")
      .data(data)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", (d) => color(d.Year))
      .style("opacity", 0.5)
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight);

    // Draw the axis:
    svg
      .selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions)
      .enter()
      .append("g")
      // I translate this element to its right position on the x axis
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      })
      // And I build the axis with the call function
      .each(function (d) {
        d3v4.select(this).call(d3v4.axisLeft().scale(y[d]));
      })
      // Add axis title
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) {
        return d;
      })
      .style("fill", "black");
  });
}

// Call the function with the desired state
