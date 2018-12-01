$(function () {
    var container = $('#container');
    var userNameWrap = $('#username');
    var profileModal = $('#profile-modal');
    var inpFirstName = $('#inp-first-name');
    var inpLastName = $('#inp-last-name');
    var btnSendProfile = $('#btn-send-profile');
    var btnEditProfile = $('#btn-edit-profile');

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

    var handleError = function (error) {
        console.info(error);
    };

    container.hide();

    addProfile()
        .then(profileModal.modal('show'))
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
                .then(container.show())
                .then(clearProfileForm)
                .catch(handleError);
        } else {
            alert('All fields required!');
        }
    });

    btnEditProfile.on('click', function () {
        profileModal.modal('show');
    })

});