angular.module('myApp').service('exploreService', function ($http) {
    let self = this;
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
            },
        };
        return $http(req);
    }
});