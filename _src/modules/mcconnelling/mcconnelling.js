import $ from 'jquery';
import {editor} from '../editor/editor.js';
import {player} from '../player/player.js';
import {audioplayer} from '../audioPlayer/audioPlayer.js';
import {networkManager} from '../networkManager/networkManager.js';


var fbTemplate = '<a href="https://www.facebook.com/sharer/sharer.php?u={$URL}" target="_blank">Share on Facebook</a>';
var twTemplate =  '<a href="https://twitter.com/share?url={$URL}" target="_blank">Share on Twitter</a>';

export var mcconnelling = {
    init: function() {
        this.currentMcConnellId = getIdFromURL();
        if (this.currentMcConnellId) {
            $('body').addClass('player_showing');
            $('#solo-share').on('click', function () {
                this.showShareDialog();
            });
            loadMcConnellFromID(mcconnelling.currentMcConnellId);
        } else {
            welcome();
        }
    },

    currentMcConnellId: null,
    getShareURL: function () {
        return 'http://www.cruzyourownadventure.org/view?_id=' + mcconnelling.currentMcConnellId;
    },
    showShareDialog: function () {


        var url = mcconnelling.getShareURL();

        alert(url);

        $('#share-link').val(url);
        var encodedUrl = encodeURIComponent(url);
        var fb = fbTemplate.replace('{$URL}', encodedUrl);
        var tw = twTemplate.replace('{$URL}', encodedUrl);
        var $fbshare = $(fb);
        var $twshare = $(tw);
        $('#save').show();
        $('.copypaste').show();
        $('#video-share .facebook').show();
        $('#video-share .twitter').show();
        $('#video-share .link').show();
        $('#video-share .facebook').empty();
        $('#video-share .twitter').empty();
        $('#video-share .facebook').append($fbshare);
        $('#video-share .twitter').append($twshare);
        $('#share').show();
        $('#share #close, .backdrop').on('click', function () {
            $('#share').hide();
            $('#share #close, .backdrop').off('click');
        });
    }
};

function getIdFromURL () {
    let match = window.location.search.match(/_id=([\d\w]+)/);
    if (match) {
        return match[1];
    }
    return null;
}

function welcome () {
    $('#player').fadeIn("slow");
    $('#editor').fadeIn("slow", function () {
        $('body').addClass('player_showing');
        $('body').animate({
            scrollTop: 400
        });
    });
}

function loadMcConnellFromID (id) {
    networkManager.getMcConnell(id, function (err, mcconnell) {
        if (err) {
            return displayError();
        }
        player.load(mcconnell);
        player.play();
    });
}
