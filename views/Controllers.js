
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

                                $scope.answerFromServer = "user name exist, please try again.";
                                return;
                            }
                            //window.alert($scope.answerFromServer);
                        });
                    //add all categories
                    var categoriesNames = $scope.selectedCat;
                    var user = $scope.username;
                    for (var i = 0; i < categoriesNames.length; i++) {
                        var object = { username: user, category: categoriesNames[i] };
                        regService.addCategoryToUser(object).
                            then(function (response) {
                                if (response.status == 200) {
                                    window.location.href = '#!login';
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
    .controller('MainController', ['mainService', '$scope', '$rootScope', '$cookies',
        function (mainService, $scope, $rootScope, $cookies) {

            $scope.usernamelogged = "b";
            $scope.checkConnection = true;


            $scope.load = function () {
                var token_ = $cookies.get('token')
                var obj = { token: token_ };
                mainService.getToken(token_).then(function (response) {
                    if (response.status = 200 && response.data != "X") {
                        $scope.currName = "Hello " + response.data;
                        $scope.usernamelogged = response.data;
                        $scope.checkConnection = true;
                    }
                    else {
                        $scope.currName = "Hello Guest"
                        $scope.checkConnection = false;
                    }
                })


            }

        }]);

//login controller
angular.module("myApp")
    .controller("loginController", ['loginService', '$scope', '$rootScope', '$cookies', function (loginService, $scope, $rootScope, $cookies) {
        let self = this;
        $scope.getPassword = false;
        $scope.gotusername = false;
        $scope.wantslogin = true;
        $scope.login = function () {
            var obj = { username: $scope.username, password: $scope.password };
            loginService.loginToServer(obj).
                then(function (response) {
                    if (response.data != "X") {
                        $cookies.put('token', response.data);
                        console.log("token is:" + $cookies.get('token'))
                        window.location.href = '';

                    }
                    else {
                        window.alert("user or password are incorrect. Please try again.")
                    }
                })
        }

        $scope.showQA = function () {
            var obj = { username: $scope.usernameRetrieved };
            loginService.getQA(obj).
                then(function (response) {
                    if (response.status == 200) {
                        var temp = []
                        var questions_data = response.data;
                        temp.push(questions_data.q1);
                        temp.push(questions_data.q2);

                        $scope.questions = temp;
                        $scope.gotusername = true;
                        $scope.getPassword = false;
                    }
                    else {
                        window.alert("username doesn't exist. Please try again")
                    }
                })
                .catch((err) => {
                    window.alert("username doesn't exist. Please try again");

                });
        }

        $scope.passwordUser = "";
        $scope.forgot = function () {
            var questionlong = JSON.stringify($scope.selectedName);
            var _question = questionlong.substring(1, questionlong.length - 1)

            var obj = { username: $scope.usernameRetrieved, question: _question, answer: $scope.answer };
            loginService.getPassword(obj).
                then(function (response) {
                    if (response.status == 200) {
                        $scope.passwordUser = "Your password is:" + response.data;
                    }
                })
                .catch((err) => {
                    window.alert("answer is incorrect. Can't restore password.");

                });
        }

        $scope.showForgot = function () {
            $scope.getPassword = true;
            $scope.wantslogin = false;
        }
        $scope.showLogin = function () {
            $scope.gotusername = false;
            $scope.wantslogin = true;
        }


    }]);

angular.module("myApp")
    .controller("poiController", ['poiService', '$scope', function (poiService, $scope) {
    $scope.load=function(){
        poiService.getPoints().
        then(function(response){
            var tempPOI = []
            var pois = response.data;
            for (var i = 0; i < pois.length; i++) {
                tempPOI.push(pois[i]);
            }
            $scope.poislist = tempPOI;
        })
        .catch((err) => {
            console.log("something went wrong");

        });
    }
    $scope.showdetails=function(poi){
        var index=$scope.poislist.indexOf(poi);
        var rank=$scope.poislist[index].Rank/5;
        var msg="View number: "+ $scope.poislist[index].WatchedBy+"\n"
        + "Description:\n "+ $scope.poislist[index].Description+"\n"
        +"Rating: " +rank*100 +"%\n"
        //todo add ratings
        window.alert(msg)
    }


    }]);