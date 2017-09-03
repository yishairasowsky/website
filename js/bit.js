(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-81915606-4', 'auto');
ga('send', 'pageview');

function gaEvent(action, label, category) {
    var obj = {
        hitType: 'event',
        eventCategory: category || 'main',
        eventAction: action
    };

    if (label) {
        obj['eventLabel'] = label;
    }

    ga('send', obj);
}

$(function () {
    $('#contact-form').submit(function (e) {
        e.preventDefault();
        var refresh = $('#contact-form').find('.fa-refresh');
        var button = $('#contact-form').find('button');
        refresh.show();
        button.attr('disabled', true);

        $.ajax({
            type: 'POST',
            url: 'https://func.bitwarden.com/api/newhelpdeskticket',
            data: {
                name: $('#name').val(),
                email: $('#email').val(),
                message: $('#message').val()
            },
            dataType: 'html',
            success: function (response) {
                $('#email-success').show();
                $('#name').val('');
                $('#email').val('');
                $('#message').val('');

                refresh.hide();
                button.attr('disabled', false);
            },
            error: function (e) {
                $('#email-error').show();

                refresh.hide();
                button.attr('disabled', false);
            }
        });
    });

    $('#installation-form').submit(function (e) {
        e.preventDefault();
        var theForm = $('#installation-form');
        var refresh = theForm.find('.fa-refresh');
        var button = theForm.find('button');
        refresh.show();
        button.attr('disabled', true);

        $.ajax({
            type: 'POST',
            url: 'https://api.bitwarden.com/installations',
            data: JSON.stringify({
                email: $('#email').val()
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                theForm.hide();
                $('#installation-success').show();

                $('#installation-id').val(response.Id);
                $('#installation-key').val(response.Key);

                refresh.hide();
                button.attr('disabled', false);
            },
            error: function (e) {
                $('#installation-success').hide();
                $('#installation-error').show();

                refresh.hide();
                button.attr('disabled', false);
            }
        });
    });
});
