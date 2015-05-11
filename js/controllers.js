var app = angular.module('kickwidget');

app.controller('IndexController', ['$scope', '$http', function($scope, $http){

	$scope.doSomething = function() {
		alert("!");
	};

}]);

app.controller('RewardsController', ['$scope', '$http', function($scope, $http){

	$scope.doSomething = function() {
		alert("!");
	};

}]);


app.controller('SearchController', ['$scope', '$http', '$kickapi', '$location', function($scope, $http, $kickapi, $location){

	$scope.searchQuery = "";

	$scope.select = function(project) {
		// They've selected a project, so we can get moving on
		alert(project.name);
		$location.path('/rewards');
	};

	/**
	 * Performs an AngularJS query and tries to populate the fields here so we can render the stuff that is required
	 * @return {[type]} [description]
	 */
	$scope.search = function() {		
		$kickapi.searchForProject($scope.searchQuery, function(result) {
			if(result.err > -1) {
				alert("Proxy failed to return results");
				return;
			}

			// We have data, so what should we do with it?
			$scope.results = result;

			// Let's try and fetch the rewards if we can, if not; no big deal then
			
			result.projects.forEach(function(project) {
				
				// Fetch the rewards as we can, update as we do so
				$kickapi.getRewardsForId(project.id, project.slug, function(rewardData) {
					if(rewardData.err > -1) {
						return;
					}					
					project.rewards = rewardData.rewards;
					console.log(project);
				});
			});


		});
	};



}]);

app.controller('RewardController', ['$scope', '$http', function($scope, $http){

}]);