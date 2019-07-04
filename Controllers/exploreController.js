angular.module("myApp")
    .controller("exploreController", ['exploreService','poiService', '$scope', function (exploreService,poiService, $scope) {
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

        });
    }

    $scope.showdetails=function(poi){
        var obj={pointname:poi.Name}
        
        poiService.getCritisizm(obj).then(function(response){
            var index=$scope.poislist.indexOf(poi);
        var rank=$scope.poislist[index].Rank/5;
        var msg="View number: "+ $scope.poislist[index].WatchedBy+"\n"
        + "Description:\n "+ $scope.poislist[index].Description+"\n"
        +"Rating: " +rank*100 +"%\n"
        +"Critism:";
        var critism=response.data;
        if(response.data.length==0){
            msg=msg+"no Critism to this point of interest."
        }
        else if(response.data.length==1){
            msg=msg+"1."+critism[0].Criticism+" \n published on:" +critism[0].Date+"\n";
        }
        else{//2 or more:
            critism.sort(compare);
            msg=msg+"1."+critism[0].Criticism+" \n published on:" +critism[0].Date+"\n";
            msg=msg+"2."+critism[1].Criticism+" \n published on:" +critism[1].Date;


        }
        window.alert(msg)

        });
    }
    function compare( a, b ) {
        if ( a.Date < b.Date ){
          return -1;
        }
        if ( a.Date > b.Date ){
          return 1;
        }
        return 0;
      }


    }]);