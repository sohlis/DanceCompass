$(document).ready(function(){

  function displayCircleExample(id, startingSizeDataPoint, startingColorPercentage, animate, updateDelay, transitionDelay) {
		/* circle visualization settings that use a data point between 0-400 to determine x, y and radius */
		var circleRadius = d3.scale.linear().domain([0, 400]).range(["5", 125]);
		// radius can also be done using pow() instead of linear()
		//var circleRadius = d3.scale.pow().exponent(0.5).domain([0, 400]).range(["5", maxRadiusForCircle]);

		/*
		 * X and Y axis are set to dynamically change so when it animates the circle slightly moves up/down, left/right
		 * so that as the radius changes the location moves to fit better
		 */
		var circleYaxis = d3.scale.linear().domain([0, 400]).range(["30%", "50%"]);
		var circleXaxis = d3.scale.linear().domain([0, 400]).range(["30%", "50%"]);

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

		// create a simple data array
		var dataA = [80, 100, 105, 95, 130, 150, 170, 160, 250, 275, 255, 275, 320, 350, 320, 350, 310, 280, 310, 305, 315, 295, 275, 265, 240];
		var dataB = [0, 3, 6, 2, 7, 9, 3, 5, 8, 14, 16, 26, 36, 45, 40, 38, 52, 67, 58, 78, 85, 88, 76, 89, 98, 97, 92, 86, 75, 34, 25, 18, 12, 6, 3, 0, 0];


		function redraw(dataValue, colorPercentage) {
			// update the circle
			d3.selectAll(id).selectAll("circle")
				.transition()
				.duration(transitionDelay)
				.attr("cy", circleYaxis(dataValue))
				.attr("cx", circleXaxis(dataValue))
				.attr("r", circleRadius(dataValue))
				.style("fill", circleColorRange(colorPercentage));
		}


		if(animate) {
			setInterval(function() {
			    var vA = dataA.shift(); // remove the first element of the array
			   dataA.push(vA); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)
			   var vB = dataB.shift(); // remove the first element of the array
			   dataB.push(vB); // add a new element to the array (we're just taking the number we just shifted off the front and appending to the end)

			   redraw(vA, vB);
			}, updateDelay);
		}
	}

	displayCircleExample("#circle1a", 100, 0, false, 1000, 1000);
	displayCircleExample("#circle1b", 200, 50, false, 1000, 1000);
	displayCircleExample("#circle2", 100, 0, true, 1000, 1000);
	displayCircleExample("#circle3", 100, 0, true, 400, 400);
	displayCircleExample("#circle4", 60, 45, false, 1000, 1000);
	displayCircleExample("#circle5", 250, 75, false, 1000, 1000);

});
