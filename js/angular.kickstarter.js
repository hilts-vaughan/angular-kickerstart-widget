/**
 *  This is an AngularjS service module to help load data from Kickstarter as needed.
 *  This APIs used are not official and these means should not be relied on for any serious application.
 *
 *  Author: Vaughan Hilts <2015>
 */

var module = angular.module('angular.kickstarter', []);

module.service('$kickapi', function($http){
    
      var KICKSTARTER_URL = "https://www.kickstarter.com/projects/";

      /**
       * Searches the Kickstarter database and unoffical API for some projects and returns some data pertaining to them according to a spec.
       * @return The callback is invoked with a JSON object with a 'projects' as a property or with an 'err' code attached instead
       */
      this.searchForProject = function(query, callback) {

          // Execute the query  
          that = this;
          $http.get(this._getProxyUrl('https://www.kickstarter.com/projects/search.json?search=&term=' + query)).
          success(function(data, status, headers, config) {              
              var result = that._parseSearchResponse(data);
              callback({projects: result});
          }).
          error(function(data, status, headers, config) {
            callback({err: status})
          });
      };

      this._getProxyUrl = function(url) {
        ret = "http://kickstarter-proxy.herokuapp.com/"+ url;
        return ret;
      }

      this._parseSearchResponse = function(response) {

        var projects = [];

        // For each project, extract the data we need for the API
        response.projects.forEach(function(project) {
          var newProject = {};
          newProject.name = project.name;
          newProject.description = project.blurb; 
          newProject.id = project.id;
          newProject.country = project.country;
          newProject.slug = project.slug;

          // Get a visual photo
          newProject.photo = project.photo.full;

          // Get rid of the 'rewards' at the end so we can have a normal URL to work with
          newProject.url = project.urls.web.rewards.replace("/rewards", "");

          projects.push(newProject);

        });

        return projects;

      };


      /**
       * Given the id and slug of a project, generates a collection of rewards 
       * @param  number id   The ID of the project being retrieved
       * @param  string slug A unique string ID for the project
       * @param  function    The callback to be invoked when we are ready
       * @return object      An object with either an 'err' property, or a rewards a collection
       */
      this.getRewardsForId = function(id, slug, callback) {

        that = this;
        $http.get(this._getProxyUrl(KICKSTARTER_URL + id + '/' + slug + '/rewards')).
          success(function(data, status, headers, config) {
              var rewards = that._parseRewardResponse(data);
              callback({'rewards': rewards})
          }).
          error(function(data, status) {
            callback({err: status})
          });

      };


      /**
       * Parses an HTML response of rewards from the Kickstarter site and generates some reward listings
       * @param  {string} response The HTML return type of the string
       * @return {Array}          A collection of rewards
       */
      this._parseRewardResponse = function(html) {

        var rewardSelectors = $(html).find('.NS_backer_rewards__reward');
        var rewards = [];

        rewardSelectors.each(function(index, rewardElement) {
          var reward = {};
          reward.amount =  $(rewardElement).find(".mb1").text().replace(/^\s+|\s+$/g,'');
          reward.description = $(rewardElement).find(".desc").text();
  
          rewards.push(reward);
        });

        return rewards;
      };

});
