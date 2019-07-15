

app.controller('homeCont', function($rootScope,$scope,$http,$location) {


    var sortBy = function(field, reverse, primer){

        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    };



    $scope.getLastFavorites = function(){
        if(logged===false)
            return;
        $rootScope.fav = [];

        let tmp = [...$rootScope.favoriets.values()];
        tmp.sort(sortBy('timeStamp', true, function(a){return a.toUpperCase()}));
        console.log(tmp);
        if(tmp.length>=2) {
            $rootScope.fav.push(tmp[0]);
            $rootScope.fav.push(tmp[1]);
            return;
        }
        if(tmp.length===1) {
            $rootScope.fav.push(tmp[0]);
            return;
        }


    };

    // var interval = setInterval($scope.getLastFavorite,100);

    $http({
        method : "GET",
        url : $rootScope.url +"/getPopularPOIbyRating",
        params: {rank:4,amount:3},

    }).then(function ok(res) {
        if($rootScope.logged === false) {
            $rootScope.rec = res.data;
        }
    }).catch(function error (res) {
        alert("error");
    });


    $scope.showPOIDetails = function (poiId) {

        // move to poi presentation page
        $rootScope.choosePoi = poiId;
        $location.path( "/poiInformation");

    };

    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };


});


