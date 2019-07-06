
let app1 = angular.module('myApp', ['ngRoute','ngCookies']);

app1.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
// config routes
app1.config(function($routeProvider)   {
    $routeProvider
        .when('/' , {
            templateUrl : 'views/home.html',            
        })
        .when('/login', {
            templateUrl : 'views/login.html',
            
        })
        .when('/about', {
            templateUrl : 'views/about.html',
            
        })
        .when('/register', {
            templateUrl : 'views/register.html',
        })

        .when('/poi', {
            templateUrl : 'views/poi.html',
        })

        .when('/favorite',{
            templateUrl : 'views/favorite.html',
        })
        .otherwise({ redirectTo: '/' });

});

