document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('projectList');
  const username = 'SmitedReal';
  const apiURL = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

  fetch(apiURL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
      return res.json();
    })
    .then(repos => {
      projectList.innerHTML = ''; // clear placeholder

      repos.forEach(repo => {
        const { name, description, html_url, archived, stargazers_count, forks_count } = repo;

        const archivedIcon = archived
          ? `<span class="archived-icon" title="Archived Repository">⬛</span>`
          : '';

        const card = document.createElement('div');
        card.className = 'project';
        card.innerHTML = `
          <h3>${name} ${archivedIcon}</h3>
          <div class="project-details">
            <p>${description || 'No description available'}</p>
            <p>⭐ Stars: ${stargazers_count}</p>
            <p>🔱 Forks: ${forks_count}</p>
            <a href="${html_url}" target="_blank">🔗 View on GitHub</a>
          </div>
        `;

        card.addEventListener('click', () => card.classList.toggle('open'));
        projectList.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Failed to load GitHub repos:', err);
      projectList.innerHTML = '<p>Error loading project data. Please try again later.</p>';
    });
});

const navButtons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('section');

function showTab(tabId) {
  const target = document.getElementById(tabId);
  if (!target) return;

  sections.forEach(s => s.style.display = 'none');
  target.style.display = 'block';

  history.replaceState(null, '', `#${tabId}`);

  navButtons.forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`nav button[onclick="showTab('${tabId}')"]`);
  if (btn) btn.classList.add('active');
}

window.addEventListener('load', () => {
  const hash = location.hash.substring(1);
  if (hash) {
    showTab(hash);
  } else {
    showTab('about');
  }
});

window.addEventListener('hashchange', () => {
  const hash = location.hash.substring(1);
  if (hash) showTab(hash);
});


