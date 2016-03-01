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
  

  $scope.displayInfos = function(uri) {
	  apiService.getSkills(uri,function(response) {
        
		$scope.infos = [
          //{"nom": "name", "value": response.name},
          //{"nom": "id", "value": response.pkdx_id},
          //{"nom": "attack", "value": response.attack},
          //{"nom": "defense", "value": response.defense}
       ];
	  });
  
  }
  
  $scope.customComparator = function(actual, expected){
    return (actual.toString().toLowerCase().indexOf(expected.toString().toLowerCase()) === 0);
  }
}]).
factory('apiService', ['$resource', '$log', function(http, logger) {

	  return {
		getNom : function(callback) {
//			http(pokeApiUrl+'api/v1/pokedex/1/').get().$promise.then(function successCallback(response) {

            // call API v2
			http(pokeApiUrl+'api/v2/pokemon/').query().$promise.then(function successCallback(response) {
				console.log(response);
				//console.log(response.pokemon);
				var pokemons = response.map(function(e) {
                    return e;
				});
				callback(pokemons);
			  }, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
			},
		getSkills : function(uri,callback) {
            // FIX
			http(':uri',{uri:'@uri'}).query({uri:uri}).$promise.then(function successCallback(response) {
				console.log(response.attack);
                callback(response);
			  }, function errorCallback(response) {
                console.log("error");
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			  });
			}
	  }
	  
 }]);
