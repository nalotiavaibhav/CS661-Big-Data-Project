async function createPlot(data, state) {
    var pc_data = data[state];
    console.log(pc_data);

    // Calculate the extent of the data dynamically
    var extentX = d3.extent(pc_data, (d) => d[0]);
    var extentY = d3.extent(pc_data, (d) => d[1]);

    // Create SVG container for scatter plot
    var svgWidth = 600;
    var svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 40, left: 40 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Select SVG container for scatter plot
    var svg = d3.select("#scatterplot").select("svg");

    // If SVG container doesn't exist, create one
    if (svg.empty()) {
        svg = d3
            .select("#scatterplot")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);
    }

    // Clear the existing plot
    svg.selectAll("*").remove();

    // Create scale
    var xScale = d3
        .scaleLinear()
        .domain([extentX[0], extentX[1]])
        .range([margin.left, width]);
    var yScale = d3
        .scaleLinear()
        .domain([extentY[0], extentY[1]])
        .range([height, margin.top]);

    // Create circles for scatter plot
    svg.selectAll("circle")
        .data(pc_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return xScale(d[0]);
        })
        .attr("cy", function (d) {
            return yScale(d[1]);
        })
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);

    // Add axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("transform", "translate(0," + (height + margin.top) + ")")
        .call(xAxis);
    svg.append("g")
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

var state = "Uttar Pradesh";
var pcaData;
var sneData;
init(state);
