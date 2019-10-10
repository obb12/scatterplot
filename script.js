var m = {
    t: 100,
    r: 20,
    b: 30,
    l: 60
  },
  width = 920 - m.l - m.r,
  height = 630 - m.t - m.b;

var x = d3.scaleLinear().range([0, width]);

var y = d3.scaleTime().range([0, height]);
var color = d3.scaleOrdinal(d3.schemeCategory10);
var timeFormat = d3.timeFormat("%M:%S");
var xAxis = d3.axisBottom(x).tickFormat(d3.format("d"))
var yAxis = d3.axisRight(y).tickFormat(timeFormat)
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

var svcon = d3.select("body").append("svg")
  .attr("width", width + m.l + m.r)
  .attr("height", height + m.t + m.b)
  .attr("class", "graph")
  .append("g")
  .attr("transform", "translate(" + m.l + "," + m.t + ")");

var time;

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
    d.Place = +d.Place;
    var parsedTime = d.Time.split(':');
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  x.domain([d3.min(data, function(d) {
    return d.Year - 1;
  }),
           d3.max(data, function(d) {
    return d.Year + 1;
  })]);
  y.domain(d3.extent(data, function(d) {
    return d.Time;
  }));

  svcon.append("g")
    .attr("class", "x axis")
    .attr("id","x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Year");

  svcon.append("g")
    .attr("class", "y axis")
    .attr("id","y-axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Best Time (minutes)")

  svcon.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -160)
    .attr('y', -44)
    .style('font-size', 18)
    .text('Time in Minutes');

  svcon.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d.Time);
    })
    .attr("data-xvalue", function(d){
      return d.Year;
    })
    .attr("data-yvalue", function(d){
      return d.Time.toISOString();
    })
    .style("fill", function(d) {
      return color(d.Doping != "");
    })
    .on("mouseover", function(d) {
      div.style("opacity", .9);
      div.attr("data-year", d.Year)
      div.html(d.Name + ": " + d.Nationality + "<br/>"
              + "Year: " +  d.Year + ", Time: " + timeFormat(d.Time)
              + (d.Doping?"<br/><br/>" + d.Doping:""))
        .style("l", (d3.event.pageX) + "px")
        .style("t", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      div.style("opacity", 0);
    });

  svcon.append("text")
        .attr("id","title")
        .attr("x", (width / 1.96))
        .attr("y", 0 - (m.t / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "30px")
        .text("Doping in Professional Bicycle Racing");

  svcon.append("text")
        .attr("x", (width / 1.9))
        .attr("y", 0 - (m.t / 2) + 25)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("35 Fastest times up Alpe d'Huez");

  var legendcon = svcon.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (height/2 - i * 20) + ")";
    });

  legendcon.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legendcon.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      if (d) return "Riders with doping allegations";
      else {
        return "No doping allegations";
      };
    });

});
