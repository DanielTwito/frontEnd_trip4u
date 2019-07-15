

app.controller('poiInfoCont', function($window,$scope,$location,$http,$rootScope) {
    $scope.poi = $rootScope.choosePoi;
          $http({
            method : "POST",
            url : $rootScope.url +"/getLastReviews",
            data: {
                poiId: $scope.poi.poiId+"",
            }

        }).then(function ok(res) {
            $scope.review_list = res.data;
        }).catch(function error (res) {
            console.log("server error!");
        });

    $http({
        method : "POST",
        url : $rootScope.url +"/incrementPOIViewsNumber",
        data: {
            poiId: $scope.poi.poiId+"",
        }

    }).then(function ok(res) {
        for(let i=0 ; i<$rootScope.poiList.length;i++){
             if($rootScope.poiList[i].poiId === $scope.poi.poiId){
                $rootScope.poiList[i].views++;
                document.getElementById("poi_views").innerHTML="Views: "+$rootScope.poiList[i].views;
                break;
            }
        }
    }).catch(function error (res) {

    });


    $scope.range = function(min, max, step){
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) input.push(i);
        return input;
    };

    $scope.sendRank = function () {
        let rank = parseInt($scope.rank);
        var date =new Date().toISOString().slice(0, 19).replace('T', ' ');

        if( rank >= 1 && rank <=5){

            if(sessionStorage.getItem("token") === null ){
                alert("you must be login to rank ")
                return;
            }
            $http({
                method : "POST",
                url : $rootScope.url +"/addRating",
                data:{
                    poiId: $scope.poi.poiId,
                    date:date,
                    rank:$scope.rank},
                headers: {
                    "authrization": sessionStorage.getItem("token")
                }

                }).then(function ok(res) {
                alert("thank you!");
            }).catch(function error (res) {
                alert("error");
            });

            $location.path( "/poiInformation");
            console.log($window.sessionStorage.getItem("token"));
            } else {
                alert("the rank must be a number between 1-5");

            }
    }

    $scope.sendReview = function () {

        let review = $scope.review;
        var date =new Date().toISOString().slice(0, 19).replace('T', ' ');
        if( review !== ""){

            if(sessionStorage.getItem("token") === null ){
                alert("you must be login to add a review")
                return;
            }
            $http({
                method : "POST",
                url : $rootScope.url +"/addReview",
                data:{
                    poiId: $scope.poi.poiId,
                    date: date,
                    review: review,
                },
                headers: {
                    "authrization": sessionStorage.getItem("token")
                }

            }).then(function ok(res) {
                alert("thank you!");
                $http({
                    method : "POST",
                    url : $rootScope.url +"/getLastReviews",
                    data: {
                        poiId: $scope.poi.poiId+"",
                    }

                }).then(function ok(res) {
                    $scope.review_list = res.data;
                }).catch(function error (res) {
                    console.log("server error!");
                });
            }).catch(function error (res) {
                alert("error");
            });

            $location.path( "/poiInformation");
            console.log($window.sessionStorage.getItem("token"));
        } else {
            alert("you must write something in the review");

        }


    };


    $scope.addToFavorites = function (poi) {

        var cb = document.getElementById("id-of-input").checked;
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

    $scope.initFavorite = function (poi) {

        if($rootScope.favoriets.has(poi.poiId))
            document.getElementById("id-of-input").checked = true;
        return $rootScope.favoriets.has(poi.poiId);

    };



});