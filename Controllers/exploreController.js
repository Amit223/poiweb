angular.module("myApp")
    .controller("exploreController", ['exploreService', '$scope', function (exploreService, $scope) {
    $scope.load=function(){
        exploreService.explore().
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