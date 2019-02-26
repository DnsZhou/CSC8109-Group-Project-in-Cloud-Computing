$(document).ready(function () {
    $.notify({
        // options
        icon: 'glyphicon glyphicon-warning-sign',
        message: '✉ You have 1 pending exchange from <b>James Smith</b>',
        url: 'http://www.google.com',
        target: '_blank'
    }, {
            // settings
            element: 'body',
            type: "info",
            allow_dismiss: true,
            newest_on_top: true,
            placement: {
                from: "top",
                align: "right"
            },
            offset: 60,
            delay: 5000,
            timer: 1000,
            url_target: '_blank',
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
        });

        $.notify({
            // options
            icon: 'glyphicon glyphicon-warning-sign',
            message: '✉ You have 1 pending exchange from <b>Clara Phillips</b>',
            url: 'http://www.google.com',
            target: '_blank'
        }, {
                // settings
                element: 'body',
                type: "info",
                allow_dismiss: true,
                newest_on_top: true,
                placement: {
                    from: "top",
                    align: "right"
                },
                offset: 60,
                delay: 5000,
                timer: 1000,
                url_target: '_blank',
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                },
            });
            $.notify({
                // options
                icon: 'glyphicon glyphicon-warning-sign',
                message: '✉ You have 2 pending exchange from <b>Pual Anyone</b>',
                url: 'http://www.google.com',
                target: '_blank'
            }, {
                    // settings
                    element: 'body',
                    type: "info",
                    allow_dismiss: true,
                    newest_on_top: true,
                    placement: {
                        from: "top",
                        align: "right"
                    },
                    offset: 60,
                    delay: 5000,
                    timer: 1000,
                    url_target: '_blank',
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                });
})