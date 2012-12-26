/*jslint evil: true*/
/*global jQuery, window, modal, console, Modal, confirm, alert */

jQuery(function ($) {
    'use strict';

    var counter = 0,
        getRandomWidth = function () {
            return 300 + (Math.random() * 500) + 'px';
        },
        setupConfirmation = function (confirmation, instance) {
            $('button', confirmation.context).on('click', function () {
                var shouldClose = $(this).text() === 'Yes';
                confirmation.close(true);
                if (shouldClose) {
                    instance.close(true);
                }
            });
        };

    $(document).on('click', '[data-modal]', function (e) {
        e.preventDefault();
        counter += 1;

        $(this).openModal({
            title: 'Window #' + counter,
            width: getRandomWidth(),
            height: getRandomWidth(),
            onLoad: function (instance) {
                console.log('Log: Content loaded for ' + instance.title());
            },
            onClose: function (instance) {
                $.openModal({
                    title: 'Close widnow?',
                    content: '<button>Yes</button> <button>No</button>',
                    onLoad: function (confirmation) {
                        $('button:first', confirmation.context).focus();
                        setupConfirmation(confirmation, instance);
                    }
                });
                return false;
            }
        });
    });

});