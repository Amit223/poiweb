angular.module('myApp').service('regService', function ($http) {
    let self = this;
    self.register = function (obj) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/create/' + JSON.stringify(obj),

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

    self.addCategoryToUser = function (obj) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/addCategoryToUser/' + JSON.stringify(obj),

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

    self.getPointOfInterestsCategories = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getPointOfInterestsCategories',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json"
            }
        };
        return $http(req);
    };

});


