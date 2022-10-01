// // (function() {
import angular from 'angular';
import React from 'react';
import { react2angular, ReactComp } from '../react/app';

console.log('angular', angular);
console.log('react', React, ReactComp, react2angular);

// class AppController {
//   constructor() {
//     this.message = 'Hello from Angular!!';
//   }
// }

let app = angular.module('app', []);

console.log({app});
app.component('reactComp', react2angular(ReactComp, ['count', 'onInc', 'onDec']));

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

// app.controller('AppController', AppController);
// alert('hello from app.js');
