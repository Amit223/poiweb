angular.module('myApp').service('favoriteService', function ($http) {
    let self = this;
    self.deleteFromFavorite = function (obj) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/deleteFromFavorites/' + JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.getFavoritePoints = function (obj) {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getFavoritePointsAll/' + JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.getCritisizm=function(obj){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getCritizes/'+ JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.getUpdatedDetails=function(obj){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getPointOfIntersetDetails/'+ JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.addviews=function(obj){
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/addviews/'+ JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.getIndex=function(obj2){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getPointIndex/'+ JSON.stringify(obj2),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj2)
        };
        return $http(req);
    }


    self.getFavoritePointsMini=function(obj){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getFavoritePoints/'+ JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

    self.updateIndex=function(obj){
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/updateIndex/'+ JSON.stringify(obj),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Max-Age": "*",
                "Content-Type": "application/json",
            },
            data: JSON.stringify(obj)
        };
        return $http(req);
    }

});