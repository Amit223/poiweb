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
