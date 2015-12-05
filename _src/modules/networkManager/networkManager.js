import $ from 'jquery';

export var networkManager = {
    getMcConnell: function (id, callback) {
        $.get('/mcconnells/' + id, function (data) {
            return callback(null, data);
        }).fail(function () {
            return callback(true);
        });
    },
    saveMcConnell: function (mcconnell, callback) {
        let data = JSON.stringify(mcconnell);
        $.ajax('/mcconnells', {
            data: data,
            type: 'POST',
            contentType: 'application/json',
            success: function (data) {
                return callback(null, data[0]);
            }
        });
    }
};
