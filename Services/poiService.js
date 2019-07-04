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

    self.isSaved=function(obj){
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/isSaved/'+ JSON.stringify(obj),
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

    self.addToFavorite=function(obj){
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/saveToFavorites/'+ JSON.stringify(obj),
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

    self.deleteFromFavorite=function(obj){
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/deleteFromFavorites/'+ JSON.stringify(obj),
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

    self.getFavoritePoints=function(obj){
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
});
