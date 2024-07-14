document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const searchInput = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const repoList = document.getElementById("repos-list");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      searchUsers(query);
    }
  });

  function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(response => response.json())
      .then(data => displayUsers(data.items))
      .catch(error => console.error("Error fetching users:", error));
  }

  function displayUsers(users) {
    userList.innerHTML = ""; // Clear previous results
    repoList.innerHTML = ""; // Clear previous repositories

    users.forEach(user => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
        <a href="${user.html_url}" target="_blank">${user.login}</a>
        <button data-username="${user.login}">Show Repos</button>
      `;
      userList.appendChild(li);
    });

    // Add event listeners to the "Show Repos" buttons
    const buttons = document.querySelectorAll("button[data-username]");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        const username = button.getAttribute("data-username");
        fetchRepos(username);
      });
    });
  }

  function fetchRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(data => displayRepos(data))
      .catch(error => console.error("Error fetching repos:", error));
  }

  function displayRepos(repos) {
    repoList.innerHTML = ""; // Clear previous repositories

    repos.forEach(repo => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
      repoList.appendChild(li);
    });
  }
});
