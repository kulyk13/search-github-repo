let searchField = document.getElementById('searchInput');
let searchBtn = document.getElementById('searchBtn');
let cardListEl = document.getElementById('cardList');
let searchValue;
let DATA;


async function getData(login) {
    return await fetch(`https://api.github.com/users/${login}`)
        .then(res => res.json())
        .then(res => {
            DATA = res;
        })
}

searchBtn.addEventListener('click', e => {
    if (searchField.value !== '') {
        searchValue = searchField.value.trim();
        getData(searchValue);
        renderCard(DATA, cardListEl)
        console.log(DATA.name)
        searchField.value = '';
    }
})


function renderCard(data, element) {
    let html = '';
    html += createCard(data)
    element.insertAdjacentHTML('beforeEnd', html)
}

function createCard(repo_data) {
    return `
        <div class="card col-6" style="width: 18rem;">
            <img src="/" class="card-img-top" alt="User image">
            <div class="card-body">
                <h5 class="card-title">l,as</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    `
}

