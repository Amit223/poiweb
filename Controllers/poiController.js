angular.module("myApp")
    .controller("poiController", ['poiService', 'regService', '$scope', '$rootScope', function (poiService, regService, $scope, $rootScope) {
        //detail show:
        $scope.showPoi = false;


        $scope.isClicked = [];
        $scope.numSaved = 0;
        $scope.load = function () {

            poiService.getPoints().
                then(function (response) {
                    var tempPOI = []
                    var pois = response.data;
                    for (var i = 0; i < pois.length; i++) {
                        tempPOI.push(pois[i]);
                        //set + or - to points
                        var obj = { username: $rootScope.user, pointname: pois[i].Name };
                        poiService.isSaved(obj).then(function (response) {
                            if (response.data) {
                                $scope.isClicked.push("-")
                                $scope.numSaved = $scope.numSaved + 1;
                            }
                            else
                                $scope.isClicked.push("+")

                        })
                    }
                    $scope.poislist = tempPOI;
                })
                .catch((err) => {

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
        $scope.saved = "+"
        $scope.filterArray = function (poi) {
            if ($scope.selectedItems && $scope.selectedItems.length > 0)
                return ($scope.selectedItems.indexOf(poi.Category) !== -1);
            else
                return true;
        };

        $scope.sortButtonClick = function () {
            $scope.isClicked = true;

        }

        $scope.myValueFunction = function (poi) {
            if ($scope.isClicked)
                return -poi.Rank;
            else
                return 0;
        };

        $scope.showdetails = function (poi) {
            var obj = { pointname: poi.Name }

            poiService.getCritisizm(obj).then(function (response) {
                var index = $scope.poislist.indexOf(poi);
                var rank = $scope.poislist[index].Rank / 5;
                $scope.currNumViews = $scope.poislist[index].WatchedBy
                var msg = $scope.poislist[index].Description;
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
                var porm = $scope.isClicked[$scope.poislist.indexOf(poi)];
                if (porm == "+")
                    $scope.plusorminus = "add to favorites";
                else
                    $scope.plusorminus = "delete from favorites";

                $scope.currpoidetails = msg;
                $scope.currpoiname = poi.Name;
                $scope.showPoi = true;
                $scope.chosenPoi=poi;
                return;

                //window.alert(msg)
            })


        }
        $scope.retPrev = function () {
            $scope.showPoi = false;
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

        $scope.addOrDelete = function (poi) {

            if ($scope.isClicked[$scope.poislist.indexOf(poi)] == "+") {
                //add
                $scope.numSaved = $scope.numSaved + 1;
                var obj = { username: $rootScope.user, pointname: poi.Name, index: $scope.numSaved };
                console.log(obj);
                poiService.addToFavorite(obj).then(function (response) {
                    if (response.status == 200) {
                        $scope.isClicked[$scope.poislist.indexOf(poi)] = "-";
                        $rootScope.numFave = $rootScope.numFave + 1;
                    }
                })
            }
            else {
                //delete
                $scope.numSaved = $scope.numSaved - 1;
                var obj = { username: $rootScope.user, pointname: poi.Name };
                console.log(obj);
                poiService.deleteFromFavorite(obj).then(function (response) {
                    if (response.status == 200) {
                        $scope.isClicked[$scope.poislist.indexOf(poi)] = "+";
                        $rootScope.numFave = $rootScope.numFave - 1;
                    }
                });
                //update indexes
                $scope.updateUsersPointsIndexes();
            }

        };

        $scope.updateUsersPointsIndexes = function () {
            var obj = { username: $rootScope.user }
            poiService.getFavoritePoints(obj).then(function (response) {
                if (response.data.length > 0) {//have points
                    var favorites = response.data.sort(function (a, b) {
                        return parseFloat(a.Index) - parseFloat(b.Index);
                    });
                    console.log(favorites);
                    //for each point in asendic order, give new index by order
                    var counter = 1;
                    for (var i = 0; i < favorites.length; i++) {
                        var obj = { username: $rootScope.user, pointname: favorites[i].PointName, index: counter };
                        poiService.updateIndex(obj).then(function (response) {
                        });
                        counter = counter + 1;
                    }
                }
            })

        }



        $scope.addOrDeleteDiv = function () {

            if ($scope.plusorminus == "add to favorites") {
                //add
                $scope.numSaved = $scope.numSaved + 1;
                var obj = { username: $rootScope.user, pointname: $scope.chosenPoi.Name, index: $scope.numSaved };
                console.log(obj);
                poiService.addToFavorite(obj).then(function (response) {
                    if (response.status == 200) {
                        $scope.isClicked[$scope.poislist.indexOf($scope.chosenPoi)] = "-";
                        $rootScope.numFave = $rootScope.numFave + 1;
                        $scope.plusorminus = "delete from favorites";

                    }
                })
            }
            else {
                //delete
                $scope.numSaved = $scope.numSaved - 1;
                var obj = { username: $rootScope.user, pointname: $scope.chosenPoi.Name };
                console.log(obj);
                poiService.deleteFromFavorite(obj).then(function (response) {
                    if (response.status == 200) {
                        $scope.isClicked[$scope.poislist.indexOf($scope.chosenPoi)] = "+";
                        $rootScope.numFave = $rootScope.numFave - 1;
                        $scope.plusorminus = "add to favorites";

                    }
                });
                //update indexes
                $scope.updateUsersPointsIndexes();
            }

        };

    }]);
