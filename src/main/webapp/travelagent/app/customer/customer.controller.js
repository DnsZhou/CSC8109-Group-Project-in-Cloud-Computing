/*
 * JBoss, Home of Professional Open Source
 * Copyright 2014, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
    'use strict';
    angular
        .module('app.customer')
        .controller('CustomerController', CustomerController);

    CustomerController.$inject = ['$scope', '$routeParams', 'Customer', 'TravelBooking', 'messageBag'];

    function CustomerController($scope, $routeParams, Customer, TravelBooking, messageBag) {
        //Assign service to $scope variables
        $scope.customerService = Customer;
        $scope.messageService = messageBag;
        $scope.bookingService = TravelBooking;
        $scope.bookings = [];


        //Get routeParam and customer data
        var id = $routeParams.customerId;
        $scope.customerService.get(
            {customerId: id},
            //Successful query
            function(data) {
                $scope.customerService.current = data;
            },
            //Error
            function(result) {
                for(var error in result.data){
                    $scope.messages.push('danger', result.data[error]);
                }
            }
        );

        //Get bookings for customer
        $scope.bookingService.query(
            {customer: $scope.customerService.current.id},
            //Successful query
            function(data) {
                $scope.bookings = data;
            },
            //Error
            function(result) {
                for(var error in result.data){
                    $scope.messages.push('danger', result.data[error]);
                }
            }
        );

        $scope.removeBooking = function(booking) {
            console.log("Delete attempted");
            $scope.bookingService.delete(
                {bookingId: booking.id},
                //Successful query
                function(data) {
                    var idx = _.findIndex($scope.bookings, {'id': booking.id});
                    if(idx>-1){
                        $scope.bookings.splice(idx, 1);
                    }
                },
                //Error
                function(result) {
                    for(var error in result.data){
                        $scope.messages.push('danger', result.data[error]);
                    }
                }
            )
        }
    }
})();