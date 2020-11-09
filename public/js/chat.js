// client
const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');

const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, { 
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm:ss a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, { location });
    $messages.insertAdjacentHTML('beforeend', html);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    socket.emit('message', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error) {
            return alert(error);
        }
        console.log('Message Delivered.');
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return  alert('Geolocation is not supported by your browser.');
    };

    $sendLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((postition) => {
        socket.emit('sendLocation', {
            lat: postition.coords.latitude,
            long: postition.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log("Location Shared!");
        });
    });
});