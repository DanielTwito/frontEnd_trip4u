


app.controller('poiCont', function($scope,$location,$http,$rootScope) {

    $scope.poiToShow = $rootScope.poiList;
    $scope.sortOption = $rootScope.sortOptions;
    // $scope.sortOptions.push('Sort by rank');


    $scope.showPOIDetails = function (poiId) {

        // move to poi presentation page
        $rootScope.choosePoi = poiId;
        $location.path( "/poiInformation");

    };

    $scope.searchPoi = function () {

        $scope.poiToShow = $rootScope.poiList;
        if($scope.textToSearch === '')
            return;

        var ans = [];
        console.log($scope.textToSearch);
        for (var i = 0; i < $scope.poiToShow.length; i++) {
            if ($scope.poiToShow[i].name.toLowerCase().includes($scope.textToSearch.toLowerCase()))
                ans.push($scope.poiToShow[i])

        }
        $scope.poiToShow = ans;
        console.log($scope.poiToShow);
    };

    $scope.addToFavorite = function (poi) {

        var cb = document.getElementById("id-of-input"+poi.poiId).checked;
        // console.log($scope.favor);
        if(cb === true) {
            poi.timeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            $rootScope.favoriets.set(poi.poiId, poi);
            $rootScope.getLastFavorite();
        }
        else {
            $rootScope.favoriets.delete(poi.poiId);
            $rootScope.getLastFavorite();
        }
    };

    $scope.initFavorites = function (poi) {

        if($rootScope.favoriets.has(poi.poiId))
            document.getElementById("id-of-input"+poi.poiId).checked = true;
        return $rootScope.favoriets.has(poi.poiId);

    };


    $scope.sortPoi = function () {

        // $scope.poiToShow = $rootScope.poiList;
        switch ($scope.sortBy) {

            case 'Sort by category':
                $scope.poiToShow.sort(sort_by('field', false, function(a){return a.toUpperCase()}));
                break;
            case 'Sort by rank':
                $scope.poiToShow.sort(sort_by('rank', true, parseInt));
                break;
            case 'Show all':
                $scope.poiToShow = $rootScope.poiList;
                break;
            default:
                $scope.poiToShow = getPOIByCategory($scope.sortBy);

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

        for (var i = 0; i < $scope.poiToShow.length; i++) {
            if ($scope.poiToShow[i].field === sortBy)
                ans.push($scope.poiToShow[i])
        }

        return ans;
    }





});

