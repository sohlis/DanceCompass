$(document).ready(function(){

  function displayCircles(id, startingSizeDataPoint, startingColorPercentage, animate, updateDelay, transitionDelay) {
     /* circle visualization settings that use a data point between 0-400 to determine x, y and radius */
     var circleRadius = d3.scale.linear().domain([0, 400]).range(["5", 125]);

     // to leave circle in middle
     var circleYaxis = d3.scale.linear().domain([0, 400]).range(["50%", "50%"]);
     var circleXaxis = d3.scale.linear().domain([0, 400]).range(["50%", "50%"]);

     /* "stop light" color range for circle from green through yellow, orange and red using 0-100 as the range */
     var circleColorRange = d3.scale.linear().domain([0,33,67,100]).range(["green", "#FFCC00", "#FF9900", "red"]);

     // create an SVG element inside the #graph div that fills 100% of the div
     var vis = d3.select(id).append("svg:svg").attr("width", "100%").attr("height", "100%");
     /* add a circle -- we don't use the data point, as we will set it manually to animate it, so just passing in [1] */
     var circle = vis.selectAll("circle").data([1]).enter().append("svg:circle");

     /* setup the initial styling and sizing of the circle */
     circle
       .style("fill", circleColorRange(startingColorPercentage))
       .attr("cx", circleXaxis(startingSizeDataPoint))
       .attr("cy", circleYaxis(startingSizeDataPoint))
       .attr("r", circleRadius(startingSizeDataPoint));

     function redraw(dataValue, colorPercentage, stage) {
       // update the circle
       d3.selectAll('#'+stage).selectAll("circle")
         .transition()
         .duration(transitionDelay)
         .attr("cy", circleYaxis(dataValue))
         .attr("cx", circleXaxis(dataValue))
         .attr("r", circleRadius(dataValue))
         .style("fill", circleColorRange(colorPercentage));
     }

     // set maxSize, whatever is the biggest value from dataset
     var maxSize = 4.000;

     //input: data size; output: circle size
     function dataToSize(data) {
       return ((data*200)/maxSize)+20;
     }

     //input: data size; output: color number (100 = red .. 0 = green)
     function sizeToColor(size) {
       colorNumber = ((size*100)/maxSize);
       return colorNumber;
     }

     function danceData2() {
       d = Math.random() * (maxSize - 0.000);
       e = Math.random() * (maxSize - 0.000);
       getSizeAndColor(d, e);
     }

     function danceData() {
       $.ajax('/api',{success:function(data, textStatus) {
        //  d=Math.log(JSON.parse(data).Rock);
        //  e=Math.log(JSON.parse(data)['Hip-hop']);
        d=JSON.parse(data).Rock;
        e=JSON.parse(data)['Hip-hop'];
         if(isNaN(d)) {
           d = 0;
         }
         if(isNaN(e)) {
           e = 0;
         }
         getSizeAndColor(d, e);
         console.log(data);
       }});
     }

     var getSizeAndColor = function(rockIntensity, hiphopIntensity){

       var sizeRock = Math.floor(dataToSize(rockIntensity));
       var colorRock = sizeToColor(rockIntensity);

       var sizeHipHop = Math.floor(dataToSize(hiphopIntensity));
       var colorHipHop = sizeToColor(hiphopIntensity);

       redraw(sizeRock, colorRock, "stage1");
       redraw(sizeHipHop, colorHipHop, "stage2");

     };

     if(animate) {
       setInterval(function() {
         danceData();
       }, updateDelay);
     }

  }

  // id, startingSizeDataPoint, startingColorPercentage, animate, updateDelay, transitionDelay
  displayCircles("#stage1", 0, 0, true, 400, 400);
  displayCircles("#stage2", 0, 0, true, 400, 400);


});
