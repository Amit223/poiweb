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