var app = angular.module('kickwidget');

app.controller('IndexController', ['$scope', '$http', '$location', function($scope, $http, $location){

	$scope.import = function() {
		
		var fileSelector = document.createElement('input');
		fileSelector.setAttribute('type', 'file');
		var file = fileSelector.click();

		fileSelector.addEventListener('change', function(event) {
			var file = event.path[0].files[0];

		    var r = new FileReader();
		    r.onload = function(e) { 
			      var contents = e.target.result;
			      localStorage["project"] = contents;
			      debugger;
			      parent.location.hash = "rewards";

		        };		      

		    debugger;
      		r.readAsText(file);

		});
		

	};

}]);


app.controller('SearchController', ['$scope', '$http', '$kickapi', '$location', function($scope, $http, $kickapi, $location){

	$scope.searchQuery = "";

	$scope.select = function(project) {

		// We could use a service but it's so simple we'll just access it immediately
		localStorage["project"] = JSON.stringify({
			webData: project,
			kickwidget: {}
		});

		// They've selected a project, so we can get moving on		
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

app.controller('ExportController', ['$scope', '$location', function($scope, $location) {

	$scope.project = JSON.parse(localStorage["project"]);

	// We just simply back out if a project has not yet been loaded as of yet
	if(!$scope.project.webData)
		$location.path('/');

	$scope.loaded = function() {
	
		// Create a new Kickwidget and get going
		widget = new KickWidget('kickwidget-container', $scope.project);
		widget.init();
	};

	/**
	 * Starts an export operation on the users browser given the information	 
	 */
	$scope.export = function() {		
		var blob = new Blob([JSON.stringify($scope.project)],
		 {type: "application/json"});
		saveAs(blob, "project.json");
		$location.path('/');
	}

}]);

app.controller('RewardsController', ['$scope', '$location', function($scope, $location){

	project = JSON.parse(localStorage["project"])
	$scope.project = project.kickwidget;
	$scope.ksdata = project.webData;

	if(!project.webData) {
		$location.path("/search");
	}

	if(!$scope.project.rewards)
		$scope.project.rewards = [];


	$scope.remove = function(index) {
		$scope.project.rewards.splice(index, 1);
	};

	$scope.add = function() {					
		// Push the reward
		$scope.project.rewards.push({
			name: "",
			cost: "",
			shippingCost: ""
		});
	};

	$scope.done = function() {

		// Save the project to the disk
		attached = JSON.parse(localStorage["project"]);
		attached.kickwidget = $scope.project;

		localStorage["project"] = JSON.stringify(attached);

		// Move to the next step
		$location.path('/export');

	};

	$scope.change = function() {
		$location.path('/search');
	}

}]);