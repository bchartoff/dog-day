function isMobile(){
  return d3.select("#isMobile").style("display") == "block"
}

var momentFormatString = "MM-DD-YYYY"
var momentDisplayString = "MMMM Do, YYYY"
var datepickerFormatString = "mm-dd-yy"
var d3FormatString = "%m-%d-%Y"
var d3DisplayString = "%b %Y"
var d3MobileDisplayString = "%m/%y"

var W = (isMobile()) ? 320 : 600;
var H = (isMobile()) ? 320 : 450;
var margin = {top: 20, right: 90, bottom: 50, left: 50},
width = W - margin.left - margin.right,
height = H - margin.top - margin.bottom;

var parseTime = d3.timeParse(d3FormatString);

var svg = d3.select("#graphContainer").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")
    .style("opacity",0);

var textWrapper = d3.select("#graphContainer").append("div")
  .attr("id", "textWrapper")

function errorMessage(message){
  svg
    .transition()
    .style("opacity",0)

  d3.select("#textWrapper").html(message)
}

function updateDogDay(humanDate, dogDate){
  var humanBirthday = moment(humanDate, "MM-DD-YYYY");
  var dogBirthday = moment(dogDate, "MM-DD-YYYY");
  var humanAgeAtDogBirthday = dogBirthday.diff(humanBirthday,"day")
  var daysUntilBirthday = humanAgeAtDogBirthday/6
  var humanAgeAtDogDay = (humanAgeAtDogBirthday + daysUntilBirthday)/365
  var dogDay = dogBirthday.clone().add(daysUntilBirthday, "day")

  if(dogDay.clone().diff(dogBirthday, "day") == 0){
    errorMessage("Your birthdays are too close together! Your pup has always been older than you (in dog years).")
    return false;
  }
  else if(humanAgeAtDogDay < 0){
    errorMessage("Your dog was born before you! That pup has always been older than you (in dog years).")
    return false;
  }
  else if(humanAgeAtDogDay > 150){
    errorMessage("Bad news, I don't think you'll make it to your dog day. You'd be " + Math.round(humanAgeAtDogDay) + " years old...")
    return false
  }

  var yearPadding = (humanAgeAtDogBirthday)*.03/365
  var humanAgePadding = yearPadding * 365 * humanAgeAtDogDay / dogDay.diff(humanBirthday, "day")
  var dogAgePadding = yearPadding * 365 * humanAgeAtDogDay  / dogDay.diff(dogBirthday, "day")

  function plural(num){
    return (parseInt(num) == 1) ? "" : "s"
  }

  d3.select("#textWrapper").html(function(){
    var humanDuration = moment.duration(dogDay.diff(humanBirthday));
    var humanText = humanDuration.years() + " year" + plural(humanDuration.years()) + ", " + humanDuration.months() + " month" + plural(humanDuration.months()) + ", and " + humanDuration.days() + " day" + plural(humanDuration.days())

    var dogDuration = moment.duration(dogDay.diff(dogBirthday));
    var dogText = dogDuration.years() + " human year" + plural(dogDuration.years()) + ", " + dogDuration.months() + " human month" + plural(dogDuration.months()) + ", and " + dogDuration.days() + " human day" + plural(dogDuration.days())

    return "On your dog day, <span>" + dogDay.format(momentDisplayString) + "</span>, you will be " + humanText + " old. Your dog will be " + dogText + " old."
  })

  svg.transition().style("opacity",1)

  var x = d3.scaleTime().range([0, width]).domain([parseTime(humanBirthday.clone().subtract(yearPadding, "year").format(momentFormatString)), parseTime(dogDay.clone().add(yearPadding*2,"year").format(momentFormatString))])
  var y = d3.scaleLinear().range([height, 0]).domain([0,humanAgeAtDogDay + dogAgePadding])

  var numTicks = (isMobile()) ? 3 : 5
  var dispString = (isMobile()) ? d3MobileDisplayString : d3DisplayString
  d3.select(".x.axis")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(x).tickSizeOuter(0).ticks(numTicks).tickFormat(d3.timeFormat(dispString)));

  d3.select(".y.axis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y).tickSize(-width));

  d3.select(".human.line")
    .transition()
    .duration(1000)
      .attr("x1", x(parseTime(humanBirthday.clone().format(momentFormatString))))
      .attr("x2", x(parseTime(dogDay.clone().add(yearPadding,"year").format(momentFormatString))))
      .attr("y1", y(0))
      .attr("y2", y(humanAgeAtDogDay + humanAgePadding))

  d3.select(".human.text")
    .transition()
    .duration(1000)
      .attr("x", x(parseTime(dogDay.clone().add(yearPadding,"year").format(momentFormatString))))
      .attr("y", y(humanAgeAtDogDay + humanAgePadding))


  d3.select(".dog.line")
    .transition()
    .duration(1000)
      .attr("x1", x(parseTime(dogBirthday.clone().format(momentFormatString))))
      .attr("x2", x(parseTime(dogDay.clone().add(yearPadding,"year").format(momentFormatString))))
      .attr("y1", y(0))
      .attr("y2", y(humanAgeAtDogDay + dogAgePadding))

  d3.select(".dog.text")
    .transition()
    .duration(1000)
      .attr("x", x(parseTime(dogDay.clone().add(yearPadding,"year").format(momentFormatString))))
      .attr("y", y(humanAgeAtDogDay + dogAgePadding))

  d3.select(".dog.dot")
    .transition()
    .duration(1000)
      .attr("cx",x(parseTime(dogDay.clone().format(momentFormatString))))
      .attr("cy",y(humanAgeAtDogDay))
      .style("opacity",1)
}
function drawDogDay(humanDate, dogDate){

var humanBirthday = moment(humanDate, "MM-DD-YYYY");
var dogBirthday = moment(dogDate, "MM-DD-YYYY");
var humanAgeAtDogBirthday = dogBirthday.diff(humanBirthday,"day")
var daysUntilBirthday = humanAgeAtDogBirthday/6
var humanAgeAtDogDay = (humanAgeAtDogBirthday + daysUntilBirthday)/365
var dogDay = dogBirthday.clone().add(daysUntilBirthday, "day")

var yearPadding = (humanAgeAtDogBirthday)*.1/365
//similar triangles geometry
var humanAgePadding = yearPadding * humanAgeAtDogDay/ dogDay.diff(humanBirthday, "year")
var dogAgePadding = yearPadding * humanAgeAtDogDay / dogDay.diff(dogBirthday, "year")

var x = d3.scaleTime().range([0, width]).domain([parseTime(humanBirthday.clone().subtract(yearPadding, "year").format(momentFormatString)), parseTime(dogDay.clone().add(yearPadding*2,"year").format(momentFormatString))])
var y = d3.scaleLinear().range([height, 0]).domain([0,humanAgeAtDogDay + dogAgePadding])

svg.append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(y).tickSize(-width));

