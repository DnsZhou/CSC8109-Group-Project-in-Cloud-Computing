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
        .module('app.travel-booking')
        .controller('TravelBookingFormController', TravelBookingFormController);

    TravelBookingFormController.$inject = ['$scope', 'TravelBooking', 'Customer', 'messageBag', '$http'];

    function TravelBookingFormController($scope, TravelBooking, Customer, messageBag, $http) {
        //Assign service to $scope variables
        $scope.bookingService = TravelBooking;
        $scope.customerService = Customer;
        $scope.messageService = messageBag;

        //Load customers and external resources
        $scope.customerService.data = Customer.query();

        $scope.taxis = [];
        $scope.hotels = [];
        $scope.flights = [];


        //** NOTE **
        //You should edit the parameter of the $http.get(...) function calls to specify the URL structure to return
        // Commodity entities from your TravelAgent API

        // EDIT ==>

//        $http.get('api/travel/taxis')
//            .success(function(data) {
//                $scope.taxis = data;
//            })
//            .error(function() {
//                $scope.messageService.push('danger', '/taxis resource unavailable');
//            });
//        $http.get('api/travel/hotels')
//            .success(function(data) {
//                $scope.hotels = data;
//            })
//            .error(function() {
//                    $scope.messageService.push('danger', '/hotels resource unavailable');
//            });
//        $http.get('api/travel/flights')
//            .success(function(data) {
//                $scope.flights = data;
//            })
//            .error(function() {
//                $scope.messageService.push('danger', '/flights resource unavailable');
//            });

        // <== EDIT

        //Get today's date for the bookingDate form value min
        $scope.date = Date.now();

        $scope.booking = {};
        // Define an addBooking() function, which creates a new booking via the REST service,
        // using those details provided and displaying any error messages
        $scope.addBooking = function() {
            $scope.messageService.clear();

            $scope.bookingService.save($scope.booking,
                //Successful query
                function(data) {

                    // Update the list of bookings
                    $scope.bookingService.data.push(data);

                    // Clear the form
                    $scope.reset();

                    //Add success message
                    $scope.messageService.push('success', 'Booking made');
                    //Error
                }, function(result) {
                    for(var error in result.data){
                        $scope.messageService.push('danger', result.data[error]);
                    }
                }
            );

        };

    }
})();