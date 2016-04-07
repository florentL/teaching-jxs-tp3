var pokeApp = angular.module('pokedex', ['ngResource']);

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var pokeApiUrl = "http://pokeapi.co/"

pokeApp.controller('search', ['$scope','$log','$http','apiService', function($scope, $log, $http, apiService) {
  $scope.$log = $log;
  
  apiService.getNom(function(pokemons) {
	$scope.api = pokemons;
  });

  $scope.displayInfos = function(uri, id) {
	  $scope.loading = true; 
	  if (typeof (uri) === "undefined") {
		  uri = pokeApiUrl+"api/v2/pokemon/"+id+"/";
	  }
	  
	  apiService.getSkills(uri,function(response) {
        
		$scope.infos = [
		  {"nom": "id", "value": response.id},
          {"nom": "name", "value": response.name},
          {"nom": "weight", "value": response.weight},
          {"nom": "height", "value": response.height},
          {"nom": "experience", "value": response.base_experience}
       ];
		$scope.sprite = response.sprites.front_default;

		$scope.loading = false; 
	  });
  }
  
  $scope.$watch('selectPokemon', function(value) {
	  if (typeof (value) !== "undefined") {
		  $scope.displayInfos(value, '');
	  }
  })
  
  // permet de filtrer uniquement les noms commencant par le pattern entré
  $scope.customComparator = function(actual, expected){
    return (actual.toString().toLowerCase().indexOf(expected.toString().toLowerCase()) === 0);
  }
}]).

factory('apiService', ['$resource', '$log', function(http, logger) {

	  return {
		getNom : function(callback) {
//			http(pokeApiUrl+'api/v1/pokedex/1/').get().$promise.then(function successCallback(response) {
			
			// need this because API v2 limit is 20 (by default)
			var nbPokemons = 811;
			
            // call API v2
			http(pokeApiUrl+'api/v2/pokemon/?limit='+nbPokemons).get().$promise.then(function successCallback(response) {
				
				var pokemons = response.results.map(function(e) {
                    return e;
				});
				callback(pokemons);
			  }, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
			},
		getSkills : function(uri,callback) {
//			http(':uri',{uri:'@uri'}).get({uri:uri}).$promise.then(function successCallback(response) {
			
			http(uri).get().$promise.then(function successCallback(response) {
                callback(response);
			  }, function errorCallback(response) {
                console.log("error");
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
			}
	  }
	  
 }]);
