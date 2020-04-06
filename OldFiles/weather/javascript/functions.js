/* *************************************
*  Weather Site JavaScript Functions
************************************* */

// const temp = 31;
// const speed = 5;

// buildWC(speed, temp);

// const direction = "SW"; //Set your own value

// windDial(direction);

//Call variables
// let currentCondition = "snow";
// let keyword = getCondition(currentCondition);
// console.log(keyword);
// changeSummaryImage(keyword);

// Calculate the Windchill
function buildWC(temp, speed) {

    const feelTemp = document.getElementById('feelTemp');
   
    // Compute the windchill
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);
   
    // Round the answer down to integer
    wc = Math.floor(wc);
   
    // If chill is greater than temp, return the temp
    wc = (wc > temp)?temp:wc;
   
    // Display the windchill
    console.log(wc);
    // wc = 'Feels like '+wc+'°F';
    feelTemp.innerHTML = wc;
    }

// Wind Dial Function
    function windDial(direction){

        // Get the wind dial container
        const dial = document.getElementById("dial");
        console.log(direction);
        // Determine the dial class
 switch (direction){
    case "North":
    case "N":
     dial.setAttribute("class", "n"); //"n" is the CSS rule selector
     break;
    case "NE":
    case "NNE":
    case "ENE":
     dial.setAttribute("class", "ne");
     break;
    case "NW":
    case "NNW":
    case "WNW":
     dial.setAttribute("class", "nw");
     break;
    case "South":
    case "S":
     dial.setAttribute("class", "s");
     break;
    case "SE":
    case "SSE":
    case "ESE":
     dial.setAttribute("class", "se");
     break;
    case "SW":
    case "SSW":
    case "WSW":
     dial.setAttribute("class", "sw");
     break;
    case "East":
    case "E":
     dial.setAttribute("class", "e");
     break;
    case "West":
    case "W":
     dial.setAttribute("class", "w");
     break;
   }
}

function getCondition(currentCondition) {
    currentCondition = currentCondition.toLowerCase();
    var keyword = "";
    if(currentCondition.includes("sun")|| currentCondition.includes("clear") || currentCondition.includes("nice"))
    keyword = "clear";
    if(currentCondition.includes("cloudy")|| currentCondition.includes("overcast") || currentCondition.includes("cloud"))
    keyword = "cloud";
    if(currentCondition.includes("fog")|| currentCondition.includes("foggy") || currentCondition.includes("mist"))
    keyword = "fog";
    if(currentCondition.includes("rain")|| currentCondition.includes("rainy") || currentCondition.includes("douwnpour"))
    keyword = "rain";
    if(currentCondition.includes("snow")|| currentCondition.includes("snowing") || currentCondition.includes("hail"))
    keyword = "snow";

    console.log(keyword);
    return keyword;
    
}

function changeSummaryImage(keywordReturn) {

    //Get the background element. 
    const bgImg = document.getElementById("widebox");
    const smImg = document.getElementById("changingimage");
    console.log(keywordReturn);

    //Determine Image for background return. 
    switch (keywordReturn) {
        case "clear": 
        bgImg.setAttribute("class", "clear");
        smImg.setAttribute("src", "/homework/weatherpicspage/images/barn_250.jpg");
        break; 
        case "cloud": 
        bgImg.setAttribute("class", "cloud");
        smImg.setAttribute("src", "/homework/weatherpicspage/images/clouds_250.jpg");
        break; 
        case "fog": 
        bgImg.setAttribute("class", "fog");
        smImg.setAttribute("src", "/homework/weatherpicspage/images/fog_250.jpg");
        break; 
        case "rain": 
        bgImg.setAttribute("class", "rain");
        smImg.setAttribute("src", "/homework/weatherpicspage/images/rain_250.jpg");
        break; 
        case "snow": 
        bgImg.setAttribute("class", "snow");
        smImg.setAttribute("src", "/homework/weatherpicspage/images/snow_250.jpg");
        break; 
    }
}

// Get location code from API
function getCode(LOCALE) {
    const API_KEY = 'cVur0SWSTcCGn8y6eBzdGX2ViK5tWMo1';
    const URL = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey='+API_KEY+'&q='+LOCALE;
    fetch(URL)
     .then(response => response.json())
     .then(function (data) {
      console.log('Json object from getCode function:');
      console.log(data);
      const locData = {}; // Create an empty object
      locData['key'] = data.Key; // Add the value to the object
      locData['name'] = data.LocalizedName;
      locData['postal'] = data.PrimaryPostalCode;
      locData['state'] = data.AdministrativeArea.LocalizedName;
      locData['stateAbbr'] = data.AdministrativeArea.ID;
      locData['geoposition'] = LOCALE;
      locData['elevation'] = data.GeoPosition.Elevation.Imperial.Value;
      getWeather(locData);
      })
     .catch(error => console.log('There was a getCode error: ', error))
  } // end getCode function

  // Get Current Weather data from API
