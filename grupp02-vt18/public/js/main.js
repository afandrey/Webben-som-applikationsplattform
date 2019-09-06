let socket = io();

let alarmBtn = document.getElementById('alarmBtn');
alarmBtn.addEventListener('change', function() { // add event listener for when alarmBtn checkbox changes
	socket.emit('alarmBtn', Number(this.checked)); // send button status to server as 0 (off) or 1 (on)
});

socket.on('alarmBtn', function(data) { // get button status from client
    document.getElementById('alarmBtn').checked = data; // change checkbox according to push button on Raspberry Pi
    socket.emit('alarmBtn', data); // send push button status back to server
});

// send the text to UI if the alarm went off
socket.on('alarmText', function (data) {
	console.log(data);
	let h3 = document.getElementById('alarmText');
	let message = document.createTextNode('Intruder alert!');
	let child = h3.childNodes[0];

	if (data === 1) {
		h3.appendChild(message);
	} else if (data === 0) {
		h3.removeChild(child);
	}
});