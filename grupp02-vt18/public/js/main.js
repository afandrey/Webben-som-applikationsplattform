let socket = io()

window.addEventListener('load', function () { // when page loads
    let lightbox = this.document.getElementById('light')
    lightbox.addEventListener('change', function () { // add event listener for when checkbox changes
        socket.emit('light', Number(this.checked)) // send button status to server (as 1 or 0)
    })
})

socket.on('light', function (data) { // get button status from client
    document.getElementById('light').checked = data // change checkbox according to push button on Raspberry Pi
    socket.emit('light', data) // send push button status back to server
})