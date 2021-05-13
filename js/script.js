const employees = document.getElementById('gallery');
const body = document.querySelector('body');
let results, names;
let r = [];

fetch('https://randomuser.me/api/?results=12')
 	.then(res => res.json())
 	.then(data => {
 		results = data.results;
 		results.forEach((n, i) => {
 			r[i] = n;
 		});
		names = results.map(result => result.name.first);
		console.log(results);
		displaySearch();
 		displayUsers(results);
 		
 	});


function displayUsers(data) {
	const users = data.map(user => `
		<div class='card'>
			<div class='card-img-container'>
				<img class='card-img'
				src='${user.picture.thumbnail}'
				alt='profile picture'>
			</div>
			<div class='card-info=container'>
				<h3 id='${user.name.first}' class='card-name cap'>${user.name.first} ${user.name.last}</h3>
				<p class='card-text'>${user.email}</p>
				<p class='card-text cap'>${user.location.city}, ${user.location.state}</p>
			</div>
		</div>
	`);

	users.forEach(user => employees.insertAdjacentHTML('beforeend', user));
}

function createModal() {
	const modal = `
		<div class='modal-container'>
			<div class='modal'>
				<button type='button' id='modal-close-btn'
				class='modal-close-btn'><strong>X</strong></button>
				<div class='modal-info-container'>
					<img class='modal-img'
					src=''
					alt='profile picture'>
					<h3 id='' class='modal-name cap'></h3>
					<p class='modal-text'></p>
					<p class='modal-text cap'></p>
					<hr>
					<p class='modal-text'></p>
					<p class='modal-text'>,
					, </p>
					<p class='modal-text'>Birthday: </p>
				</div>
			</div>
			<div class='modal-btn-container'>
				<button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
				<button type='button' id='modal-next' class='modal-next btn'>Next</button>
			</div>
		</div>
	`;
	employees.insertAdjacentHTML('afterend', modal);
	console.log(body.querySelector('.modal-container'));
}

function displaySearch() {
	const search = `
		<form action='#' method='get'>
			<input type='search' id='search-input'
			class='search-input' placeholder='Search...'>
			<input type='submit' value='&#x1F50D;'
			id='search-submit' class='search-submit'>
		</form>
	`;
	body.querySelector('.search-container').insertAdjacentHTML('beforeend', search);
}

function displayModal(user, index) {
	const u = user;
	const location = u.location;
	let cell = u.cell.replace(/\D/g, '');
	const cellLength = cell.length;
	cell = `${cell.substr(0, cell.length-10)} (${cell.substr(-10,3)}) ${cell.substr(-7,3)}-${cell.substr(-4)}`;
	const date = u.dob.date;
	const dob = `${date.substr(5,2)}/${date.substr(8,2)}/${date.substr(0,4)}`;

	const modal = `
		<div class='modal-container'>
			<div class='modal'>
				<button type='button' id='modal-close-btn'
				class='modal-close-btn'><strong>X</strong></button>
				<div class='modal-info-container'>
					<img class='modal-img'
					src='${u.picture.thumbnail}'
					alt='profile picture'>
					<h3 id='${u.name.first}' class='modal-name cap'>${u.name.first}</h3>
					<p class='modal-text'>${u.email}</p>
					<p class='modal-text cap'>${location.city}</p>
					<hr>
					<p class='modal-text'>${cell}</p>
					<p class='modal-text'>${location.street.number} ${location.street.name},
					${location.city}, ${location.state} ${location.postcode} </p>
					<p class='modal-text'>Birthday: ${dob}</p>
				</div>
			</div>
			<div class='modal-btn-container'>
				<button type='button' id='modal-prev' class='modal-prev btn'>Prev</button>
				<button type='button' id='modal-next' class='modal-next btn'>Next</button>
			</div>
		</div>
	`;
	employees.insertAdjacentHTML('afterend', modal);

	// body.querySelector('.modal-container').style.visibility = 'visible';
	// body.querySelector('img.modal-img').src = u.picture.thumbnail;
	// // console.log(body.querySelector('.modal-name'));
	// body.querySelector('h3.modal-name').id = u.name.first;
	// body.querySelector('p.modal-text').textContent = u.email;
	// body.querySelector('p.modal-text').nextElementSibling.textContent = location.city;
	// body.querySelector('hr').nextElementSibling.textContent = cell;
	
	console.log(body.querySelector('.modal-container'));

	console.log(r);
	console.log(index);
	if(index === 0) { 
		body.querySelector('#modal-prev').disabled = true;
	} else if (index === results.length--) {
		body.querySelector('#modal-next').disabled = true;
	}
	// checkIndex(names.indexOf(user.name.first));
}

function checkIndex(index) {
	if(index === 0) { 
		body.querySelector('#modal-prev').disabled = true;
	} else if (index === results.length--) {
		body.querySelector('#modal-next').disabled = true;
	}
}

function toggleUser(direction, user) {
	// employees.nextElementSibling.remove();
	console.log(employees.nextElementSibling);

	let index = names.indexOf(user);
	if(direction === 'Prev') {
		index--;
	} else {
		index++;
	}

	const u = r[index];
	if(index >= 0 && index < results.length) {
		displayModal(u, index);
		// checkIndex(index);
	}
}


body.addEventListener('click', event => {
	let e = event.target;
	let modal = body.querySelector('.modal-container');
	
	// if(modal === null) { 
	// 	createModal();
	// 	console.log(body.querySelector('.modal-container'));
	// 	modal = body.querySelector('.modal-container');
	// 	body.querySelector('.modal-container').style.visibility = 'hidden';
	// }
	// console.log(modal);
	// console.log(employees);

	if(modal) {
		if(body.querySelector('.modal-close-btn').contains(e)) { modal.remove(); }
		else if(e.parentNode.className === 'modal-btn-container') {
			modal.remove();
			toggleUser(e.textContent, e.parentNode.parentNode.querySelector('h3').id);
		}
	} else if((e.parentNode !== body) || employees.contains(e)) {
		// console.log(e.parentNode);
		while(e.className !== 'card') {
			e = e.parentNode;
		}
		const index = names.indexOf(e.querySelector('h3').id);
		// console.log('hey');
		displayModal(r[index], index);
	}
});