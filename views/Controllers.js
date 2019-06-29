// create controller
angular.module("myApp")
    .controller("createController", ['regService', '$scope', function (regService, $scope) {
        let self = this;
        $scope.mailpattern = /.+\@.+\..+/;
        $scope.check = function () {
            console.log($scope.selectedCat)
        }
        $scope.submit = function () {
            var countrynameaetra = JSON.stringify($scope.selectedName);
            var countryname = countrynameaetra.substring(1, countrynameaetra.length - 1)

            if ($scope.password == $scope.repassword) {
                if ($scope.selectedCat.length >= 2) {
                    var obj = {
                        username: $scope.username, password: $scope.password,
                        first: $scope.firstname, last: $scope.lastname, email: $scope.email,
                        city: $scope.city, counrty: countryname, q1: $scope.question1, a1: $scope.answer1,
                        q2: $scope.question2, a2: $scope.answer2
                    };
                    regService.register(obj).
                        then(function (response) {
                            if (response.status == 200) {

                            }
                            else {

                                $scope.answerFromServer = response.status;
                                return;
                            }
                            //window.alert($scope.answerFromServer);
                        });
                    //add all categories
                    var categoriesNames = $scope.selectedCat;
                    var user=$scope.username;
                    for (var i = 0; i < categoriesNames.length; i++) {
                        var object = { username:user , category: categoriesNames[i] };
                        regService.addCategoryToUser(object).
                            then(function (response) {
                                if (response.status == 200) {
                                    window.location.href='#!login';
                                }
                                else {
                                    console.log("something is wrong");
                                }
                            })
                            .catch(function (response) {
                                console.log("that to do");

                            });
                    }

                }
                else {
                    $scope.answerFromServer = "need to choose 2 or more point of interests";

                }
            }
            else {
                $scope.answerFromServer = "password don't match!";
            }
        };

        $scope.names = [];
        $scope.load = function () {
            //load countries-todo only works when pressing on it and than the page, not from beginning
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (this.status = 200 && this.readyState == 4) {
                    var countries = [];
                    var xml = this.responseXML;
                    var countriesFromXML = xml.getElementsByTagName("Country");
                    //get country names:
                    for (var i = 0; i < countriesFromXML.length; i++) {
                        //get 1 country name 
                        var countryName = countriesFromXML[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString();
                        //var JSONCountry={"name":countryName};
                        countries.push(countryName);
                        $scope.names.push(countryName);
                    }
                    $scope.selectedName = $scope.names[0]

                    //$scope.names=countries;

                }
            }
            request.open('GET', 'countries.xml', true);
            request.send();

            //load POI categories
            var poi = regService.getPointOfInterestsCategories().then(function (response) {
                if (response.status == 200) {
                    var tempPOI = []
                    var pois = response.data;
                    for (var i = 0; i < pois.length; i++) {
                        tempPOI.push(pois[i].Name);
                    }
                    $scope.pointOfInterests = tempPOI;
                }
                else {
                }



            });

        };
        $scope.press = function () {
            var str = JSON.stringify($scope.selectedName);
            console.log(str);
            console.log(str.substring(1, str.length - 1));


        }


    }]);
//main controller
angular.module("myApp")
    .controller('MainController', function ($scope, $rootScope) {
        $rootScope.usernamelogged = "Guest";
        $scope.checkConnection = function () {
            if ($rootscope.username == "non")
                return false;
            return true;
        }
        $scope.currName = $rootScope.usernamelogged;

    });

