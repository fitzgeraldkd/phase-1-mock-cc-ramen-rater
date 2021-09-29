// write your code here

document.addEventListener('DOMContentLoaded', () => {
    sendRequest('/ramens', processRamens);
    document.getElementById('new-ramen').addEventListener('submit', addRamen);
    document.getElementById('edit-ramen').addEventListener('submit', updateRamen);
    document.getElementById('delete-ramen').addEventListener('submit', deleteRamen);
});

function processRamens(ramens) {
    const container = document.getElementById('ramen-menu');
    container.replaceChildren();
    ramens.forEach(renderRamen);
    showDetails(ramens[0]);
}

function renderRamen(ramen) {
    const container = document.getElementById('ramen-menu');
    const ramenImg = document.createElement('img');
    ramenImg.src = ramen.image;
    ramenImg.id = `thumbnail-${ramen.id}`;

    // GET the details each time
    const cbGetDetails = () => sendRequest(`/ramens/${ramen.id}`, showDetails);
    
    ramenImg.addEventListener('click', cbGetDetails);
    container.append(ramenImg);
}

function showDetails(ramen) {
    const ramenDetail = document.getElementById('ramen-detail');
    ramenDetail.querySelector('.detail-image').src = ramen.image;
    ramenDetail.querySelector('.name').textContent = ramen.name;
    ramenDetail.querySelector('.restaurant').textContent = ramen.restaurant;
    document.querySelector('#rating-display').textContent = ramen.rating;
    document.querySelector('#comment-display').textContent = ramen.comment;
    setActive(ramen);
}

function setActive(ramen) {
    ramenThumbnails = Array.from(document.querySelectorAll('#ramen-menu img'));
    ramenThumbnails.forEach((ramenThumbnail) => ramenThumbnail.className = '');
    document.getElementById(`thumbnail-${ramen.id}`).className = 'active';
}

function addRamen(e) {
    e.preventDefault();
    const form = e.target;

    const newRamen = {};
    newRamen.name = form.querySelector('#new-name').value;
    newRamen.restaurant = form.querySelector('#new-restaurant').value;
    newRamen.image = form.querySelector('#new-image').value;
    newRamen.rating = form.querySelector('#new-rating').value;
    newRamen.comment = form.querySelector('#new-comment').value;

    const endpoint = `/ramens`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRamen)
    }
    sendRequest(endpoint, renderRamen, options);

    form.reset();
}

function updateRamen(e) {
    e.preventDefault();
    const form = e.target;
    const ramenId = document.querySelector('#ramen-menu .active').id.slice(10);

    const endpoint = `/ramens/${ramenId}`;
    const body = {
        rating: form.querySelector('#updated-rating').value,
        comment: form.querySelector('#updated-comment').value
    }
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
    sendRequest(endpoint, showDetails, options);

    form.reset();
}

function deleteRamen(e) {
    e.preventDefault();
    const form = e.target;
    const activeRamen = document.querySelector('#ramen-menu .active');
    const ramenId = activeRamen.id.slice(10);

    const endpoint = `/ramens/${ramenId}`;
    const options = {method: 'DELETE'};
    sendRequest(endpoint, () => sendRequest('/ramens', processRamens), options);
}

function sendRequest(endpoint, callback, options={}) {
    const url = 'http://localhost:3000';
    fetch(url + endpoint, options).then(resp => resp.json()).then(callback);
}