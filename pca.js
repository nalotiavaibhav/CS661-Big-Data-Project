var selState;
async function createPlot(data, state) {
  var pc_data = data[state]["coordinates"];
  var air_quality_data = data[state]["Air Quality Index"];
  console.log(pc_data);

  // Calculate the extent of the data dynamically
  var extentX = d3v7.extent(pc_data, (d) => d[0]);
  var extentY = d3v7.extent(pc_data, (d) => d[1]);
  var extentAQI = d3v7.extent(air_quality_data);

  // Create SVG container for scatter plot
  var svgWidth = 600;
  var svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Select SVG container for scatter plot
  var svg = d3v7.select("#scatterplot").select("svg");

  // If SVG container doesn't exist, create one
  if (svg.empty()) {
    svg = d3v7
      .select("#scatterplot")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  }

  // Clear the existing plot
  svg.selectAll("*").remove();

  // Create scale
  var xScale = d3v7
    .scaleLinear()
    .domain([extentX[0], extentX[1]])
    .range([margin.left, width]);
  var yScale = d3v7
    .scaleLinear()
    .domain([extentY[0], extentY[1]])
    .range([height, margin.top]);
  var colorScale = d3v7
    .scaleLinear()
    .domain([extentAQI[0], extentAQI[1]])
    .range(["green", "red"]); // Adjust color range as needed

  // Create circles for scatter plot
  svg
    .selectAll("circle")
    .data(pc_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d[0]);
    })
    .attr("cy", function (d) {
      return yScale(d[1]);
    })
    .attr("r", 3)
    .attr("fill", function (d, i) {
      return colorScale(air_quality_data[i]);
    })
    .attr("opacity", 0.7);

  // Add axes
  var xAxis = d3v7.axisBottom(xScale);
  var yAxis = d3v7.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", "translate(0," + (height + margin.top) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(yAxis);
}

async function getData() {
  try {
    const response = await fetch("state_sne.json");
    const sneData = await response.json();

    const response2 = await fetch("state_pca.json");
    const pcaData = await response2.json();

    return [pcaData, sneData];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function updateMethod() {
  var method = document.querySelector(
    'input[name="methodSelect"]:checked'
  ).value;
  console.log(method);
  if (method == "PCA") {
    createPlot(pcaData, state);
  } else {
    createPlot(sneData, state);
  }
}

function updateMethod2(state) {
  selState = state;
  var method = document.querySelector(
    'input[name="methodSelect"]:checked'
  ).value;
  if (method == "PCA") {
    createPlot(pcaData, state);
  } else {
    createPlot(sneData, state);
  }
}

async function init(state) {
  const methodSelect = document.getElementsByName("methodSelect");
  for (let i = 0; i < methodSelect.length; i++) {
    methodSelect[i].addEventListener("change", updateMethod);
  }
  const data = await getData();
  pcaData = data[0];
  sneData = data[1];
  createPlot(pcaData, state);
}

// var state = "Delhi";
var pcaData;
var sneData;
init(selState);
// updateMethod2(state);
