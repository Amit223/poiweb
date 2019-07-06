angular.module("myApp")
    .controller("exploreController", ['exploreService', 'poiService', 'favoriteService', '$scope', '$rootScope', function (exploreService, poiService, favoriteService, $scope, $rootScope) {
        $scope.load = function () {
            exploreService.explore().
                then(function (response) {
                    var tempPOI = []
                    var pois = response.data;
                    for (var i = 0; i < pois.length; i++) {
                        tempPOI.push(pois[i]);
                    }
                    $scope.poislist = tempPOI;
                })
                .catch((err) => {

                });
        }

        $scope.showdetails = function (poi) {
            var obj = { pointname: poi.Name }
            poiService.getUpdatedDetails(obj).then(function (response2) {
                $scope.currNumViews = response2.data[0].WatchedBy;
                poiService.getCritisizm(obj).then(function (response) {
                
                    var index = $scope.poislist.indexOf(poi);
                    var rank = $scope.poislist[index].Rank / 5;
                    var msg = "View number: " + $scope.currNumViews + "\n"
                        + "Description:\n " + $scope.poislist[index].Description + "\n"
                        + "Rating: " + rank * 100 + "%\n"
                        + "Critism:";
                    var critism = response.data;
                    if (response.data.length == 0) {
                        msg = msg + "no Critism to this point of interest."
                    }
                    else if (response.data.length == 1) {
                        msg = msg + "1." + critism[0].Criticism + " \n published on:" + critism[0].Date + "\n";
                    }
                    else {//2 or more:
                        critism.sort(compare);
                        msg = msg + "1." + critism[0].Criticism + " \n published on:" + critism[0].Date + "\n";
                        msg = msg + "2." + critism[1].Criticism + " \n published on:" + critism[1].Date;
    
    
                    }
                   
                    window.alert(msg)
    
                });
            })
            

            poiService.addviews(obj).then(function (response) {
                //added views
                $scope.showPoi = false;
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

        //liad part

        function compareRanks(a, b) {
            if (a.Rank < b.Rank) {
                return -1;
            }
            if (a.Rank > b.Rank) {
                return 1;
            }
            return 0;
        }

        $scope.load2= async function(){
            if ($rootScope.connected) {
                var obj = {
                    username: $rootScope.user
                };

                var userCategories = [];
                await poiService.getCategoryFromUser(obj).then(function (resCategories) {
                    userCategories = resCategories.data;
                });

                var top2Points = [];
                var cat1 = { categoryname: userCategories[0].CategoryName };
                await poiService.getPOIByCategory(cat1).then(function (resPoints) {
                    var resPointsData = resPoints.data;
                    resPointsData.sort(compareRanks);
                    top2Points.push(resPointsData[0]);
                });
                var cat2 = { categoryname: userCategories[1].CategoryName };
                await poiService.getPOIByCategory(cat2).then(function (resPoints) {
                    var resPointsData = resPoints.data;
                    resPointsData.sort(compareRanks);
                    top2Points.push(resPointsData[0]);
                });
                $scope.topRankedPoints = top2Points;

                var userLastFavorites = [];
                var userLastFavoritesWithInfo = [];
                var ans = [];

                await favoriteService.getFavoritePointsMini(obj).then(function (resFavorite) {
                    userLastFavorites = resFavorite.data;
                });
                await favoriteService.getFavoritePoints(obj).then(function (resFavorite) {
                    userLastFavoritesWithInfo = resFavorite.data;
                });

                userLastFavorites.sort(compare);
                var favPoint1 = userLastFavorites[userLastFavorites.length - 1];
                var favPoint2 = userLastFavorites[userLastFavorites.length - 2];

                for (var i = 0; i < userLastFavoritesWithInfo.length; i++) {
                    if (userLastFavoritesWithInfo[i].Name === favPoint1.PointName) {
                        favPoint1.picture = userLastFavoritesWithInfo[i].picture;
                        favPoint1.Name = favPoint1.PointName;
                    }
                    if (userLastFavoritesWithInfo[i].Name === favPoint2.PointName) {
                        favPoint2.picture = userLastFavoritesWithInfo[i].picture;
                        favPoint2.Name = favPoint2.PointName;

                    }
                }
                ans.push(favPoint1);
                ans.push(favPoint2);
                $scope.mostRecentFavPoints = ans;
            }

        }
        $scope.showdetails44 = function (poi) {
            console.log("hello");
            var obj = { pointname: poi.Name }
            console.log(obj.pointname);
            poiService.getUpdatedDetails(obj).then(function (response2) {
                $scope.currNumViews = response2.data[0].WatchedBy;
                poiService.getCritisizm(obj).then(function (response) {

                    var index = $scope.topRankedPoints.indexOf(poi);
                    var rank = $scope.topRankedPoints[index].Rank / 5;
                    var msg = "View number: " + $scope.currNumViews + "\n"
                        + "Description:\n " + $scope.topRankedPoints[index].Description + "\n"
                        + "Rating: " + rank * 100 + "%\n"
                        + "Critism:";
                    var critism = response.data;
                    if (response.data.length == 0) {
                        msg = msg + "no Critism to this point of interest."
                    }
                    else if (response.data.length == 1) {
                        msg = msg + "1." + critism[0].Criticism + " \n published on:" + critism[0].Date + "\n";
                    }
                    else {//2 or more:
                        critism.sort(compare);
                        msg = msg + "1." + critism[0].Criticism + " \n published on:" + critism[0].Date + "\n";
                        msg = msg + "2." + critism[1].Criticism + " \n published on:" + critism[1].Date;


                    }

                    window.alert(msg)

                });
            })


            poiService.addviews(obj).then(function (response) {
                //added views
                $scope.showPoi = false;
            })
        }


        $scope.showdetails33 = function (poi) {
            var obj = { pointname: poi.Name }
            poiService.getUpdatedDetails(obj).then(function (response2) {
                $scope.currNumViews = response2.data[0].WatchedBy;
                poiService.getCritisizm(obj).then(function (response) {

                    var index = $scope.mostRecentFavPoints.indexOf(poi);
                    var rank = $scope.mostRecentFavPoints[index].Rank / 5;
                    var msg = "View number: " + $scope.currNumViews + "\n"
                        + "Description:\n " + $scope.mostRecentFavPoints[index].Description + "\n"
                        + "Rating: " + rank * 100 + "%\n"
                        + "Critism:";
                    var critism = response.data;
                    if (response.data.length == 0) {
                        msg = msg + "no Critism to this point of interest."
                    }
                    else if (response.data.length == 1) {
                        msg = msg + "1." + critism[0].Criticism + " \n published on:" + critism[0].Date + "\n";
                    }
                    else {//2 or more:
                        critism.sort(compare);
                        msg = msg + "1." + critism[0].Criticism + " \n published on:" + critism[0].Date + "\n";
                        msg = msg + "2." + critism[1].Criticism + " \n published on:" + critism[1].Date;


                    }

                    window.alert(msg)

                });
            })


            poiService.addviews(obj).then(function (response) {
                //added views
                $scope.showPoi = false;
            })
        }

    }]);

