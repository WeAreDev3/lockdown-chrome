angular.module('ld.navbar', [])
    .controller('NavbarRoute', ['$scope', '$location', '$log',
        function(self, loc, log) {
            self.isAt = function(where) {
                log.log(where, loc.path());
                return where === loc.path();
            };
        }
    ]);

angular.module('ld.main', [])
    .controller('SignInController', ['$scope', '$log',
        function(self, log) {
            self.username = "";
            self.password = "";

            var getCreds = function(username) {
                http({
                    method: 'GET',
                    url: '/signin',
                    params: {
                        username: username
                    }
                })
                    .success(function(data, status, headers, config) {
                        log.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        log.log(data);
                    });
            };
        }
    ])
    .controller('SignUpController', ['$scope', '$http', '$log',
        function(self, http, log) {
            self.email = "";
            self.username = "";
            self.password = "";

            self.submit = function() {
                // Ecrypt and http POST to /users
            };
        }
    ]);

var lockdown = angular.module('lockdown', ['ngRoute', 'ld.navbar', 'ld.main'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/signin', {
                templateUrl: 'partials/signin.html',
                controller: 'SignInController'
            });
            $routeProvider.when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignUpController'
            });
            $routeProvider.otherwise({
                redirectTo: '/signup'
            });
        }
    ]);
