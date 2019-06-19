// create controller
angular.module("myApp")
    .controller("createController", ['regService', '$scope', function (regService, $scope) {
        let self = this;
        $scope.mailpattern = /.+\@.+\..+/;

        $scope.submit = function () {
            if ($scope.password == $scope.repassword) {
                var obj = {
                    username: $scope.username, password: $scope.password,
                    first: $scope.firstname, last: $scope.lastname, email: $scope.email,
                    city: $scope.city, country: $scope.country
                };
                regService.register(obj).
                    then(function (response) {
                        if (response.status == 200) {
                            //need to add the points of interest to user.
                        }
                        else {
                            $scope.answerFromServer = response.status;
                        }
                        //window.alert($scope.answerFromServer);
                    });

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
                        $scope.selectedName = $scope.names[0]
                    }
                    //$scope.names=countries;

                }
            }
            request.open('GET', 'countries.xml', true);
            request.send();

            //load POI
            var poi = regService.getPointOfInterests().then(function (response) {
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
        $scope.inputs = [];
        $scope.addfield = function () {
            $scope.inputs.push({})
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

