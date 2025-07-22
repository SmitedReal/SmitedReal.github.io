// script.js

document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('projectList');

  // Fetch the pre‐baked repos.json from your GitHub Pages site
  fetch('/repos.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
      return res.json();
    })
    .then(repos => {
      repos.forEach(repo => {
        // Destructure the fields baked into repos.json by your GitHub Action
        const {
          name,
          description,
          html_url,
          archived,
          stargazers_count,
          forks_count,
          commit_count,
          release_count,
          latest_release,
          latest_tag,
          has_readme
        } = repo;

        // Build the archived icon if needed
        const archivedIcon = archived
          ? `<span class="archived-icon" title="Archived Repository">
              <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                      d="M12.5 2h-9C2.67 2 2 2.67 2 3.5v1C2 5.33 2.67 6 3.5 6h9c.83 0
                         1.5-.67 1.5-1.5v-1C14 2.67 13.33 2 12.5 2zM14 9H2v5c0
                         .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67
                         1.5-1.5V9z">
                </path>
              </svg>
            </span>`
          : '';

        // Create project card
        const card = document.createElement('div');
        card.className = 'project';
        card.innerHTML = `
          <h3>${name}${archivedIcon}</h3>
          <div class="project-details">
            <p>${description || 'No description available'}</p>
            <p><strong>📦 Archived:</strong> ${archived ? 'Yes' : 'No'}</p>
            <p><strong>📘 Has README:</strong> ${has_readme ? 'Yes' : 'No'}</p>
            <p><strong>📊 Commits:</strong> ${commit_count ?? 'N/A'}</p>
            <p><strong>🚀 Releases:</strong> ${release_count ?? '0'}</p>
            <p><strong>🗓️ Latest Release:</strong> ${latest_release || 'None'}</p>
            <p><strong>🏷️ Latest Tag:</strong> ${latest_tag || 'None'}</p>
            <p><strong>⭐ Stars:</strong> ${stargazers_count}</p>
            <p><strong>🔱 Forks:</strong> ${forks_count}</p>
            <a href="${html_url}" target="_blank">🔗 View on GitHub</a>
          </div>
        `;

        // Toggle dropdown on click
        card.addEventListener('click', () => {
          card.classList.toggle('open');
        });

        projectList.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Failed to load repos.json:', err);
      projectList.innerHTML = '<p>Error loading project data. Please try again later.</p>';
    });
});

// Tab navigation
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';
}