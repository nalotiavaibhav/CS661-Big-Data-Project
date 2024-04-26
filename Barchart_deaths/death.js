function Death() {
  const data = [
    { name: "1990", score: 1333 },
    { name: "1995", score: 1323 },
    { name: "2000", score: 1387 },
    { name: "2005", score: 1373 },
    { name: "2010", score: 1459 },
    { name: "2011", score: 1498 },
    { name: "2012", score: 1541 },
    { name: "2013", score: 1585 },
    { name: "2014", score: 1592 },
    { name: "2015", score: 1608 },
    { name: "2016", score: 1600 },
    { name: "2017", score: 1604 },
    { name: "2018", score: 1645 },
    { name: "2019", score: 1667 },
  ];

  const width = 900;
  const height = 500; // Increase height to accommodate y-axis labels
  const margin = { top: 50, bottom: 50, left: 70, right: 50 }; // Adjust left margin
  const svg = d3v5
    .select("#d3v5-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  const x = d3v5
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3v5
    .scaleLinear()
    .domain([0, d3v5.max(data, (d) => d.score)])
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("fill", "royalblue")
    .selectAll("rect")
    .data(data.sort((a, b) => d3v5.descending(a.score, b.score)))
    .join("rect")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(d.score))
    .attr("title", (d) => d.score)
    .attr("class", "rect")
    .attr("height", (d) => height - margin.bottom - y(d.score))
    .attr("width", x.bandwidth());

  function yAxis(g) {
    g.attr("transform", `translate(${margin.left}, 0)`)
      .call(d3v5.axisLeft(y).ticks(5).tickFormat(d3v5.format(",.0f")))
      .attr("font-size", "14px");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20) // Position above the top of the y-axis
      .attr("x", -(height / 2)) // Center the label along the y-axis
      .attr("text-anchor", "middle") // Center the text
      .attr("font-size", "16px") // Set font size
      .attr("fill", "black") // Set text color
      .text("Number of deaths(per 1000)"); // Add
  }

  function xAxis(g) {
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3v5.axisBottom(x))
      .attr("font-size", "14px");

    g.append("text")
      .attr("y", margin.bottom - 10)
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text("Years");
  }

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);
  console.log(svg);
}

Death();
