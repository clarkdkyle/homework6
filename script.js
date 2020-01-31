
var city = $("#search").val();

var apiKey = "&appid=afaa8eea1769b4359fd8e07b2efcefbd";

var date = new Date();

$("#search").keypress(function (event) {

  if (event.keyCode === 13) {
    event.preventDefault();
    $("#srchBtn").click();
  }
});

// search function
$("#srchBtn").on("click", function () {
  $('#5day').addClass('show');
  city = $("#search").val();
  $("#srchTerm").val("");

  const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET"
  })
    .then(function (response) {
      let Fahr = (response.main.temp - 273.15) * 1.80 + 32;

      currentconditions(response);
      currentforecast(response);
      show();
    })
});

function show() {
  let item = $("<li>").addClass("list-group-item").text(city);
  $(".list").append(item);
}

function currentforecast() {

  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response) {

    $('#4cast').empty();

    // response.list
    let results = response.list;

    for (let i = 0; i < results.length; i++) {
       let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
       let hour = results[i].dt_txt.split('-')[2].split(' ')[1];

      if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

        //  convert to fahrenheit 
        let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        let Fahr = Math.floor(temp);

        const card = $("<div>").addClass("card col-md-2 ml-4 bg-info");
        const body = $("<div>").addClass("card-body p-3 forecastBody")
        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
        const cityday = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
        const humid = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
        const temper = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + Fahr + " °F");

        body.append(cityday, image, temper, humid);
        card.append(body);
        $("#4cast").append(card);

      }
    }
  });
}

function currentconditions(response) {

  // convert to fahrenheit 
  let Fahr = (response.main.temp - 273.15) * 1.80 + 32;
  Fahr = Math.floor(Fahr);

  $('#theCity').empty();

  // get the content 
  const card = $("<div>").addClass("card");
  const body = $("<div>").addClass("card-body");
  const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
  const cityday = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
  const city = $("<h4>").addClass("card-title").text(response.name);
  const temper = $("<p>").addClass("card-text current-temp").text("Temperature: " + Fahr + " °F");
  const wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
  const humid = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");

  // add to page
  city.append(cityday, image)
  body.append(city, temper, humid, wind);
  card.append(body);
  $("#theCity").append(card)
}