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
                    var date = new Date();
                    console.log(date.toUTCString().substr(date.toUTCString().indexOf(",") + 2));

                    if (response.status = 200 && response.data != "X") {
                        $scope.currName = "Hello " + response.data;
                        $scope.usernamelogged = response.data;
                        $scope.checkConnection = true;
                        $rootScope.connected = true;
                        $rootScope.user = response.data;
                    }
                    else {
                        $scope.currName = "Hello Guest"
                        $scope.checkConnection = false;
                        $rootScope.connected = false;
                    }
                    var obj = { username: $rootScope.user }
                mainService.getNumFavorite(obj).then(function (response) {
                    $rootScope.numFave = response.data.length;
                });

                })
                    .catch((err) => {

                    });
                

            }

        }]);