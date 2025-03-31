document.addEventListener("DOMContentLoaded", async () => {
    console.log("JavaScript Loaded!"); // Debugging Log

    // Dropdown Menu Functionality
    const moreButton = document.querySelector(".more-button");
    const dropdownMenu = document.querySelector(".more-nav");

    if (moreButton && dropdownMenu) {
        moreButton.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".more")) {
                dropdownMenu.classList.remove("show");
            }
        });
    }

    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

    // Hamburger Menu Toggle
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            navMenu.setAttribute("aria-expanded", navMenu.classList.contains("active").toString());
        });
    }

    // Weather Section
    const weatherAPIKey = "662df6608d27989682cde58fcce87ad6"; // Replace with your OpenWeatherMap API key
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=Timbuktu&units=metric&appid=${weatherAPIKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=Timbuktu&units=metric&appid=${weatherAPIKey}`;

    async function fetchWeather() {
        try {
            const weatherResponse = await fetch(weatherURL);
            const forecastResponse = await fetch(forecastURL);
            if (!weatherResponse.ok || !forecastResponse.ok) throw new Error("Failed to fetch weather data");

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            const currentTemp = document.getElementById("current-temp");
            const weatherDescription = document.getElementById("weather-description");
            const forecastContainer = document.getElementById("forecast");

            if (currentTemp && weatherDescription && forecastContainer) {
                currentTemp.textContent = `Current Temperature: ${Math.round(weatherData.main.temp)}°C`;
                weatherDescription.textContent = `Conditions: ${weatherData.weather.map(w => w.description).join(", ")}`;
                weatherDescription.innerHTML += `<br><strong>Humidity:</strong> ${weatherData.main.humidity}%`;
                weatherDescription.innerHTML += `<br><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s`; 
                weatherDescription.innerHTML += `<br><strong>Pressure:</strong> ${weatherData.main.pressure} hPa`;
                weatherDescription.innerHTML += `<br><strong>Visibility:</strong> ${weatherData.visibility / 1000} km`;
                weatherDescription.innerHTML += `<br><strong>Cloudiness:</strong> ${weatherData.clouds.all}%`;
                weatherDescription.innerHTML += `<br><strong>Sunrise:</strong> ${new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}`;
                weatherDescription.innerHTML += `<br><strong>Sunset:</strong> ${new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}`;
                weatherDescription.innerHTML += `<br><strong>Feels Like:</strong> ${Math.round(weatherData.main.feels_like)}°C`;
                weatherDescription.innerHTML += `<br><strong>Weather Main:</strong> ${weatherData.weather[0].main}`;
                
                const weatherIcon = weatherData.weather[0].icon;
                const weatherIconHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherData.weather[0].description}" />`;
                weatherDescription.innerHTML += weatherIconHTML;

                forecastContainer.innerHTML = "";
                forecastData.list.slice(0, 3).forEach((forecast) => {
                    const date = new Date(forecast.dt * 1000);
                    forecastContainer.innerHTML += `<p>${date.toLocaleDateString()}: ${Math.round(forecast.main.temp)}°C</p>`;
                });
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Spotlight Section
    async function fetchSpotlights() {
        try {
            const response = await fetch("data/members.json");
            if (!response.ok) throw new Error("Failed to fetch members data");

            const members = await response.json();
            const eligibleMembers = members.filter(member => member.membershipLevel >= 2);
            const shuffled = eligibleMembers.sort(() => 0.5 - Math.random()).slice(0, 3);

            const spotlightContainer = document.querySelector(".spotlight-container");
            if (spotlightContainer) {
                spotlightContainer.innerHTML = "";
                shuffled.forEach(member => {
                    spotlightContainer.innerHTML += `
                        <div class="business-card">
                            <h3>${member.name}</h3>
                            <img src="${member.image}" alt="${member.name}">
                            <p>${member.description}</p>
                            <p><strong>Phone:</strong> ${member.phone}</p>
                            <p><strong>Address:</strong> ${member.address}</p>
                            <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                            <p><strong>Membership:</strong> ${member.membershipLevel === 3 ? "🥇Gold" : "🥈Silver"}</p>
                        </div>
                    `;
                });
            }
        } catch (error) {
            console.error("Error fetching spotlight members:", error);
        }
    }

    // Grid/List Toggle Functionality
    const gridViewButton = document.getElementById("gridView");
    const listViewButton = document.getElementById("listView");
    const container = document.querySelector(".business-listings");

    if (gridViewButton && listViewButton && container) {
        async function fetchData() {
            try {
                const response = await fetch("data/members.json");
                if (!response.ok) throw new Error("Failed to fetch data");

                const data = await response.json();
                return Array.isArray(data) ? data : [];
            } catch (error) {
                console.error("Error fetching data:", error);
                return [];
            }
        }

        function displayMembers(data, view) {
            container.className = `business-listings ${view}`;
            container.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                container.innerHTML = "<p>No members found.</p>";
                return;
            }

            data.forEach((member) => {
                const card = document.createElement("div");
                card.className = "business-card";
                card.innerHTML = `
                    <div class="business-info">
                        <h3>${member.name}</h3>
                        <p>${member.membershipLevel === 3 ? "🥇Gold" : member.membershipLevel === 2 ? "🥈Silver" : ""} Member</p>
                        <p>${member.description}</p>
                    </div>
                    <div class="business-contact">
                        <img src="${member.image}" alt="${member.name}">
                        <div>
                            <p><strong>Address:</strong> ${member.address}</p>
                            <p><strong>Phone:</strong> <a href="tel:${member.phone}">${member.phone}</a></p>
                            <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        gridViewButton.addEventListener("click", async () => {
            const data = await fetchData();
            displayMembers(data, "grid");
        });

        listViewButton.addEventListener("click", async () => {
            const data = await fetchData();
            displayMembers(data, "list");
        });

        // Initial Fetch & Default View
        fetchData().then((data) => {
            displayMembers(data, "grid");
        });
    }

    // Fetch weather and spotlight data for the home page
    await fetchWeather();
    await fetchSpotlights();
});
