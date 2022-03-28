const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard('No profile with this username');
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created');

    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
}

function createUserCard(user) {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : '';
  const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="profile-pic">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>
    `;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');

  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});

// recreate this in function above

/* <div class='card'>
  <div>
    <img
      src='https://randomuser.me/api/portraits/men/30.jpg'
      alt=''
      class='profile-pic'
    />
  </div>

  <div class='user-info'>
    <h2>johnwick</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet,
      voluptates?
    </p>
    <ul>
      <li>
        300 <strong>Followers</strong>
      </li>
      <li>
        30 <strong>Following</strong>
      </li>
      <li>
        3 <strong>Repos</strong>
      </li>
    </ul>

    <div id='repos'>
      <a href='#' class='repos'>
        Repo 1
      </a>
      <a href='#' class='repos'>
        Repo 2
      </a>
      <a href='#' class='repos'>
        Repo 3
      </a>
    </div>
  </div>
</div>; */
