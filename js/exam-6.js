$(function () {
    var userNameWrap = $('#username');
    var profileModal = $('#profile-modal');
    var subscribeModal = $('#subscribe-modal');
    var inpFirstName = $('#inp-first-name');
    var inpLastName = $('#inp-last-name');
    var btnSendProfile = $('#btn-send-profile');
    var btnEditProfile = $('#btn-edit-profile');
    var btnFollow = $('#btn-follow');
    var inpFollow = $('#inp-follow');
    var btnFollowAdd = $('#btn-follow-add');
    var inpPost = $('#inp-post');
    var btnSendPost = $('#btn-send-post');
    var postsWrap = $('#posts');

    var baseUrl = 'http://146.185.154.90:8000/blog/mkubibaev@gmail.com/';
    var postsUrl = baseUrl + 'posts';
    var postsByDateUrl = postsUrl + '?datetime=';
    var subscribeUrl = baseUrl + 'subscribe';
    var lastPostDate = '';

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
    };

    var getPosts = function (url) {
        return $.ajax ({
            method: 'GET',
            url: url
        });
    };

    var sendPost = function (post) {
        return $.ajax ({
            method: 'POST',
            url: postsUrl,
            data: post,
        });
    };

    var showPosts = function (posts) {
        posts.forEach(function (post) {
            var card = $('<div class="card bg-light mb-3 p-3">');
            var cardTitle = $('<span class="card-subtitle text-muted">');
            var cardText = $('<p class="card-text mb-0">');
            var cardFooter = $('<small class="text-right text-muted">');

            var postDate = new Date(post.datetime);
            var formatedDate = postDate.getHours() + ':' + postDate.getMinutes() + ' ' +
                postDate.getDay() + '.' + postDate.getMonth() + '.' + postDate.getFullYear();

            cardTitle.text(post.user.firstName + ' ' + post.user.lastName + ' said:');
            cardText.text(post.message);
            cardFooter.text(formatedDate);
            card.append(cardTitle, cardText, cardFooter);
            postsWrap.prepend(card);
        });
        return posts; //передаю дальше в setDate
    };

    var setDate = function (posts) {
        var lastIndex = posts.length - 1;

        lastPostDate = posts[lastIndex].datetime;
    };

    var watching = function () {
        setInterval(function () {
            getPosts(postsByDateUrl + lastPostDate)
                .then(updateList)
                .catch(handleError);
        }, 2000);
    };

    var updateList = function(newPosts) {
        if (newPosts.length > 0) {
            showPosts(newPosts);
            setDate(newPosts);
        }
    };

    var subscribe = function (userEmail) {
        return $.ajax({
            method: 'POST',
            url: subscribeUrl,
            data: userEmail
        });
    };

    var showSubscribeResult = function (result) {
        console.log(result);

        //при ошибке возвращатеся объект с ключом error
        for (var key in result) {
            if (key === 'error') {
                alert(result.error);
                return false;
            }
        }
        alert('You subscribed!');
    };

    var handleError = function (error) {
        console.log(error);
    };

    addProfile()
        .then(getProfile)
        .then(showProfile)
        .catch(handleError);

    getPosts(postsUrl)
        .then(showPosts)
        .then(setDate)
        .then(watching)
        .catch(handleError);

    btnEditProfile.on('click', function () {
        profileModal.modal('show');
    });

    btnSendProfile.on('click', function () {
        if (inpFirstName.val() && inpLastName.val()) {
            var profile = {};

            profile.firstName = inpFirstName.val();
            profile.lastName = inpLastName.val();

            editProfile(profile)
                .then(getProfile)
                .then(showProfile)
                .catch(handleError);

            profileModal.modal('hide');
            inpFirstName.val('');
            inpLastName.val('');

            /* Вывожу весь список заново с новым profile, иначе новый profile виден только в новых сообщениях.
            Но у других пользователей остается старый, надо ли... */
            getPosts(postsUrl)
                .then(postsWrap.html(''))
                .then(showPosts)
                .catch(handleError);
        } else {
            alert('All fields required!');
        }
    });

    btnSendPost.on('click', function (event) {
        event.preventDefault();
        if (inpPost.val()) {
            var newPost = {};

            newPost.message = inpPost.val();

            sendPost(newPost)
                .then(inpPost.val(''))
                .catch(handleError);

        } else {
            alert('Enter post text!');
        }
    });

    btnFollow.on('click', function () {
        subscribeModal.modal('show');
    });

    btnFollowAdd.on('click', function () {
        if (inpFollow.val()) {
            var followUser = {};

            followUser.email = inpFollow.val();

            subscribe(followUser)
                .then(showSubscribeResult);

            subscribeModal.modal('hide');
            inpFollow.val('');

        } else {
            alert('Enter follow user email');
        }
    });

});