let searchFormEl = document.getElementById('searchForm')
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

if (window.location.pathname.includes('/wishlist.html')) {
    let wishRepo = wishListLS.reduce((acc, curr) => {
        return [...acc, recentListLS.find(repo => repo.login === curr)]
    }, [])
    renderCard(wishRepo, cardListEl)
}

let DATA = [] //(recentListLS === []) ? [] : [...recentListLS];
renderCard(DATA, cardListEl);

async function getData(login, addRecent) {
    return await fetch(`https://api.github.com/users/${login}`)
        .then(res => res.json())
        .then(res => {
            DATA.unshift(res);
            if (addRecent) {
                renderCard(DATA, cardListEl, true);
            } else {
                renderCard(DATA, cardListEl, false);
            }
        })
}

searchFormEl && searchFormEl.addEventListener('submit', event => {
    event.preventDefault()
    if (searchField.value !== '') {
        searchValue = searchField.value.trim();
        getData(searchValue, true);
        searchField.value = '';
    }
    searchBtn.blur();
})

searchFormEl && searchFormEl.addEventListener('input', event => {
    event.preventDefault()
    searchValue = searchField.value.trim();
    getData(searchValue, false);
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
        if (window.location.pathname.includes('/wishlist.html')) {
            let wishRepo = wishListLS.reduce((acc, curr) => {
                return [...acc, recentListLS.find(repo => repo.login === curr)]
            }, [])
            renderCard(wishRepo, cardListEl)
        }
    }
});

function renderCard(data, element, addRecent) {
    let html = '';
    if (data.length > 0) {
        data.forEach(elem => {
            if (addRecent) {
                recentListLS.unshift(elem);
            }
            localStorage.recentList = JSON.stringify(recentListLS);
            html += createCard(elem);
            element.innerHTML = html;
        })
    } else {
        html = `<h2 class="ms-2">There are no results...</h2>`;
        // element.innerHTML = html;
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
                    ${repo_data.name ?? 'Name is missing'}&nbsp;
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
                  <button type="button" class="save-star btn btn-secondary  ${wishListLS.includes(repo_data.login) ? 'text-warning' : ''}">
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

