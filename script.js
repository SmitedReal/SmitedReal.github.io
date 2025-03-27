document.addEventListener('DOMContentLoaded', () => {
  const projectList = document.getElementById('projectList');
  const seenRepos = new Set();

  // Fetch GitHub repositories for user "SmitedReal"
  fetch('https://api.github.com/users/SmitedReal/repos?per_page=100')
    .then(response => response.json())
    .then(repos => {
      repos.forEach(repo => {
        // Prevent duplicate entries and exclude "SmitedReal.github.io"
        if (!seenRepos.has(repo.name) && repo.name !== "SmitedReal.github.io") {
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

document.addEventListener('DOMContentLoaded', () => {
  const createFrameBtn = document.getElementById('createFrameBtn');

  // Add event listener to the "Create Frame" button
  createFrameBtn.addEventListener('click', () => {
    spawnWindow(50, 50); // Spawn a new window at position (50, 50)
  });
});

function spawnWindow(left, top) {
  const win = document.createElement('div');
  win.className = 'floating-window';
  win.style.left = left + 'px';
  win.style.top = top + 'px';
  win.innerHTML = `
    <div class="floating-header">Drag me!</div>
    <p>This window is slippery</p>
  `;
  document.body.appendChild(win);

  // Make it draggable with inertia (friction effect)
  makeDraggable(win);
}

function makeDraggable(element) {
  const header = element.querySelector('.floating-header');
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let velocityX = 0;
  let velocityY = 0;
  const friction = 0.92; // Friction coefficient: closer to 1 = less friction (more ice-like)
  const minVelocity = 0.05; // Threshold to stop inertia
  let inertiaAnimationId;

  // Set cursor style for better UX
  header.style.cursor = 'move';

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    cancelAnimationFrame(inertiaAnimationId);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;
    const currentMouseX = e.clientX;
    const currentMouseY = e.clientY;
    const deltaX = currentMouseX - lastMouseX;
    const deltaY = currentMouseY - lastMouseY;

    const currentLeft = parseInt(element.style.left, 10);
    const currentTop = parseInt(element.style.top, 10);
    element.style.left = currentLeft + deltaX + 'px';
    element.style.top = currentTop + deltaY + 'px';

    // Save the current movement as velocity for inertia
    velocityX = deltaX * 1.5; // Scale velocity for a more pronounced sliding effect
    velocityY = deltaY * 1.5;

    lastMouseX = currentMouseX;
    lastMouseY = currentMouseY;
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    inertiaAnimationId = requestAnimationFrame(inertiaStep);
  }

  function inertiaStep() {
    // Apply friction to gradually slow down the movement
    velocityX *= friction;
    velocityY *= friction;

    // Stop animation if movement is negligible
    if (Math.abs(velocityX) < minVelocity && Math.abs(velocityY) < minVelocity) {
      velocityX = 0;
      velocityY = 0;
      return;
    }

    const currentLeft = parseInt(element.style.left, 10);
    const currentTop = parseInt(element.style.top, 10);

    // Calculate new position
    let newLeft = currentLeft + velocityX;
    let newTop = currentTop + velocityY;

    // Boundary checking to keep the window within the screen
    const maxX = window.innerWidth - element.offsetWidth;
    const maxY = window.innerHeight - element.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxX));
    newTop = Math.max(0, Math.min(newTop, maxY));

    // Apply new position
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';

    // Bounce effect when hitting the edges
    if (newLeft <= 0 || newLeft >= maxX) {
      velocityX *= -0.8; // Reverse direction and lose some energy
    }
    if (newTop <= 0 || newTop >= maxY) {
      velocityY *= -0.8; // Reverse direction and lose some energy
    }

    inertiaAnimationId = requestAnimationFrame(inertiaStep);
  }
}