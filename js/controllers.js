var app = angular.module('kickwidget');

app.controller('IndexController', ['$scope', '$http', function($scope, $http){

	$scope.doSomething = function() {
		alert("!");
	};

}]);


app.controller('SearchController', ['$scope', '$http', function($scope, $http){

}]);

app.controller('RewardController', ['$scope', '$http', function($scope, $http){

}]);