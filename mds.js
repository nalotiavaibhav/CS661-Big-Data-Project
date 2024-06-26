function drawScatter_mds(sData) {
  d3v6.select("#scatter_mds").select("svg").remove();
  var data = sData;
  var array = [];
  var min = 0,
    max = 0;
  ftrNames = Object.keys(data);

  for (var i = 0; i < Object.keys(data[0]).length; ++i) {
    obj = {};
    obj.x = data[0][i];
    obj.y = data[1][i];
    obj.clusterid = data["clusterid"][i];
    obj.ftr1 = data[ftrNames[2]][i];
    obj.ftr2 = data[ftrNames[3]][i];
    array.push(obj);
    console.log(data["clusterid"][i]);
  }
  data = array;

  var margin = { top: 40, right: 40, bottom: 40, left: 50 },
    width = 550 - margin.left - margin.right,
    height = 330 - margin.top - margin.bottom;

  var xValue = function (d) {
      return d.x;
    },
    xScale = d3v6.scaleLinear().range([0, width]),
    xMap = function (d) {
      return xScale(xValue(d));
    },
    xAxis = d3v6.axisBottom().scale(xScale);

  var yValue = function (d) {
      return d.y;
    },
    yScale = d3v6.scaleLinear().range([height, 0]),
    yMap = function (d) {
      return yScale(yValue(d));
    },
    yAxis = d3v6.axisLeft().scale(yScale);

  var cValue;
  // if(rs) {
  //     cValue = function(d) { return d.clusteridx;}
  // } else {
  cValue = function (d) {
    return d.clusterid;
  };
  // }
  //var color = d3v6.scale.category20();

  var color = d3v6.scaleOrdinal().range(d3v6.schemeCategory10);

  var svg_mds = d3v6
    .select("#scatter_mds")
    .append("svg")
    .attr("id", "scatter_mds")
    .attr("width", 800)
    .attr("height", 600)
    .append("g")
    .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

  // var tooltip = d3v6.select("body").append('div').style('position','absolute');

  //  $("#scatter_mds").css({top: 40, left: 650, position: "absolute"});

  xScale.domain([d3v6.min(data, xValue) - 1, d3v6.min(data, yValue) - 1]);
  yScale.domain([d3v6.min(data, yValue) - 1, d3v6.max(data, yValue) + 1]);

  svg_mds
    .append("g")
    .attr("class", "myXaxis") // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .attr("opacity", "0");

  svg_mds
    .append("g")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", 6)
    .attr("transform", "rotate(-90)")
    .attr("dy", ".71em")
    .style("font", "18px sans-serif")
    .text("Component 2")
    .style("fill", "black")
    .style("font-size", "14px")
    .style("text-anchor", "end");

  // Add dots
  svg_mds
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", xMap)
    .attr("cy", yMap)
    .attr("r", 3.5)
    .style("fill", function (d) {
      return color(cValue(d));
    });

  // new X axis
  xScale.domain([d3v6.min(data, xValue) - 1, d3v6.max(data, xValue) + 1]);
  svg_mds
    .select(".myXaxis")
    .transition()
    .duration(100)
    .attr("opacity", "1")
    .call(xAxis);

  svg_mds
    .select(".myXaxis")
    .append("text")
    .attr("class", "label")
    .attr("y", -6)
    .attr("x", width)
    .text("Component 1")
    .style("font", "18px sans-serif")
    .style("fill", "black")
    .style("font-size", "14px")
    .style("text-anchor", "end");

  svg_mds
    .selectAll("circle")
    .transition()
    .delay(function (d, i) {
      return i * 3;
    })
    .duration(100)
    .attr("cx", xMap)
    .attr("cy", yMap);

  svg_mds
    .append("text")
    .attr("x", width / 2)
    .attr("y", -20 + margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    //.style("text-decoration", "underline")
    .style("font-weight", "bold")
    .text("MDS Plot");
}

function getD(value) {
  console.log(value);
  $.ajax({
    type: "GET",
    url: `${value}.json`,
    data: {},
    contentType: "application/json; charset=utf-8",
    xhrFields: {
      withCredentials: false,
    },
    headers: {},
    success: function (result) {
      data = result;
      drawScatter_mds(result);
    },
    error: function (xhr, status, error) {
      console.error(error);
    },
  });
}

document.getElementById("mds_select").onchange = (e) => {
  getD(document.getElementById("mds_select").value);
  console.log(document.getElementById("mds_select").value);
};

getD("mds");
