document.addEventListener('DOMContentLoaded', () => {
  displayCurrentPage();
  loadCards();
  displayVisitMessage();
  document.getElementById('year').textContent = new Date().getFullYear();
});

async function loadCards() {
  const response = await fetch('data/discover.json');
  const data = await response.json();
  const container = document.getElementById('discoverGrid');

  data.forEach((item, index) => {
    const card = document.createElement('section');
    card.classList.add('card');
    card.style.gridArea = `card${index + 1}`;
    card.innerHTML = `
      <h2>${item.title}</h2>
      <figure>
        <img src="${item.image}" alt="${item.alt}" loading="lazy">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button onclick="window.open('${item.url}', '_blank')">Learn More</button>
    `;
    container.appendChild(card);
  });
}

function displayVisitMessage() {
  const messageContainer = document.getElementById('visitorMessage');
  const now = Date.now();
  const lastVisit = localStorage.getItem('lastVisit');
  let message = "Welcome! Let us know if you have any questions.";

  if (lastVisit) {
    const days = Math.floor((now - Number(lastVisit)) / (1000 * 60 * 60 * 24));
    if (days === 0) {
      message = "Back so soon! Awesome!";
    } else if (days === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${days} days ago.`;
    }
  }

  localStorage.setItem('lastVisit', now);
  messageContainer.textContent = message;
}
function displayCurrentPage() {
  const header = document.querySelector('header');
  const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
  const formattedPageName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  // Add the current page name for mobile-only display
  const pageNewElement = document.createElement('div');
  pageNewElement.className = 'current-page-name mobile-only';
  pageNewElement.textContent = formattedPageName === 'Index' ? 'Home' : formattedPageName;

  header.insertBefore(pageNewElement, header.querySelector('nav'));

  // Add the active class to the corresponding navigation link
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href').replace('.html', '');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index')) {
      link.classList.add('active');
    }
  });
}

async function loadEvents() {
  try {
    const response = await fetch('data/events.json');
    const data = await response.json();
    const eventsContainer = document.getElementById('events-container');

    data.events.forEach(event => {
      const card = document.createElement('div');
      card.classList.add('event-card');

      card.innerHTML = `
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
        <button onclick="window.open('${event.cta.url}', '_blank')">${event.cta.text}</button>
      `;

      eventsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading events:', error);
  }
  
  function displayVisitMessage() {
    const messageContainer = document.getElementById('visitorMessage');
    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    let message = "Welcome! Let us know if you have any questions.";
  
    if (lastVisit) {
      const days = Math.floor((now - Number(lastVisit)) / (1000 * 60 * 60 * 24));
      if (days === 0) {
        message = "Back so soon! Awesome!";
      } else if (days === 1) {
        message = "You last visited 1 day ago.";
      } else {
        message = `You last visited ${days} days ago.`;
      }
    }
  
    localStorage.setItem('lastVisit', now);
    messageContainer.textContent = message;
  }

  async function loadEvents() {
    try {
      const response = await fetch('data/event.json');
      const data = await response.json();
      const eventsContainer = document.getElementById('events-container');

      data.events.forEach(event => {
        const card = document.createElement('div');
        card.classList.add('event-card');

        card.innerHTML = `
          <h3>${event.title}</h3>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <address><strong>Location:</strong> ${event.location}</address>
          <p>${event.description}</p>
          <button>${event.cta}</button>
        `;

        eventsContainer.appendChild(card);
      });
    } catch (error) {
      console.error('Error loading events:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', loadEvents);
