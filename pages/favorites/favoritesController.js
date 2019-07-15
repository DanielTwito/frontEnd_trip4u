

app.controller('favoritesCont', function($scope,$location,$http,$rootScope) {

    $scope.selected = null;

    $scope.favToShow = [];
    getFavoritesByOrder();

    // for (let i = 0; i < $scope.favToShow.length; i++) {
    //     $scope.favToShow[i]["poiIndex"] = i;
    $scope.options = $rootScope.sortOptions;
    $scope.save = function () {

        var favorite = [];
        for (let i = 0; i < $scope.favToShow.length; i++) {
            favorite.push({poiId: $scope.favToShow[i].poiId,
                           timeStamp: $scope.favToShow[i].timeStamp,
                           poiIndex: i});
        }
        console.log(JSON.stringify(favorite));
        // send favorite list to server
        $http({
            method : "POST",
            url : $rootScope.url +"/SaveFavoritePOI",
            data: {favorite: favorite},
            headers: {
                "authrization": sessionStorage.getItem("token")
            }

        }).then(function ok(res) {
           alert("Favorites saved successfully!");
        }).catch(function error (res) {
            alert("error");
        });


    };
    // }
    function getFavoritesByOrder() {

        var favor = [...$rootScope.favoriets.values()];

        for (let i = 0; i < favor.length; i++) {
            let idx = favor[i]["poiIndex"];
            $scope.favToShow[idx] = favor[i];
        }


    }

    $scope.swapLeft = function (poi, index) {

      if(index===0)
          return;
      else {
          var tmp = $scope.favToShow[index -1];
          $scope.favToShow[index-1] = $scope.favToShow[index];
          $scope.favToShow[index] = tmp;
      }

    };

    $scope.swapRight = function (poi, index) {

      if(index===$scope.favToShow.length-1)
          return;
      else {
          var tmp = $scope.favToShow[index +1];
          $scope.favToShow[index+1] = $scope.favToShow[index];
          $scope.favToShow[index] = tmp;
      }

    };

    $scope.removePOI = function (poiId) {

        // for (var i = 0; i < $rootScope.favoriets.length; i++) {
        //     if ($rootScope.favoriets[i].poiId === poiId)
        //         $rootScope.favoriets.remove($rootScope.favoriets[i]);
        // }

        $rootScope.favoriets.delete(poiId);
        $rootScope.getLastFavorite();
        $scope.favToShow = [...$rootScope.favoriets.values()];

    };

    $scope.getFavorites = function () {

        return [...$rootScope.favoriets.values()];
    };

    $scope.showPOIDetails = function (poiId) {

        // move to poi presentation page
        $rootScope.choosePoi = poiId;
        $location.path( "/poiInformation");
    };

    $scope.sortPoi = function () {

        $scope.favToShow = [...$rootScope.favoriets.values()];
        switch ($scope.sortBy) {

            case 'Sort by category':
                $scope.favToShow.sort(sort_by('field', false, function(a){return a.toUpperCase()}));
                break;
            case 'Sort by rank':
                $scope.favToShow.sort(sort_by('rank', true, parseInt));
                break;
            case 'Show all':
                $scope.favToShow = [...$rootScope.favoriets.values()];
                break;
            default:
                $scope.favToShow = getPOIByCategory($scope.sortBy);

        }

    };

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };


    var sort_by = function(field, reverse, primer){

        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    };


    var getPOIByCategory =function(sortBy) {

        var ans = [];

        for (var i = 0; i < $scope.favToShow.length; i++) {
            if ($scope.favToShow[i].field === sortBy)
                ans.push($scope.favToShow[i])
        }

        return ans;
    }





});



