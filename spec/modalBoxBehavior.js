﻿/*jslint vars: true*/
/*global describe, it, expect, waitsFor, runs, afterEach, waits, $*/

describe('Modal Box', function () {
    'use strict';

    function getLastOpenModal() {
        var modals = $.Modal.openModals();
        return modals[modals.length - 1];
    }

    afterEach(function () {
        $.each($.Modal.openModals(), function (i, modal) {
            modal.close(true);
        });
    });

    it('Should read url and title from link element', function () {
        var element = $('<a href="/test-url.htm" title="Test">Title</a>')[0],
            options = $.Modal.parseOptions(element);

        expect(options.url).toEqual('/test-url.htm');
        expect(options.title).toEqual('Test');
    });

    it('Should read title from link text', function () {
        var element = $('<a href="/test-url.htm">Title</a>')[0],
            options = $.Modal.parseOptions(element);

        expect(options.title).toEqual('Title');
    });

    it('Should read title from data-modal attribute', function () {
        var element = $('<a href="/test-url.htm" title="Test" data-modal="{ title: \'ModalTitle\' }">Title</a>')[0],
            options = $.Modal.parseOptions(element);

        expect(options.title).toEqual('ModalTitle');
    });

    it('Should set title and content, and call onLoad', function () {
        var modal;

        $.openModal({
            title: 'Title',
            content: 'Content',
            onLoad: function (instance) { modal = instance; }
        });

        waitsFor(function () {
            return modal;
        }, 'Modal onLoad never completed.', 50);

        runs(function () {
            expect(modal.title()).toEqual('Title');
            expect(modal.content()).toEqual('Content');
        });
    });

    it('Should set container width', function () {
        var modal;

        $.openModal({
            title: 'Title',
            content: 'Content',
            width: 100,
            onLoad: function (instance) { modal = instance; }
        });

        waitsFor(function () {
            return modal;
        }, 'Modal onLoad never completed.', 50);

        runs(function () {
            expect(modal.container.width()).toEqual(100);
        });
    });

    it('Should set content container height', function () {
        var modal;

        $.openModal({
            title: 'Title',
            content: 'Content',
            height: 100,
            onLoad: function (instance) { modal = instance; }
        });

        waitsFor(function () {
            return modal;
        }, 'Modal onLoad never completed.', 50);

        runs(function () {
            expect(modal.contentContainer.height()).toEqual(100);
        });
    });

    it('Should add class to context container', function () {
        var modal;

        $.openModal({
            title: 'Title',
            content: 'Content',
            className: 'test-class',
            height: 100,
            onLoad: function (instance) { modal = instance; }
        });

        waitsFor(function () {
            return modal;
        }, 'Modal onLoad never completed.', 50);

        runs(function () {
            expect(modal.context.hasClass('test-class')).toBe(true);
        });
    });

    it('Should call onClose', function () {
        var modal,
            closed;

        $.openModal({
            title: 'Title',
            content: 'Content',
            onLoad: function (instance) { modal = instance; },
            onClose: function (instance) { closed = instance === modal; }
        });

        waitsFor(function () {
            return modal;
        }, 'Modal onLoad never completed.', 50);

        runs(function () {
            modal.close();
            expect(closed).toBe(true);
        });
    });

    it('Should load content via ajax and display loading message', function () {
        var modal, loaded;

        $.mockjax({
            url: '/test',
            responseTime: 50,
            responseText: 'AjaxContent'
        });

        $.openModal({
            url: '/test',
            title: 'Title',
            loader: 'LoadingText',
            onLoad: function () { loaded = true; }
        });

        modal = getLastOpenModal();

        waits(20);

        expect(modal.contentContainer.html()).toBe('LoadingText');

        waits(70);

        runs(function () {
            expect(modal.content()).toBe('AjaxContent');
        });
    });

    it('Should add class to html on first load and remove after last closed', function () {
        var htmlClass = 'test-hmtl-class',
            openCount = $.Modal.openCount(),
            modal;

        expect(openCount).toBe(0);
        expect($('html').hasClass(htmlClass)).toBe(false);

        $.openModal({
            title: 'Title',
            content: 'Content',
            htmlClass: htmlClass
        });

        openCount = $.Modal.openCount();
        expect(openCount).toBe(1);
        expect($('html').hasClass(htmlClass)).toBe(true);

        modal = getLastOpenModal();
        modal.close(true);

        openCount = $.Modal.openCount();
        expect(openCount).toBe(0);
        expect($('html').hasClass(htmlClass)).toBe(false);
    });
});