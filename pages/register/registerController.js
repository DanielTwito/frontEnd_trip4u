

app.controller('registerCont', function($rootScope,$scope,$location,$http) {
        $http.get($rootScope.url+"/getSecurityQuestions").then(function (response) {
            $scope.squestion = response.data;
        });




    $scope.countries = [ "Australia","Bolivia","China","Denmark","Israel","Latvia","Monaco","August","Norway","Panama","Switzerland","USA"];
    // $scope.submitForm = function() {
    //
    //     // check to make sure the form is completely valid
    //     if ($scope.userForm.$valid) {
    //         alert('our form is amazing');
    //     }
    //
    // };
    $scope.submitForm = function () {

        if ($scope.userForm.$valid) {

            var req = {
                method: 'POST',
                url: $rootScope.url + '/register',
                data: {
                    "userName": $scope.userName,
                    "password": $scope.pass,
                    "firstName": $scope.firstName,
                    "lastName": $scope.lastName,
                    "country": $scope.userCountry,
                    "city": $scope.cty,
                    "email": $scope.userEmail,
                    "field1": $scope.f1,
                    "field2": $scope.f2,
                    "qustions": [{
                        qustionId: JSON.parse($scope.q1).questionId,
                        answer: $scope.ans1
                    }
                        ,
                        {
                            qustionId: JSON.parse($scope.q2).questionId,
                            answer: $scope.ans2
                        }]

                }
            };
            console.log(req);
            $http.post(req.url, JSON.stringify(req.data)).then((res) => {
                alert("thank you please log in");
                $location.path("/login");

            });

        } else {
            alert("else");
            console.log(req);

        }

    }});