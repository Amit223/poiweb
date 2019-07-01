angular.module("myApp")
    .controller("poiController", ['poiService','regService' ,'$scope','$rootScope', function (poiService,regService, $scope ,$rootScope) {
        $scope.isClicked=[];
        $scope.numSaved=0;
        $scope.load=function(){
        poiService.getPoints().
        then(function(response){
            var tempPOI = []
            var pois = response.data;
            for (var i = 0; i < pois.length; i++) {
                tempPOI.push(pois[i]);
                //set + or - to points
                var obj={username: $rootScope.user, pointname:pois[i].Name};
                poiService.isSaved(obj).then(function(response){
                    if(response.data){
                        $scope.isClicked.push("-")
                        $scope.numSaved=$scope.numSaved+1;
                    }
                    else
                        $scope.isClicked.push("+")

                })
            }
            $scope.poislist = tempPOI;
        })
        .catch((err) => {
            console.log("something went wrong");

        });

        //categories
        regService.getPointOfInterestsCategories().then(function (response) {
            if (response.status == 200) {
                var tempPOI = []
                var pois = response.data;
                for (var i = 0; i < pois.length; i++) {
                    tempPOI.push(pois[i].Name);

                }
               // tempPOI.push("All");
                $scope.pointOfInterests = tempPOI;
            }
            else {
            }


        });
    }
    $scope.saved="+"
    $scope.filterArray = function(poi) {
        if($scope.selectedItems&&$scope.selectedItems.length>0)
            return ($scope.selectedItems.indexOf(poi.Category) !== -1);
        else
            return true;
    };
    
    $scope.sortButtonClick = function() {
        $scope.isClicked=true;

    }

    $scope.myValueFunction = function(poi) {
        if($scope.isClicked)
            return -poi.Rank;
        else
            return 0;
     };

    $scope.showdetails=function(poi){
        var index=$scope.poislist.indexOf(poi);
        var rank=$scope.poislist[index].Rank/5;
        var msg="View number: "+ $scope.poislist[index].WatchedBy+"\n"
        + "Description:\n "+ $scope.poislist[index].Description+"\n"
        +"Rating: " +rank*100 +"%\n"
        //todo add ratings
        window.alert(msg)
    }

    $scope.addOrDelete=function(poi){
        
        if($scope.isClicked[$scope.poislist.indexOf(poi)]=="+"){
            //add
            $scope.numSaved=$scope.numSaved+1;
            var obj={username: $rootScope.user, pointname:poi.Name, index:$scope.numSaved};
            console.log(obj);
            poiService.addToFavorite(obj).then(function(response){
                if(response.status==200){
                    $scope.isClicked[$scope.poislist.indexOf(poi)]="-";
                }
            })
        }
        else{
            //delete
            $scope.numSaved=$scope.numSaved-1;
            var obj={username: $rootScope.user, pointname:poi.Name};
            console.log(obj);
            poiService.deleteFromFavorite(obj).then(function(response){
                if(response.status==200){
                    $scope.isClicked[$scope.poislist.indexOf(poi)]="+";
                }
            });
            //update indexes
            $scope.updateUsersPointsIndexes();
        }
    };

    $scope.updateUsersPointsIndexes=function(){
        var obj={username: $rootScope.user}
        poiService.getFavoritePoints(obj).then(function(response){
            if(response.data.length>0){//have points
                var favorites=response.data.sort(function(a, b) {
                    return parseFloat(a.Index) - parseFloat(b.Index);
                });
                console.log(favorites);
                //for each point in asendic order, give new index by order
                var counter=1;
                for(var i=0;i<favorites.length;i++ ){
                    var obj={username: $rootScope.user, pointname:favorites[i].PointName, index:counter};
                    poiService.updateIndex(obj).then(function(response){
                    });
                    counter=counter+1;
                }
            }
        })

    }
    

    }]);

