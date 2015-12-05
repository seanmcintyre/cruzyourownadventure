import $ from 'jquery';
import sortable from 'jquery-ui/sortable'
import {player} from '../player/player.js';
import {networkManager} from '../networkManager/networkManager.js';
import {mcconnelling} from '../mcconnelling/mcconnelling.js'

export var editor = {
    init: function() {
        $('#sortable').sortable({
            revert: true
        });

        $('#sortable').on('sortstop', function() {
            playNewSequence();
        });

        $('.gallery-clip').on('click', function() {
            $('.instructions').remove();
            toggleTimelineClip($(this).data('clip'));
            playNewSequence();
        });

        $('.timeline-clip .close').on('click', function() {
            $(this).parent().toggleClass('active');
            playNewSequence();
        });

        $('#save').on('click', function () {
            editor.save(function (url) {
                mcconnelling.showShareDialog();
            });
        });

        $('#update').on('click', function () {
            playNewSequence();
            $('#video-share').show();
            window.scrollTo(0, 0);
        });

        $('.audio').on('change', function () {
            playNewSequence();
        });
    },
    save: function(callback) {
        networkManager.saveMcConnell(serializeMcConnell(), function (err, data) {
            mcconnelling.currentMcConnellId = data._id;
            callback(data._id);
        });
    }
};

function serializeMcConnell () {
    let clips = getClipOrder();
    let sound = getSound();
    return {
        clips: clips,
        sound: sound,
        name: $('#title').val()
    };
}

function toggleTimelineClip (clip) {
    $('.timeline-clip[data-clip=' + clip + ']').toggleClass('active');
}

function getClipOrder() {
    let clips = [];
    $( '.timeline li.active' ).each(function() {
        clips.push( $(this).data('clip') );
    });
    return clips;
}

function getSound() {
    return {
        url: $('#audio-url').val(),
        start: $('#audio-start').val()
    };
}

function playNewSequence() {
    player.load(serializeMcConnell());
    player.play();
}
