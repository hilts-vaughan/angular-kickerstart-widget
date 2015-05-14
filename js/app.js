var app = angular.module('kickwidget', ['ngRoute', 'angular.kickstarter']);
 
app.value('widget-version', '0.0.1')
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'IndexController',
      templateUrl:'templates/index.html'
      }
    )
    .when('/search', {
      controller: 'SearchController',
      templateUrl: 'templates/search.html'
    })

    .when('/rewards', {
      controller: 'RewardsController',
      templateUrl: 'templates/rewards.html'
    })    

    .when('/export', {
        controller: 'ExportController',
        templateUrl: 'templates/export.html'
    })

    .when('/about', {
      controller: null,
      templateUrl: 'templates/about.html'
    })

    .otherwise({
      redirectTo:'/'
    });
});

