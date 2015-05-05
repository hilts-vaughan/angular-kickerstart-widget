var app = angular.module('kickwidget', ['ngRoute']);
 
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

    .otherwise({
      redirectTo:'/'
    });
});