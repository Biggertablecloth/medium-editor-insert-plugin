var recorders = [];

function fancyTimeFormat(time) {
    if (!time || time === Infinity) {
        return '';
    }

    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4 seconds"
    var ret = "";

    if (mins === 0) {
        return secs + " seconds long. ";
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs + " long. ";
    return ret;
}

function onVideoRecorded(recorder) {
    if (!recorder.state) return;
    var video = recorder.state.get('video');
    var videoUrl = ZiggeoApi.Videos.source(video);
    var thumbUrl = ZiggeoApi.Videos.image(video);
    var id = recorder.id;
    recorder.place.html(
        '<div> ' +
            '<div style="text-align: center;"> ' +
                '<video id="video-' + id + '" controls style="max-width: 100%;" src="' + videoUrl + '"></video> ' +
            '</div> ' +
            '<a class="video-thumbnail" style="text-decoration: none; color: #999;"> ' +
                '<figure> ' +
                    '<img src="' + thumbUrl + '" style="max-width: 100%;"/> ' +
                    '<figcaption id="caption-' + id + '"></figcaption> ' +
                '</figure> ' +
            '</a>' +
        '</div></br>'
    );
    var videoElem = document.getElementById("video-" + id);
    videoElem.addEventListener('durationchange', function () {
        var time = Math.ceil(videoElem.duration);
        time = fancyTimeFormat(time);
        $('#caption-' + id).text(
            'Video Recording. ' + time + 'Click here to watch.'
        );
    });
}

function attachZiggeoEvent(recorder) {
    var element = document.getElementById('video-recorder-' + recorder.id);
    ZiggeoApi.token = '8a6794d0411834351170bfdaf35259a2';
    recorder.state = ZiggeoApi.V2.Recorder.findByElement(element);
    if (!recorder.state || recorder.hasEvent) return;
    recorder.state.on("verified", function () {
        onVideoRecorded(recorder);
    });
    recorder.hasEvent = true;
}

;(function ($, window, document, undefined) {

    'use strict';

    /** Default values */
    var pluginName = 'mediumInsert',
        addonName = 'Videorecording', // first char is uppercase
        defaults = {
            label: '<span class="fa fa-video-camera"></span>'
        };

    /**
     * Custom Addon object
     *
     * Sets options, variables and calls init() function
     *
     * @constructor
     * @param {DOM} el - DOM element to init the plugin on
     * @param {object} options - Options to override defaults
     * @return {void}
     */

    function Videorecording(el, options) {
        this.el = el;
        this.$el = $(el);
        this.templates = window.MediumInsert.Templates;
        this.core = this.$el.data('plugin_' + pluginName);

        this.options = $.extend(true, {}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    /**
     * Initialization
     *
     * @return {void}
     */

    Videorecording.prototype.init = function () {
        this.events();
    };

    /**
     * Event listeners
     *
     * @return {void}
     */

    Videorecording.prototype.events = function () {

    };

    /**
     * Get the Core object
     *
     * @return {object} Core object
     */
    Videorecording.prototype.getCore = function () {
        return this.core;
    };

    /**
     * Add custom content
     *
     * This function is called when user click on the addon's icon
     *
     * @return {void}
     */

    Videorecording.prototype.add = function () {
        var $place = this.$el.find('.medium-insert-active');
        var recorder = {
            id: Math.floor(Math.random() * 1000000),
            place: $place
        };

        recorders.push(recorder);

        setTimeout(function () {
            attachZiggeoEvent(recorder);
        }, 2000);

        $place.html(
            '<div style="display: flex; justify-content: center"> ' +
                '<ziggeorecorder ' +
                    'application="8a6794d0411834351170bfdaf35259a2" ' +
                    'id="video-recorder-' + recorder.id + '" ' +
                    'ziggeo-timelimit=300 ' +
                    'ziggeo-responsive ' +
                '>' +
                '</ziggeorecorder> ' +
            '</div>'
        );

        this.core.hideButtons();
    };


    /** Addon initialization */

    $.fn[pluginName + addonName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName + addonName)) {
                $.data(this, 'plugin_' + pluginName + addonName, new Videorecording(this, options));
            }
        });
    };

})(jQuery, window, document);
