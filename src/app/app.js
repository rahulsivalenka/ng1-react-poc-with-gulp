import angular from 'angular';
import registerComponents from '../react/app';

// class AppController {
//   constructor() {
//     this.message = 'Hello from Angular!!';
//   }
// }

let app = angular.module('app', []);

registerComponents(app);

app.controller('AppController', ['$scope', function($scope) {
  $scope.message = 'Hello from Angular!!';
  $scope.count = 25;
  $scope.toggleReactComponent = () => {
    $scope.showReactComponent = !$scope.showReactComponent;
  }
  $scope.increment = () => {
    console.log('inc called')
    $scope.count++;
    $scope.$apply();
  }
  $scope.decrement = () => {
    console.log('dec called')
    $scope.count--;
    $scope.$apply();
  }
}]);
