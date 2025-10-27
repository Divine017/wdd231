document.addEventListener("DOMContentLoaded", async () => {
    console.log("JavaScript Loaded!");

    // Dropdown Menu Functionality
    const moreButton = document.querySelector(".more-button");
    const dropdownMenu = document.querySelector(".more-nav");

    if (moreButton && dropdownMenu) {
        moreButton.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownMenu.classList.toggle("show");

            if (dropdownMenu.classList.contains("show")) {
                dropdownMenu.style.zIndex = "10";
            } else {
                dropdownMenu.style.zIndex = ""; 
            }
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".more")) {
                dropdownMenu.classList.remove("show");
                dropdownMenu.style.zIndex = "";
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
            
            if (navMenu.classList.contains("active")) {
                navMenu.style.zIndex = "10";
            } else {
                navMenu.style.zIndex = "";
            }
        });
    }

    // Weather Section
    const weatherAPIKey = "662df6608d27989682cde58fcce87ad6";
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
                currentTemp.innerHTML = `<strong>Current Temperature:</strong> ${Math.round(weatherData.main.temp)}°C`;
                weatherDescription.innerHTML = `<strong>Conditions:</strong> ${weatherData.weather.map(w => w.description).join(", ")}`;
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
                const uniqueDays = new Set();
                forecastData.list.forEach((forecast) => {
                    const date = new Date(forecast.dt * 1000);
                    const today = new Date();
                    const isToday = date.toDateString() === today.toDateString();
                    const dayName = isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" });
                    if (!uniqueDays.has(dayName) && uniqueDays.size < 3) {
                        uniqueDays.add(dayName);
                        forecastContainer.innerHTML += `<p>${dayName}: ${Math.round(forecast.main.temp)}°C</p>`;
                    }
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
                            <img src="${member.image}" alt="${member.name}" loading="lazy">
                            <p class="description">${member.description}</p>
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
                        <p class="description">${member.description}</p>
                    </div>
                    <div class="business-contact">
                        <img src="${member.image}" alt="${member.name}" loading="lazy">
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
    await loadIndexEvents(); // Load events into the #events section
});

window.addEventListener("DOMContentLoaded", () => {
    const membershipCards = document.querySelectorAll(".membership-cards .card");
    if (membershipCards.length > 0) {
        membershipCards.forEach((card, index) => {
            setTimeout(() => card.classList.add("loaded"), index * 200);
        });
    }
  
    // Set timestamp
    const timestampElement = document.getElementById("timestamp");
    if (timestampElement) {
        timestampElement.value = new Date().toISOString();
    }

    highlightCurrentPage();
});

function highlightCurrentPage() {
    const navLinks = document.querySelectorAll("nav ul li a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById("overlay");
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById("overlay");
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
}

const params = new URLSearchParams(window.location.search);
        const fields = ["firstName", "lastName", "email", "phone", "business", "timestamp"];
        const list = document.getElementById("confirmationDetails");
      
        fields.forEach(field => {
          if (params.has(field)) {
            const li = document.createElement("li");
            li.textContent = `${field.replace(/([A-Z])/g, " $1")}: ${params.get(field)}`;
            list.appendChild(li);
          }
        });

function displayCurrentPageName() {
    const header = document.querySelector("header");
    const currentPage = window.location.pathname.split("/").pop().replace(".html", "");
    const formattedPageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

    const pageNameElement = document.createElement("div");
    pageNameElement.className = "current-page-name mobile-only";
    pageNameElement.textContent = formattedPageName === "Index" ? "Home" : formattedPageName;

    header.insertBefore(pageNameElement, header.querySelector("nav"));
}

document.addEventListener("DOMContentLoaded", () => {
    displayCurrentPageName();
    // ...existing code...
});

async function loadIndexEvents() {
    try {
        const response = await fetch('data/events.json');
        const data = await response.json();
        const eventsContainer = document.getElementById('events');

        if (eventsContainer) {
                const existingHeading = eventsContainer.querySelector('h2');
                eventsContainer.innerHTML = "";
                if (existingHeading) {
                        eventsContainer.appendChild(existingHeading);
                }

                data.events.slice(0, 3).forEach(event => {
                        const eventCard = document.createElement('div');
                        eventCard.classList.add('event-card');

                        eventCard.innerHTML = `
                                <h3>${event.title}</h3>
                                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> ${event.time}</p>
                                <p><strong>Location:</strong> ${event.location}</p>
                                <p>${event.description}</p>
                                <button onclick="window.open('${event.cta.url}', '_blank')">${event.cta.text}</button>
                        `;
                        eventsContainer.appendChild(eventCard);
                });
        }
    } catch (error) {
        console.error("Error loading events:", error);
    }
}
