// // (function() {
import angular from 'angular';

console.log('angular', angular);

// class AppController {
//   constructor() {
//     this.message = 'Hello from Angular!!';
//   }
// }

let app = angular.module('app', []);

console.log({app});
  
app.controller('AppController', ['$scope', function($scope) {
  $scope.message = 'Hello from Angular!!';
}]);

// app.controller('AppController', AppController);
// alert('hello from app.js');
