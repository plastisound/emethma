(function(){
	var app = angular.module('emethma',[]);
	app.controller('ExampleController', function($scope, $http) {
		$scope.master = {};
		$scope._ciudad = [];
		$scope.terms = false;
		$http({
	        method: 'GET',
	        url: '/api/getEstados',
	        data: { }
		}).success(function (result) {
		    $scope._ciudad = result;
		});

		$scope._banco = [];
		$http({
	        method: 'GET',
	        url: '/api/getBancos',
	        data: { }
		}).success(function (result) {
		    $scope._banco = result;
		});

		$scope.update = function(user) {
			$scope.master = angular.copy(user);
			//if($scope.frmCreateUser.$valid){
				$http({
			        method: 'POST',
			        url: '/api/createUser',
			        params: $scope.master
				}).success(function (result) {
					if(result){
						$scope.user = [];
						$('#btnRedraw').click();
						$scope.frmCreateUser.$setUntouched();
						$scope.frmCreateUser.$setPristine();
					}
				});
			/*
			} else {
				console.log('NO VALIDO CARNAL');
			}
			*/
		};

		$scope.register = function(user) {
			$scope.master = angular.copy(user);
			if($scope.frmCreateUser.$valid){
				$http({
			        method: 'POST',
			        url: '/api/createUser',
			        params: $scope.master
				}).success(function (result) {
					if(result){
						//$scope.user = [];
						//$scope.frmCreateUser.$setUntouched();
						//$scope.frmCreateUser.$setPristine();
						$scope.user.idNew = result['id'];
						$('#idNew').val(result['id']);
						$('#idNew').trigger('change'); // Esto hace Login
					}
				});
			} else {
				console.log('NO VALIDO CARNAL');
			}
		};

		$scope.resetUser = function(){
			var directo_id = $scope.user.directo_id;
			var parentId = $scope.user.parentId;
			// Assignment
			$scope.user = angular.copy($scope.master);
			// Reassignment
			$scope.user['directo_id'] = directo_id;
			$scope.user['parentId'] = parentId;
			// Get Directo
		    $http({
		        method: 'GET',
		        url: '/api/getUser',
		        params: { id:$scope.user.directo_id }
			}).success(function (result) { 
				$scope.directo = result;
			});
			// Get Parent
		    $http({
		        method: 'GET',
		        url: '/api/getUser',
		        params: { id:$scope.user.parentId }
			}).success(function (result) { 
				$scope.asignado = result;
			});
		};

		$scope.removeUser = function(user){
			$http({
		        method: 'POST',
		        url: '/api/removeUser',
		        params: { id:user.id }
			}).success(function (result) { 
				console.log(result);
				$scope.user = [];
				$('#btnRedraw').click();
			});
		};

		$scope.getUser = function(user){
			$http({
		        method: 'GET',
		        url: '/api/getUser',
		        params: { id:user.directo_id }
			}).success(function (r1) { 
				$scope.frmCreateUser.$setUntouched();
				$scope.frmCreateUser.$setPristine();
			    $scope.user = r1;
			    if(!$scope.user.directo_id) $scope.user.directo_id = user.directo_id;
			    if(user.parentId) $scope.user.parentId = user.parentId;
			    // Get Directo
			    $http({
			        method: 'GET',
			        url: '/api/getUser',
			        params: { id:$scope.user.directo_id }
				}).success(function (result) { 
					$scope.directo = result;
				});
				// Get Parent
			    $http({
			        method: 'GET',
			        url: '/api/getUser',
			        params: { id:$scope.user.parentId }
				}).success(function (result) { 
					$scope.asignado = result;
					$('#ciudad_origen').val(result.ciudad_origen-1);
					$('#cp').val(result.cp);
					//$('#ciudad_origen option[value="'+result.ciudad_origen+'"]').attr("selected", "selected");
				});
			});
		}

		$scope.clean = function(){
			$scope.frmCreateUser.$setUntouched();
			$scope.frmCreateUser.$setPristine();
			$scope.user = [];
		};

		$scope.reset = function() {
			$scope.user = angular.copy($scope.master);
		};

		$scope.reset();
    });

    var compareTo = function() {
	    return {
	        require: "ngModel",
	        scope: {
	            otherModelValue: "=compareTo"
	        },
	        link: function(scope, element, attributes, ngModel) {
	             
	            ngModel.$validators.compareTo = function(modelValue) {
	                return modelValue == scope.otherModelValue;
	            };
	 
	            scope.$watch("otherModelValue", function() {
	                ngModel.$validate();
	            });
	        }
	    };
	};
	 
	app.directive("compareTo", compareTo);

})();