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

angular.module('myApp').service('mainService', function ($http) {
    let self = this;
    self.setProfile = function (username, token) {
        profile.username = username;
        profile.token = token;
        console.log(profile.username);
    };

    self.profile = {
        username: "",
        token: "",
        get loggedIn() {
            return this.token;
        }

    };

    self.getToken = function (token) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/private',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
                'X-Auth-Token': token
            },
        };
        return $http(req);
    };

    self.explore=function(){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/explore',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            }
        };
        return $http(req);
    };
});


angular.module('myApp').service('poiService', function ($http) {
    let self = this;
    self.getPoints=function(){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getPoints',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
        };
        return $http(req);
    }
});