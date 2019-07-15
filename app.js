
let app = angular.module('myApp', ["ngRoute"]);

app.controller('myCtrl', function($location,$rootScope,$scope,$http) {

    $rootScope.url = "http://localhost:3000";

    $http.get($rootScope.url + "/getAllPOI").then(function (response) {
        $rootScope.poiList = response.data;
    });

    $http.get($rootScope.url+"/getAllFields").then(function (response) {
        $rootScope.fields = response.data;
    });
    $scope.myinit = function () {
        $rootScope.logged=false;
        $rootScope.logUser = "Guest";
        document.getElementById("logout").addEventListener('click',(event)=>{
            $rootScope.logged=false;
            $rootScope.logUser = "Guest";
            console.log("logout",$rootScope.logged,$rootScope.logUser);
        });

        $http.get($rootScope.url + "/getAllPOI").then(function (response) {
            $rootScope.poiList = response.data;
        });
    };


});


// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            // this is a template
            templateUrl: 'pages/home/home.html',
        })
        // about
        .when('/about', {
            // this is a template url
            templateUrl: 'pages/about/about.html',
        })
        // poi
        .when('/speakers', {
            templateUrl: 'pages/speakers/speakers.html',
        })
        .when('/register', {
            templateUrl: 'pages/register/register.html',
        })
        .when('/login', {
            templateUrl: 'pages/login/login.html',
        })
        .when('/poi', {
            templateUrl: 'pages/pointsofinterest/pointsofinterest.html',
        })
        .when('/favorites', {
            templateUrl: 'pages/favorites/favorites.html',
        })
        .when('/poiInformation', {
            templateUrl: 'pages/poiInformation/poiInformation.html',
        })
        // other
        .otherwise({ redirectTo: '/' });
});

