angular.module('myApp').service('loginService', function ($http) {
    let self = this;
    self.loginToServer = function (obj) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/login/' + JSON.stringify(obj),

            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json"
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    };

    self.getQA = function (obj) {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getQA/' + JSON.stringify(obj),

            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json"
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.getPassword = function (obj) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/restorePassword/' + JSON.stringify(obj),

            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json"
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }
});


