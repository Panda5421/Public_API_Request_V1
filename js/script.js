//variables to be used later
const employees = document.getElementById('gallery');
const body = document.querySelector('body');
let results, names, list;

//fetching data on 12 users from the us, defining variables, 
//and displaying search bar and users
fetch('https://randomuser.me/api/?results=12&nat=us')
 	.then(res => res.json())
 	.then(data => {
 		results = data.results;
		names = results.map(result => result.name.first);
		addSearch();
 		displayUsers(results);
 	});
//displays users based on template
function displayUsers(data) {
	list = data;
	names = data.map(user => user.name.first);
	const users = data.map(user => `
		<div class='card'>
			<div class='card-img-container'>
				<img class='card-img'
				src='${user.picture.thumbnail}'
				alt='profile picture'>
			</div>
			<div class='card-info-container'>
				<h3 id='${user.name.first}' class='card-name cap'>${user.name.first} ${user.name.last}</h3>
				<p class='card-text'>${user.email}</p>
				<p class='card-text cap'>${user.location.city}, ${user.location.state}</p>
			</div>
		</div>
	`);

	users.forEach(user => employees.insertAdjacentHTML('beforeend', user));
}

//displays modal window
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
					<h3 id='${u.name.first}' class='modal-name cap'>${u.name.first} ${u.name.last}</h3>
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

	//checking index of user to determine whether prev or next button needs to be disabled
	checkIndex(names.indexOf(user.name.first));
}

//adds search bar and functionality to DOM
function addSearch() {
	const searchBar = `
		<form action='#' method='get'>
			<input type='search' id='search-input'
			class='search-input' placeholder='Search...'>
			<input type='submit' value='&#x1F50D;'
			id='search-submit' class='search-submit'>
		</form>
	`;

	const bar = body.querySelector('.search-container');
	bar.insertAdjacentHTML('beforeend', searchBar);

	//creates list of employees who's names match what's in the search bar
	//and displays them, or an error msg if none match
	function search() {
		const input = body.querySelector('input').value;
		if(input !== '') {
			let emp = [];
			for(let i=0; i<results.length; i++) {
				let e = `${results[i].name.first} ${results[i].name.last}`;
				if(e.toLowerCase().includes(input.toLowerCase())) {
					emp.push(results[i]);
				}
			}
			if(emp.length === 0) {
				employees.innerHTML = 'No results found';
				list = results;
			} else {
				employees.innerHTML = '';
				list = emp;
				displayUsers(emp);
			}
		} else {
			employees.innerHTML = '';
			displayUsers(results);
		}
	}

	//event listeners run search function for every keyup or click on the submit button
	bar.addEventListener('click', e => {
		if(e.target.id === 'search-submit') { search() }
	});
	bar.addEventListener('keyup', search);
}

//toggles to other users' modal windows
function toggleUser(direction, user) {
	names = list.map(l => l.name.first);
	let index = names.indexOf(user);
	direction === 'Prev' ? index-- : index++;

	const u = list[index];
	if(index >= 0 && index < list.length) {
		displayModal(u, index);
		checkIndex(index);
	}
}

//helper function that determines whether current user at beginning
//or end of list and disables appropriate button
function checkIndex(index) {
	if(index === 0) { 
		body.querySelector('#modal-prev').disabled = true;
	} 

	if (index === list.length-1) {
		body.querySelector('#modal-next').disabled = true;
	}
}

//event listener that listens for clicks within body
body.addEventListener('click', event => {
	let e = event.target;
	let modal = body.querySelector('.modal-container');

	//if the modal container exists on the DOM,
	//it'll either remove the modal window or toggle the user
	if(modal) {
		if(body.querySelector('.modal-close-btn').contains(e)) { modal.remove() }
		else if(e.parentNode.className === 'modal-btn-container') {
			modal.remove();
			toggleUser(e.textContent, e.parentNode.parentNode.querySelector('h3').id);
		}
	//else if the target clicked was within one of the employee cards,
	//it'll display a modal window w said employee's info
	} else if(e !== employees && employees.contains(e)) {
		while(e.className !== 'card') {
			e = e.parentNode;
		}
		const index = names.indexOf(e.querySelector('h3').id);
		displayModal(list[index], index);
	}
});