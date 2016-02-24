var pokeApp = angular.module('pokedex', ['ngResource']);

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var pokeApiUrl = "http://pokeapi.co/"

pokeApp.controller('search', ['$scope','$log','$http','apiService', function($scope, $log, $http, apiService) {
	$scope.$log = $log;
  $scope.pokemon = [
  {"id": 1,"nom": 'Pikachu'},
  {"id": 2,"nom": 'Salamèche'},
  {"id": 3,"nom": 'Carapuce'},
  ];
  
  apiService.getNom(function(pokemons) {
	$scope.api = pokemons;
  });
  

  $scope.displayInfos = function(id) {
	  apiService.getSkills(id,function(response) {
		$scope.infos = response;
	  });
  
  }
  
  $scope.customComparator = function(actual, expected){
    return (actual.toString().toLowerCase().indexOf(expected.toString().toLowerCase()) === 0);
  }
}]).
factory('apiService', ['$resource', '$log', function(http, logger) {

	  return {
		getNom : function(callback) {
			http(pokeApiUrl+'api/v1/pokedex/1/').get().$promise.then(function successCallback(response) {
				console.log(response.pokemon);
				var pokemons = response.pokemon.map(function(e) {
					return e.name;
				});
				callback(pokemons);
			  }, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
			},
		getSkills : function(id,callback) {
			http(pokeApiUrl+'api/v1/pokemon/:id/',{id:'@id'}).get({id:id}).$promise.then(function successCallback(response) {
				console.log(response.attack);
				/*var pokemons = response.pokemon.map(function(e) {
					return e.name;
				});*/
				callback(response.attack);
			  }, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
			}
	  }
	  
 }]);