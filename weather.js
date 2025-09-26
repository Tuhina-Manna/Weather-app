//Current weather
async function searchWeather(){
    const city = document.getElementById("cityInput").value.trim();
    const apiKey = "cf48dd83b4ce40c0cbf78f99fed14f05";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`City not found`);
        }
        const data = await response.json();
            console.log(data)

         // City name heading update
        document.getElementById("cityName").innerHTML = `
        <h1 style = "text-align:center">Weather for ${data.name}</h1>`;

         // Weather Icon and Description
         let weatherDescription = data.weather[0].description;
         weatherDescription= weatherDescription.charAt(0).toUpperCase()+ weatherDescription.slice(1);
         const iconCode = data.weather[0].icon;
         const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
         document.getElementById("weatherDescription").innerHTML = `
             <p><strong>Weather Condition:</strong> ${weatherDescription}
             <img src="${iconUrl}" alt="Weather Icon" height="100px" width="100px"></p>`;
       
         // Update temperature, humidity, wind
         document.getElementById("temp").innerHTML = 
        `Temparature: ${data.main.temp}°C<br>
        Max-Temparature: ${data.main.temp_max}°C<br>
        Min-Temparature: ${data.main.temp_min}°C`;   
        document.getElementById("humidity").innerHTML = 
        `Humidity: ${data.main.humidity}% <br>
        Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}<br> 
        Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;  
        document.getElementById("wind").innerHTML = 
        `Wind: ${data.wind.speed} km/h<br>
        Feels Like: ${data.main.feels_like}°C<br> 
        Direction: ${data.wind.deg}°`;

        //Background image change based on weather
        updateBackgroundImage(weatherDescription)
        //5 day forcast weather
        await getFiveDayForecast(city);
    }   
    catch (error) {
        alert(`❌ ${error.message}`);
    document.getElementById("cityName").innerHTML = `<h2 style="text-align: center; color:red;">City not found</h2>`;
    document.getElementById("temp").textContent = '--°C';
    document.getElementById("humidity").textContent = '--%';
    document.getElementById("wind").textContent = '-- km/h';
    document.getElementById("weatherIcon").innerHTML = '';
    document.getElementById("weatherDescription").innerHTML = '';
    }
}
function updateBackgroundImage(weatherDescription) {
    let backgroundImageUrl = ''; 
    if (weatherDescription.includes('https://example.com/rainy.jpg')) {
        backgroundImageUrl = "url('rain.jpg')";
    } else if (weatherDescription.includes('clear')) {
        backgroundImageUrl = "url('sunny.jpg')";
    } else if (weatherDescription.includes('cloud')) {
        backgroundImageUrl = "url('cloudy.jpg')";
    } else if (weatherDescription.includes('snow')) {
        backgroundImageUrl = "url('snowy.jpg')";
    }
    document.body.style.backgroundImage = backgroundImageUrl;
    document.body.style.backgroundSize = "cover";  // Make sure the background covers the full screen
    document.body.style.transition = "background 0.5s ease";  // Add transition for smooth background change
}
//5 days forecast weather
async function getFiveDayForecast(city) {
    document.getElementById("forecastTitle").style.display = "block";
    const apiKey = "cf48dd83b4ce40c0cbf78f99fed14f05";
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error("Forecast not found");
        const forecastData = await response.json();
        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "";
        const shownDays = new Set();
        forecastData.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!shownDays.has(date) && item.dt_txt.includes("12:00:00")) {
                shownDays.add(date);
                const icon = item.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                const card = `
                    <div style="border:2px solid #ccc; border-radius: 10px; margin-left:45px; padding:20px;">
                        <p><strong>${new Date(date).toDateString()}</strong></p>
                        <img src="${iconUrl}" alt="icon">
                        <p>${item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1)}</p>
                        <p>Temp: ${item.main.temp}°C</p>
                        <p>Humidity: ${item.main.humidity}%</p>
                    </div>`;
                forecastContainer.innerHTML += card;
            }
        });
    } catch (error) {
        document.getElementById("forecast").innerHTML = `<p style="color:red;">❌ Forecast unavailable</p>`;
    }
}