svg.append("text")
  .attr("class","y label")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Age");   

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSizeOuter(0));

svg.append("text")
  .attr("class", "x label")             
  .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Date");


svg.append("line")
  .attr("class", "human line")
  .attr("x1", x(parseTime(humanBirthday.clone().format(momentFormatString))))
  .attr("x2", x(parseTime(humanBirthday.clone().format(momentFormatString))))
  .attr("y1", y(0))
  .attr("y2", y(0))

svg.append("text")
  .attr("class","human text")
  .attr("x",x(parseTime(humanBirthday.clone().format(momentFormatString))))
  .attr("y", y(0))
  .attr("dx", 5)
  .text("You")

svg.append("line")
  .attr("class", "dog line")
  .attr("x1", x(parseTime(dogBirthday.clone().format(momentFormatString))))
  .attr("x2", x(parseTime(dogBirthday.clone().format(momentFormatString))))
  .attr("y1", y(0))
  .attr("y2", y(0))

svg.append("text")
  .attr("class","dog text")
  .attr("x", x(parseTime(dogBirthday.clone().format(momentFormatString))))
  .attr("y", y(0))
  .attr("dx", 5)
  .text("Your dog")

svg.append("circle")
  .attr("class", "dog dot")
  .attr("cx",x(parseTime(dogBirthday.clone().format(momentFormatString))))
  .attr("cy",y(0))
  .attr("r",8)
  .style("opacity",0)
}


$(function() {
  drawDogDay("01-15-1986","07-05-2014")
  $( "#dogBirthday" ).datepicker({
    inline: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-150:+0",
    monthNamesShort: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    dateFormat: datepickerFormatString,
    onSelect: function(){
      if(! moment($( "#humanBirthday" ).datepicker( "getDate" )).isSame(moment(), "day")){
        updateDogDay( moment($( "#humanBirthday" ).datepicker("getDate")).format(momentFormatString), this.value)  
      }
    }
  })

  $( "#humanBirthday" ).datepicker({
    inline: true,
    changeMonth: true,
    changeYear: true,
    yearRange: "-150:+0",
    monthNamesShort: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    dateFormat: datepickerFormatString,
    onSelect: function(){
      if(! moment($( "#dogBirthday" ).datepicker( "getDate" )).isSame(moment(), "day")){
        updateDogDay(this.value, moment($( "#dogBirthday" ).datepicker("getDate")).format(momentFormatString))  
      }
    }
  });
})
