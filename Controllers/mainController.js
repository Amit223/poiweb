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