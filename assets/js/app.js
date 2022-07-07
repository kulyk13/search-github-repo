let searchField = document.getElementById('searchInput');
let searchBtn = document.getElementById('searchBtn');
let cardListEl = document.getElementById('cardList');
let searchValue;

if (!localStorage.recentList) {
    localStorage.recentList = JSON.stringify([])
}

const recentListLS = JSON.parse(localStorage.recentList);

if (!localStorage.wishList) {
    localStorage.wishList = JSON.stringify([])
}
const wishListLS = JSON.parse(localStorage.wishList);

let DATA = (recentListLS === []) ? [] : [...recentListLS];
renderCard(DATA, cardListEl);

async function getData(login) {
    return await fetch(`https://api.github.com/users/${login}`)
        .then(res => res.json())
        .then(res => {
            DATA.unshift(res);
            renderCard(DATA, cardListEl);
        })
}

searchBtn.addEventListener('click', event => {
    if (searchField.value !== '') {
        searchValue = searchField.value.trim();
        getData(searchValue);
        searchField.value = '';
    }
})

cardListEl && cardListEl.addEventListener('click', event => {
    const btnEl = event.target.closest('.save-star');
    if (btnEl) {
        const id = btnEl.closest('.card').dataset.id;
        if (!wishListLS.includes(id)) {
            wishListLS.push(id);
            btnEl.classList.add('text-warning');
        } else{
            wishListLS.splice(wishListLS.indexOf(id),1);
            btnEl.classList.remove('text-warning');
        }
        localStorage.wishList = JSON.stringify(wishListLS);
        btnEl.blur();
    }
});

function renderCard(data, element) {
    let html = '';
    for (el of data) {
        recentListLS.unshift(el);
        html += createCard(el);
        element.innerHTML = html;
        console.log(el)
        localStorage.recentList = JSON.stringify(recentListLS);
    }
}

function createCard(repo_data) {
    return `
        <div class="col card mb-3" data-id="${repo_data.login}">
          <div class="row g-0">
            <div class="col-4 card-img-wrap">
              <a href="${repo_data.html_url}" class="w-100" target="_blank">
                <img class="card-img" width="1" height="1" loading="lazy" src="${repo_data.avatar_url}" alt="${repo_data.name}'s avatar image">
              </a>
            </div>
            <div class="col-8 card-body-wrap">
              <div class="card-body">
                <a href="${repo_data.html_url}" class="card-title mb-3" target="_blank">
                    ${repo_data.name}&nbsp;
                    <span> • </span>
                    &nbsp;${repo_data.login}
                </a>
                <div class="card-info mt-4">
                  <div class="card-descripition">
                    ${repo_data.bio ?? ''}
                  </div>
                  <ul class="card-info__list mt-4">
                    <li class="card-ifo__list-item">
                        Followers: ${repo_data.followers}
                    </li>
                    <li class="card-ifo__list-item mt-2">
                        Following: ${repo_data.following}                        
                    </li>
                    <li class="card-ifo__list-item mt-2">
                        Public repositories: ${repo_data.public_repos}                        
                    </li>
                  </ul>                  
                  <div class="contact-block mt-4">
                    <a href="${repo_data.html_url}?tab=repositories" class="card-btn btn btn-primary" target="_blank">
                      Go to repositories
                    </a>
                  </div>
                  <button type="button" class="save-star btn btn-secondary  ${wishListLS.includes(repo_data.id) ? 'text-warning' : ''}">
                    <i class="icon-star-full"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12 card-footer">
              <small class="text-muted">
                Created: ${new Date(repo_data.created_at).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
    `
}