function getWeather(locData) {
    const API_KEY = '';
    const CITY_CODE = locData['key']; // We're getting data out of the object
    const URL = "http://dataservice.accuweather.com/currentconditions/v1/332634?apikey=cVur0SWSTcCGn8y6eBzdGX2ViK5tWMo1&details=true";
    fetch(URL)
     .then(response => response.json())
     .then(function (data) {
      console.log('Json object from getWeather function:');
      console.log(data); // Let's see what we got back
      // Start collecting data and storing it
      locData['currentTemp'] = data[0].Temperature.Imperial.Value;
      locData['summary'] = data[0].WeatherText;
      locData['windSpeed'] = data[0].Wind.Speed.Imperial.Value;
      locData['windUnit'] = data[0].Wind.Speed.Imperial.Unit;
      locData['windDirection'] = data[0].Wind.Direction.Localized;
      locData['windGust'] = data[0].WindGust.Speed.Imperial.Value;
      locData['pastLow'] = data[0].TemperatureSummary.Past12HourRange.Minimum.Imperial.Value;
      locData['pastHigh'] = data[0].TemperatureSummary.Past12HourRange.Maximum.Imperial.Value;
      getHourly(locData); // Send data to getHourly function
      })
     .catch(error => console.log('There was an error: ', error))
  } // end getWeather function

  // Get next 12 hours of forecast data from API
function getHourly(locData) {
    const API_KEY = 'cVur0SWSTcCGn8y6eBzdGX2ViK5tWMo1';
    const CITY_CODE = locData['key'];
    const URL = "http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/332634?apikey=cVur0SWSTcCGn8y6eBzdGX2ViK5tWMo1";
    fetch(URL)
      .then(response => response.json())
      .then(function (data) {
      console.log('Json object from getHourly function:');
      console.log(data); // See what we got back
      // Get the first hour in the returned data
      let date_obj = new Date(data[0].DateTime);
      let nextHour = date_obj.getHours(); // returns 0 to 23
      // Store into the object
      locData["nextHour"] = nextHour;
      // Counter for the forecast hourly temps
      var i = 1;
      // Get the temps for the next 12 hours
      data.forEach(function (element) {
        let temp = element.Temperature.Value;
        let hour = 'hourTemp' + i;
        locData[hour] = temp; // Store hour and temp to object
        // New hiTemp variable, assign value from previous 12 hours
        let hiTemp = locData.pastHigh;
        // New lowTemp variable, assign value from previous 12 hours
        let lowTemp = locData.pastLow;
        // Check current forecast temp to see if it is 
        // higher or lower than previous hi or low
        if(temp > hiTemp){
          hiTemp = temp;
        } else if (temp < lowTemp){
          lowTemp = temp;
        }
        // Replace stored low hi and low temps if they changed
        if(hiTemp != locData.pastHigh){
          locData["pastHigh"] = hiTemp; // When done, this is today's high temp
        }
        if(lowTemp != locData.pastLow){
          locData["pastLow"] = lowTemp; // When done, this is today's low temp
        }
        i++; // Increase the counter by 1
      }); // ends the foreach method
      console.log('Finished locData object and data:');
      console.log(locData);
      buildPage(locData); // Send data to buildPage function
      })
      .catch(error => console.log('There was an error: ', error))
  } // end getHourly function

  function buildPage(locData) {
      console.log(locData);

      buildWC(locData.currentTemp, locData.windSpeed);
        

      windDial(locData.windDirection);

      let condition = getCondition(locData.summary);

        console.log(condition);

      changeSummaryImage(condition);

    document.getElementById('citystate').innerHTML = locData.name + ", " + locData.state;
    document.getElementById('zipcode').innerHTML = "Zipcode " + locData.postal;
    document.getElementById('elevation').innerHTML = "Elevation " + locData.elevation;
    document.getElementById('latlong').innerHTML = "Loocation " + locData.geoposition;
    document.getElementById('tempfont').innerHTML = locData.currentTemp + "&deg;F";
    document.getElementById('hightemp').innerHTML = locData.pastHigh + "&deg;F";
    document.getElementById('lowtemp').innerHTML = locData.pastLow + "&deg;F";
    document.getElementById('windSpeed').innerHTML = locData.windSpeed + " mph";
    document.getElementById('direction').innerHTML = "Direction: " + locData.windDirection;
    document.getElementById('gust').innerHTML = "Windspeed: " + locData.windSpeed;
    document.getElementById('weathercond').innerHTML = locData.summary;
    document.title = locData.name + ", " + locData.state;

    
    buildHourlyTemps(locData.nextHour, locData.hour);

}

// formats a value into a 12h AM/PM time string
function format_time(hour) {
    if(hour > 23){
      hour -= 24;
    }
    let amPM = (hour > 11) ? "pm" : "am";
    if(hour > 12) {
      hour -= 12;
    } else if(hour == 0) {
      hour = "12";
    }
    return hour + amPM;
  } // end format_time function

function buildHourlyTemps(hours, temps) {
    let list = document.getElementById("hourlyforecast");
    let listitem;

    for (var i = 0; i < hours.length; i++) {
        listitem = document.createElement('li');
        listitem.innerHTML = format_time(hours[i]) + " " + temps[i] + "&deg;F";

        list.appendChild(listitem);
    }
}
