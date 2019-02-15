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
(function () {
    'use strict';

    angular
        .module('app.customer')
        .controller('CustomerListController', CustomerListController);

    CustomerListController.$inject = ['$scope', '$filter', 'Customer', 'messageBag'];

    /**
     * Description of File
     * @author hugofirth
     * @constructor
     */
    function CustomerListController($scope, $filter, Customer, messageBag) {
        //Assign service to $scope variables
        $scope.customerService = Customer;
        $scope.messageService = messageBag;

        //Divide contact list into several sub lists according to the first character of their name property
        var getHeadings = function(customers) {
            var headings = {};
            for(var i = 0; i<customers.length; i++) {
                //Get the first letter of a customer's firstName
                var startsWithLetter = customers[i].name.charAt(0).toUpperCase();
                //If we have encountered that first letter before then add the customer to that list, else create it
                if(headings.hasOwnProperty(startsWithLetter)) {
                    headings[startsWithLetter].push(customers[i]);
                } else {
                    headings[startsWithLetter] = [customers[i]];
                }
            }
            return headings;
        };

        //Get customers
        $scope.customerService.query(
            //Successful query
            function(data) {
                $scope.customerService.data = data;
                $scope.customers = getHeadings($scope.customerService.data);
                //Keep the contacts list headings in sync with the underlying customers
                $scope.$watchCollection('customerService.data', function(newCustomers, oldCustomers) {
                    $scope.customers = getHeadings(newCustomers);
                });
            },
            //Error
            function(result) {
                for(var error in result.data){
                    $scope.messages.push('danger', result.data[error]);
                }
            }
        );

        //Boolean flag representing whether the details of the contacts are expanded inline
        $scope.details = false;

        //Default search string
        $scope.search = "";

        //Continuously filter the content of the customers list according to the contents of $scope.search
        $scope.$watch('search', function(newValue, oldValue) {
            $scope.customers = getHeadings($filter('filter')($scope.customerService.data, $scope.search));
        });
    }

})();
