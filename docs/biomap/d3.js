//// GETS COORDINATES
//document.onmousemove = function(e){
//var x = e.pageX;
//var y = e.pageY;
//e.target.title = "X is "+x+" and Y is "+y;
//};

function onloadupdate() {
    animateMap(18, data);
//    update(18, data);     // comment animateMap and uncomment for manual slide
}

function animateMap(start, data) {
    seconds = 3;                                // delay between time slots
    delay = seconds * 1000;
    timeslots = 24;                             // number of time slots
    for (let i = 0; i <= timeslots; i++) {
        setTimeout(() => {
            updateDots(i % (timeslots+1) + start, data);    // update the dots and text
        }, i * delay);
    }
}

var w = 900, h = 525, rX = 900, rY = 525,       // image dimensions
    axisW = 50,                                 // axis width
    xAdj = 15, yAdj = 15;                       // collide adjuments

// set the d3 symbol
var symbol = d3.symbol();

// create the d3 svg inside the body section div element
var svg = d3.selectAll("body").selectAll("section").selectAll("div")
	.append("svg")
	.attr("width", w)
	.attr("height", h);

// set the x and y scales for data
var xScale = d3.scaleLinear().domain([0, rX]).range([axisW, w-axisW]);
var yScale = d3.scaleLinear().domain([0, rY]).range([0, h]);

// add the d3 x axis and y axis
var xAxis = d3.axisBottom(xScale)
var yAxis = d3.axisLeft(yScale);
var gX = svg.append("g")
    .call(xAxis)
    .attr("class", "axisD3")
    .attr("transform", "translate(0,0)");
var gY = svg.append("g")
    .call(yAxis)
    .attr("class", "axisD3")
    .attr("transform", "translate(" + axisW + ", 0)");

// update the dots when the slider moves (onchange)
d3.select("#nHour").on("input", function() {
    updateDots(+this.value, data);
});

function scaleHour(fHour) {             // convert the slider index to hours values
    return fHour * 50;
}

function convertToTime(number) {        // convert the hours values to timestamp AM/PMM
  number = number % 24;
  let hours = Math.floor(number);
  let minutes = Math.round((number - hours) * 60);
  let ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

function updateDots(nhour, data) {      // function to update the dots & text
	d3.selectAll("svg").selectAll("path")
		.transition()
		.duration(1500)                 // transition to hide and remove dots
			.attr("opacity", 0)
		.remove();
	d3.selectAll("svg").selectAll("text")
		.transition()
		.duration(1500)                 // transition to hide and remove text
			.attr("opacity", 0)
		.remove();
	update(nhour, data);                // add the new dots and text
}

function update(nHour, data) {
    d3.select("#nHour-value")           // updates the hour label value
        .text(convertToTime(nHour * 50 / 100));
    d3.select("#nHour")                 // updates the slider value
        .property("value", nHour);

    let sHour = scaleHour(nHour)

    var dots = svg.selectAll(".dots")   // add the dots, filtered by hour
        .data(data)
        .enter()
        .append("path")
        .filter(d => d.hour === sHour); // filter data on hour

    var tdots = svg.selectAll(".text")  // add the text, filtered by hour
        .data(data)
        .enter()
        .append("text")
        .filter(d => d.hour === sHour)  // filter data on hour
        .attr("x", (d) => xScale(d.long + d.xadj * xAdj))   // x postion
        .attr("y", (d) => yScale(d.lat + d.yadj * yAdj))    // y position
        .attr("text-anchor", "middle")
        .text((d) => d.day)             // day text M, T, W, TH
        .attr("opacity", 0)             // default hidden
        .attr("font-family", "Arial")
        .attr("fill", (d) => d.tcolor)  // text color
        .transition()
        .duration(1500)                 // transition to show
            .attr("opacity", 1);

    dots.attr("d",
        symbol
            .type(
                function(d) {           // set the symbol
                    if (d.symbol == "circle") {
                        return d3.symbolCircle
                    } else if (d.symbol == "cross") {
                        return d3.symbolCross
                    } else if (d.symbol == "diamond") {
                        return d3.symbolDiamond
                    } else if (d.symbol == "square") {
                        return d3.symbolSquare
                    } else if (d.symbol == "star") {
                        return d3.symbolStar
                    } else if (d.symbol == "triangle") {
                        return d3.symbolTriangle
                    } else if (d.symbol == "wye") {
                        return d3.symbolWye
                    }
                }
            )
            .size((d) => d.size * 10)   // set the symbol size
        )
        .attr('fill', (d) => d.color)   // symbol color
        .attr("opacity", 0)             // default hidden
        .attr('stroke', '#111')         // symbol outline color
        .attr('stroke-width', 2)        // symbol outline width
        .attr('transform',
            function(d) {               // set x, y positions
                return "translate(" +
                    xScale(d.long + d.xadj * xAdj) +
                    "," +
                    yScale(d.lat + d.yadj * yAdj) +
                    ")";
            })
        .transition()
        .duration(1500)                 // transition to show
            .attr("opacity", 0.7);      // set opacity
}
