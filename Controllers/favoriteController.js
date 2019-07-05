angular.module("myApp")
    .controller("favoriteController", ['favoriteService', 'mainService', '$scope', '$rootScope', '$cookies', function (favoriteService, mainService, $scope, $rootScope, $cookies) {
        //load
        $scope.numSaved = 0;
        $scope.load = function () {
            $scope.isClickedCat = false;
            $scope.isClickedSorted = false;

            var token_ = $cookies.get('token')
            var obj = { token: token_ };
            mainService.getToken(token_).then(function (response) {
                if (response.status = 200 && response.data != "X") {
                    $scope.username = response.data;
                    showPoints();

                }
            });
        }

        //switch points
        $scope.isClicked = true;//is sorted by user's order
        $scope.numChecked = 0;
        $scope.toShowCheck = function (poi) {
            if ($scope.isClicked && $scope.numChecked < 2) {
                return true;
            }
            else {
                if ($scope.numChecked == 2) {
                    if (poi.checked)
                        return true;
                    else
                        return false;
                }
                else return false;
            }
        }
        $scope.disable=function(){
            if($scope.numChecked ===2&&$scope.isClicked)
                return false;
            return true;
        }
        $scope.change=function(poi){
            if(poi.checked==true){
                //poi.checked=false;
                $scope.numChecked=$scope.numChecked+1;
            }
            else{
                //poi.checked=true;
                $scope.numChecked=$scope.numChecked-1;
            }
        }
        $scope.switch=function(){
            var clickedpoints=$scope.poislist.sort(byChecked);
            var poi1=clickedpoints[0];
            var poi2=clickedpoints[1];
            var index1=poi1.Index;
            var index2=poi2.Index;
            //update in database
            var obj1={username:$scope.username, pointname:poi1.Name,index:index2 };
            var obj2={username:$scope.username, pointname:poi2.Name,index:index1 };
            favoriteService.updateIndex(obj1).then(function(response){
                console.log(obj1);
            });
            favoriteService.updateIndex(obj2).then(function(response){
                console.log(obj2);

            });
            //update in pois
            $scope.poislist[$scope.poislist.indexOf(poi1)].Index=index2;
            $scope.poislist[$scope.poislist.indexOf(poi2)].Index=index1;


        }
        
        function byChecked(a, b) {
            if (a.checked < b.checked) {
                return 1;
            }
            if (a.checked > b.checked) {
                return -1;
            }
            return 0;
        }

        function showPoints() {
            var obj = { username: $scope.username };
            favoriteService.getFavoritePoints(obj).
                then(function (response) {
                    $scope.numSaved = response.data.length;
                    //var tempPOI = []
                    $scope.poislist = [];
                    $scope.pois = response.data;
                    var length = $scope.pois.length;

                    for (var i = 0; i < length; i++) {
                        var obj2 = { pointname: $scope.pois[i].Name, username: $scope.username }
                        //var index=0;
                        //favoriteService.getIndex(obj2).then(function (response2) {
                        //    $scope.index= response2.data[0].Index;
                        //})
                        var poiname = $scope.pois[i].Name;
                        var poides = $scope.pois[i].Description;
                        var poirank = $scope.pois[i].Rank;
                        var poipic = $scope.pois[i].picture;
                        var poicat = $scope.pois[i].Category;
                        please(obj2, poiname, poides, poirank, poipic, poicat,false);


                    }
                    //= tempPOI;
                })
                .catch((err) => {

                });
        }
        async function please(obj, name, des, rank, pic, cat,isChecked) {
            try {
                const response = await favoriteService.getIndex(obj);
                var index_ = await response.data[0].Index;

                var tempsinglepoi = {
                    Name: name, Description: des, Rank: rank,
                    picture: pic, Category: cat, Index: index_, checked: isChecked
                }
                $scope.poislist.push(tempsinglepoi);
            }
            catch (rejectedValue) {
                // …
            }
        }

        //details
        $scope.showdetails = function (poi) {
            var obj = { pointname: poi.Name }
            favoriteService.getUpdatedDetails(obj).then(function (response) {
                $scope.currNumViews = response.data[0].WatchedBy;
            })
            favoriteService.getCritisizm(obj).then(function (response) {
                var index = $scope.poislist.indexOf(poi);
                var rank = $scope.poislist[index].Rank / 5;
                //$scope.currNumViews = $scope.poislist[index].WatchedBy
                var msg = $scope.poislist[index].Description;
                $scope.currpoidetails = msg;
                $scope.currRating = rank * 100 + "%";

                var critism = response.data;
                $scope.currcrit2 = "";
                if (response.data.length == 0) {
                    $scope.currcrit1 = "no Critism to this point of interest."
                }
                else if (response.data.length == 1) {
                    $scope.currcrit1 = "1." + critism[0].Criticism + " \n published on:" + critism[0].Date;
                }
                else {//2 or more:
                    critism.sort(compare);
                    $scope.currcrit1 = '1."' + critism[0].Criticism + '", published on:' + critism[0].Date;
                    $scope.currcrit2 = '2."' + critism[1].Criticism + '", published on:' + critism[1].Date;


                }
                $scope.currpoiname = poi.Name;
                $scope.showPoi = true;
                $scope.chosenPoi = poi;
                return;

            })


        }

        function compare(a, b) {
            if (a.Date < b.Date) {
                return -1;
            }
            if (a.Date > b.Date) {
                return 1;
            }
            return 0;
        }


        $scope.retPrev = function () {
            var obj2 = { pointname: $scope.chosenPoi.Name }
            favoriteService.addviews(obj2).then(function (response) {
                //added views
                $scope.showPoi = false;
            })
            $scope.showPoi = false;
        }

        //filters

        $scope.sortButtonClickCategory = function () {
            $scope.isClickedCat = true;
            $scope.isClickedSorted = false;
            $scope.isClicked = false;

        }
        $scope.sortButtonClick = function () {
            $scope.isClickedSorted = true;
            $scope.isClickedCat = false;
            $scope.isClicked = false;

        }

        $scope.sortButtonClickRegular = function () {
            $scope.isClickedCat = false;
            $scope.isClickedSorted = false;
            $scope.isClicked = true;


        }

        $scope.myValueFunction = function (poi) {
            if ($scope.isClickedSorted) {
                $scope.isClickedCat = false;
                return -poi.Rank;
            }
            else if ($scope.isClickedCat) {
                $scope.isClickedSorted = false;
                return poi.Category;
            }
            else {

                return poi.Index;

            }
        };



        $scope.updateUsersPointsIndexes = function () {
            var obj = { username: $scope.username }
            favoriteService.getFavoritePointsMini(obj).then(function (response) {
                if (response.data.length > 0) {//have points
                    var favorites = response.data.sort(function (a, b) {
                        return parseFloat(a.Index) - parseFloat(b.Index);
                    });
                    console.log(favorites);
                    //for each point in asendic order, give new index by order
                    var counter = 1;
                    for (var i = 0; i < favorites.length; i++) {
                        var obj = { username: $scope.username, pointname: favorites[i].PointName, index: counter };
                        favoriteService.updateIndex(obj).then(function (response) {
                        });
                        counter = counter + 1;
                    }
                }
            })

        }





        $scope.Delete = function (poi) {//only delete
            //var obj = { username: $rootScope.user, pointname: poi.Name, index: $scope.numSaved };
            //delete
            $scope.numSaved = $scope.numSaved - 1;
            var obj = { username: $rootScope.user, pointname: poi.Name };
            console.log(obj);
            favoriteService.deleteFromFavorite(obj).then(function (response) {
                if (response.status == 200) {
                    $rootScope.numFave = $rootScope.numFave - 1;
                }
            });
            //update indexes
            $scope.updateUsersPointsIndexes();
            //show again
            //showPoints();
            $scope.poislist.splice($scope.poislist.indexOf(poi), 1);

        };


        $scope.DeleteDiv = function () {//only delete
            //var obj = { username: $rootScope.user, pointname: poi.Name, index: $scope.numSaved };
            //delete
            $scope.numSaved = $scope.numSaved - 1;
            var obj = { username: $rootScope.user, pointname: $scope.chosenPoi.Name };
            console.log(obj);
            favoriteService.deleteFromFavorite(obj).then(function (response) {
                if (response.status == 200) {
                    $rootScope.numFave = $rootScope.numFave - 1;
                }
            });
            //update indexes
            $scope.updateUsersPointsIndexes();
            //show again
            //showPoints();
            $scope.poislist.splice($scope.poislist.indexOf($scope.chosenPoi), 1);
            $scope.showPoi = false;

        };


    }]);
