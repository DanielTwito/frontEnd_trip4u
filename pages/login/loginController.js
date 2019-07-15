app.controller('loginCont', function($rootScope,$scope,$location,$http) {

    var sortBy = function(field, reverse, primer){

        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    };


    $rootScope.getRec = function() {

        var tmpfield1 = [];
        var tmpfield2 = [];
        var field1;
        var field2;
        $http({
            method : "POST",
            url : $rootScope.url +"/getUserFavoriteFields",
            data: {},
            headers: {
                "authrization": sessionStorage.getItem("token")
            }

        }).then(function ok(res) {
            field1=res.data[0]['field1'];
            field2=res.data[0]['field2'];
            for (let i=0;i<$rootScope.poiList.length;i++){
                if($rootScope.poiList[i]["field"] === field1 ){
                    tmpfield1.push($rootScope.poiList[i]);
                }else if ( $rootScope.poiList[i]["field"] === field2 ){
                    tmpfield2.push($rootScope.poiList[i]);
                }
            }

            tmpfield1.sort(sortBy('rank', true, parseInt));
            tmpfield2.sort(sortBy('rank', true, parseInt));

            var ans=[];
            if(tmpfield1.length!==0) {
                ans.push(tmpfield1[0]);

            }
            if(tmpfield2.length!==0){
                ans.push(tmpfield2[0]);
            }
            if(tmpfield1.length > 1) {
                ans.push(tmpfield1[1]);

            }
            else if(tmpfield2.length >1 ){
                ans.push(tmpfield2[1]);
            }



            $rootScope.rec = ans;
        }).catch(function error (res) {
            console.log("error!")
        });

    }





    $rootScope.getLastFavorite = function(){

        $rootScope.fav = [];

        let tmp = [...$rootScope.favoriets.values()];
        tmp.sort(sortBy('timeStamp', true, function(a){return a.toUpperCase()}));
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




    $scope.forget = function(){

      let userName  = prompt("please enter youre user name?");
        var req = {
            method: 'POST',
            url: $rootScope.url+'/getUserSecurityQuestions',
            data:{
                "userName": userName
            }
        };
        $http.post(req.url, JSON.stringify(req.data)).then((res) => {
            let qLentgh =res.data.length;
            let x = Math.floor((Math.random() * qLentgh));
            let q = res.data[x];
            var ans = prompt(q.questionContent);
            if ( ans === q.answer){
               $scope.getUserPassword(userName,q.questionId,ans);
            }else{
                alert("Wrong answer!");

            }


        }).catch((res)=>{
            alert("wrong User Name");
        });

    };


    $scope.getUserPassword = async function(username,qid,ans){
        var req = {
            method: 'POST',
            url: $rootScope.url+'/restorePassword',
            data:{
                "userName": username,
                "questionId":qid,
                "answer":ans
            }
        };
        $http.post(req.url, JSON.stringify(req.data)).then((res) => {
            let y = res.data.password;
            alert("your password: "+y);

        }).catch((res)=>{
            alert("ERROR");
        });

    }

    $scope.login = function () {

        if ($scope.userForm.$valid) {

            var req = {
                method: 'POST',
                url: $rootScope.url+'/login',
                data:{
                    "userName": $scope.uname,
                    "password":$scope.pss
                }
            };

            $http.post(req.url, JSON.stringify(req.data)).then((res) => {

                sessionStorage.setItem("token", res.data);
                $rootScope.logUser = $scope.uname;
                $http({
                    method : "POST",
                    url : $rootScope.url +"/getUserFavoritePOI",
                    data: {},
                    headers: {
                        "authrization": sessionStorage.getItem("token")
                    }

                }).then(function ok(res) {
                    if(res.response)
                        $scope.favoriteList = [];
                    else
                        $scope.favoriteList = res.data;
                    $rootScope.favoriets = new Map();

                    for (let i = 0; i < $scope.favoriteList.length; i++) {
                        $rootScope.favoriets.set($scope.favoriteList[i].poiId, $scope.favoriteList[i]);

                    }
                    $rootScope.logged=true;
                    $scope.getLastFavorite();
                    $scope.getRec();
                    $rootScope.sortOptions = $rootScope.fields.field;
                    $rootScope.sortOptions.unshift('Sort by category', 'Sort by rank', 'Show all');
                }).catch(function error (res) {
                    alert("error");
                });

                $location.path('/home');



            }).catch((res)=>{
                alert(res.data);
            });

        }
        else{
                alert("must field all fields");
        }

    }});