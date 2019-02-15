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
        .controller('CustomerFormController', CustomerFormController);

    CustomerFormController.$inject = ['$scope', '$routeParams', 'Customer', 'messageBag'];

    function CustomerFormController($scope, $routeParams, Customer, messageBag) {
        //Assign service to $scope variables
        $scope.customerService = Customer;
        $scope.messageService = messageBag;
        $scope.customer = {};
        $scope.create = true;
        //If $routeParams has :contactId then load the specified contact, and display edit controls on contactForm
        if($routeParams.hasOwnProperty('customerId')) {
            $scope.customer = $scope.customerService.current;
            $scope.create = false;
        }

        // Define a reset function, that clears the prototype new Customer object, and
        // consequently, the form
        $scope.reset = function() {
            // Sets the form to it's pristine state
            if($scope.customerForm) {
                $scope.customerForm.$setPristine();
            }

            // Clear input fields. If $scope.customer was set to an empty object {},
            // then invalid form values would not be reset.
            // By specifying all properties, input fields with invalid values are also reset.
            $scope.customer = {name: "", phoneNumber: "", email: ""};

            // clear messages
            $scope.messageService.clear();
        };

        // Define an addCustomer() function, which creates a new customer via the REST service,
        // using those details provided and displaying any error messages
        $scope.addCustomer = function() {
            $scope.messageService.clear();

            $scope.customerService.save($scope.customer,
                //Successful query
                function(data) {

                    // Update the list of customers
                    $scope.customerService.data.push(data);

                    // Clear the form
                    $scope.reset();

                    //Add success message
                    $scope.messageService.push('success', 'Customer added');
                    //Error
                }, function(result) {
                    for(var error in result.data){
                        $scope.messages.push('danger', result.data[error]);
                    }
                }
            );

        };

        // Define a saveCustomer() function, which saves the current customer using the REST service
        // and displays any error messages
        $scope.saveCustomer = function() {
            $scope.messageService.clear();
            $scope.customer.$update(
                //Successful query
                function(data) {
                    //Find the customer locally by id and update it
                    var idx = _.findIndex($scope.customerService.data, {'id': $scope.customer.id});
                    $scope.customerService.data[idx] = data;
                    //Add success message
                    $scope.messageService.push('success', 'Customer saved');
                    //Error
                }, function(result) {
                    for(var error in result.data){
                        $scope.messages.push('danger', result.data[error]);
                    }
                }
            )
        };
    }
})();