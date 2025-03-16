document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('projectList');
  const seenRepos = new Set();

  // Fetch GitHub repositories for user "SmitedReal"
  fetch('https://api.github.com/users/SmitedReal/repos?per_page=100')
    .then(response => response.json())
    .then(repos => {
      repos.forEach(repo => {
        // Prevent duplicate entries
        if (!seenRepos.has(repo.name)) {
          seenRepos.add(repo.name);

          const repoName = repo.name;
          const repoDescription = repo.description ? repo.description : 'No description available';
          const repoWebsite = `https://github.com/SmitedReal/${repoName}`;

          // If the repo is archived, add an archived icon (inline SVG)
          const archivedIcon = repo.archived
            ? `<span class="archived-icon" title="Archived Repository">
                 <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16" aria-hidden="true">
                   <path fill-rule="evenodd" d="M12.5 2h-9C2.67 2 2 2.67 2 3.5v1C2 5.33 2.67 6 3.5 6h9c.83 0 1.5-.67 1.5-1.5v-1C14 2.67 13.33 2 12.5 2zM14 9H2v5c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V9z"></path>
                 </svg>
               </span>`
            : '';

          // Create a new project element
          const projectCard = document.createElement('div');
          projectCard.classList.add('project');
          projectCard.innerHTML = `
            <h3>${repoName}${archivedIcon}</h3>
            <p>${repoDescription}</p>
            <a href="${repoWebsite}" target="_blank">${repoWebsite}</a>
          `;
          projectList.appendChild(projectCard);
        }
      });
    })
    .catch(error => console.error('Error fetching GitHub repos:', error));
});