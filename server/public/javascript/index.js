$(document).ready(function(){
  var n = 40,
      random = d3.random.normal(0, 0.2),
      data = d3.range(n).map(random);

  var margin = {top: 20, right: 20, bottom: 20, left: 40},
      width = 640 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain([1, n - 2])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([-1, 1])
      .range([height, 0]);

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + y(0) + ")")
  //     .call(d3.svg.axis().scale(x).orient("bottom"));

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(d3.svg.axis().scale(y).orient("left"));

  var path = svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  tick();

  function tick() {

    // push a new data point onto the back
    data.push(random());

    // redraw the line, and slide it to the left
    path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + x(0) + ",0)")
        .each("end", tick);

    // pop the old data point off the front
    data.shift();

  }

    var chart = c3.generate({
      data: {
          columns: [
              ['data', 91.4]
          ],
          type: 'gauge'
      },
      gauge: {
  //        label: {
  //            format: function(value, ratio) {
  //                return value;
  //            },
  //            show: false // to turn off the min/max labels.
  //        },
  //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
  //    max: 100, // 100 is default
  //    units: ' %',
  //    width: 39 // for adjusting arc thickness
      },
      color: {
          pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
          threshold: {
  //            unit: 'value', // percentage is default
  //            max: 200, // 100 is default
              values: [30, 60, 90, 100]
          }
      }
  });



  setTimeout(function () {
      chart.load({
          columns: [['data', 10]]
      });
  }, 2000);

  setTimeout(function () {
      chart.load({
          columns: [['data', 33]]
      });
  }, 3000);

  setTimeout(function () {
      chart.load({
          columns: [['data', 66]]
      });
  }, 4000);

  setTimeout(function () {
      chart.load({
          columns: [['data', 100]]
      });
  }, 5000);

});
