$(function () {
    var container = $('#container');
    var userNameWrap = $('#username');
    var profileModal = $('#profile-modal');
    var inpFirstName = $('#inp-first-name');
    var inpLastName = $('#inp-last-name');
    var btnSendProfile = $('#btn-send-profile');
    var btnEditProfile = $('#btn-edit-profile');
    var btnSendMessage = $('#btn-send-message');
    var inpMessage = $('#inp-message');
    var messagesWrap = $('#messages');

    var baseUrl = 'http://146.185.154.90:8000/blog/mkubibaev@gmail.com/';

    var addProfile = function () {
        return $.ajax({
            method: 'GET',
            url: baseUrl + 'profile'
        });
    };

    var editProfile = function (profile) {
        return $.ajax({
            method: 'POST',
            data: profile,
            url: baseUrl + 'profile'
        });
    };

    var getProfile = function () {
        return $.ajax({
            method: 'GET',
            url: baseUrl + 'profile'
        });
    };

    var showProfile = function (profile) {
        userNameWrap.text(profile.firstName + ' ' + profile.lastName);
        console.log(profile);
    };

    var clearProfileForm = function () {
        inpFirstName.val('');
        inpLastName.val('');
    };

    var getMessages = function () {
        return $.ajax ({
            method: 'GET',
            url: baseUrl + 'posts'
        });
    };

    var sendMessage = function (message) {
        return $.ajax ({
            method: 'POST',
            url: baseUrl + 'posts',
            data: message,
        });
    };

    var showMessages = function (messages) {
        messages.forEach(function (message) {
            var card = $('<div class="card bg-light mb-2 p-3">');
            var cardTitle = $('<span class="card-subtitle mb-2 text-muted">');
            var cardText = $('<p class="card-text">');

            cardTitle.text(message.user.firstName + ' ' + message.user.lastName + ' said:');
            cardText.text(message.message);
            card.append(cardTitle, cardText);
            messagesWrap.prepend(card);
        });
    };

    var handleError = function (error) {
        console.info(error);
    };

    addProfile()
        .then(getProfile)
        .then(showProfile)
        .catch(handleError);

    getMessages()
        .then(showMessages)
        .catch(handleError);

    btnSendProfile.on('click', function () {
        if (inpFirstName.val() && inpLastName.val()) {
            var profile = {};

            profile.firstName = inpFirstName.val();
            profile.lastName = inpLastName.val();

            editProfile(profile)
                .then(getProfile)
                .then(profileModal.modal('hide'))
                .then(showProfile)
                .then(clearProfileForm)
                .catch(handleError);
        } else {
            alert('All fields required!');
        }
    });

    btnEditProfile.on('click', function () {
        profileModal.modal('show');
    });

    btnSendMessage.on('click', function (event) {
        event.preventDefault();
        if (inpMessage.val()) {
            var newMessage = {};

            newMessage.message = inpMessage.val();

            sendMessage(newMessage)
                .then(inpMessage.val(''))
                .catch(handleError);

        } else {
            alert('Enter message!');
        }
    });

});