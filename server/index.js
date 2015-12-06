var express = require('express'),
    config  = require('../config'),
    db      = require('./db'),
    fs      = require('fs'),
    _       = require('underscore');

var app = express();
app.use(express.static(__dirname + '/../root'));
app.use(express.json());

var template;

fs.readFile(__dirname + '/../root/template.html', function (err, file) {
    template = _.template(file.toString());
});

function findMcconnell (id, callback) {
    db.collection('mcconnells').findOne({_id: id}, callback);
}

function saveMcconnell (mcconnell, callback) {
    db.collection('mcconnells').insert(mcconnell, callback);
}

function incProperty (mcconnell, property) {
    var id = mcconnell._id;
    if (!id.hasOwnProperty('_bsontype')) {
        id = mongo.ObjectID(id);
    }
    var update = {'$inc': {}};
    update['$inc'][property] = 1;
    db.collection('mcconnells').update({
        _id: id
    }, update, function () {});

}

function incViewCount (mcconnell) {
    incProperty(mcconnell, 'views');
}

function incShareCount (mcconnell) {
    incProperty(mcconnell, 'shares');
}

function getMostViewed (callback) {
    var cursor = db.collection('mcconnells').find();
    cursor.limit(10).sort({views: -1});
    cursor.toArray(callback);
}

app.get('/view', function (req, res) {
    var id = req.param('_id');
    findMcconnell(new db.ObjectId(id), function (err, mcconnell) {
        if (err) {
            console.error(err);
        }
        if (!mcconnell) {
            return res.redirect('/');
        }

        getMostViewed(function (err, mostViewed) {
            if (err) {
                console.error(err);
            }
            if (!mostViewed) {
                mostViewed = [];
            }
            console.log(mostViewed);
            var context = {
                title: mcconnell.title || 'CruzYourOwnAdventure.org',
                mcconnell: mcconnell,
                id: id,
                mostViewed: mostViewed
            };

            res.send(template(context));
        });
    });
});

app.get('/mcconnells/:id', function (req, res) {
    var id = req.param('id');
    findMcconnell(new db.ObjectId(id), function (err, mcconnell) {
        if (err) {
            console.error(err);
            return res.send(500, {error: 'something went wrong'});
        }

        if (_.isEmpty(mcconnell)) {
            return res.send(404, {error: 'McConnell not found'});
        }

        res.send(mcconnell);
        incViewCount(mcconnell);
    });
});

app.post('/mcconnells/:id/share', function (req, res) {
    incShareCount(req.body);
    res.send({});
});

app.post('/mcconnells', function (req, res) {
    var body = req.body;
    var mcconnell = {
        clips: body.clips,
        title: body.name,
        sound: body.sound,
        user:  body.user,
        shares: 0,
        views: 0
    };

    saveMcconnell(mcconnell, function (err, result) {
        if (err || !result || !result["ops"]) {
            console.error(err);
            return res.send(500, {error: 'something went wrong'});
        }

        var doc = result["ops"]
        res.send(doc);
    });
});

app.listen(config.port);
console.log('Now Cruzing on port ' + config.port);