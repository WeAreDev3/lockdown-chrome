angular.module('ld.main', [])
    .value('baseUrl', 'http://localhost:3000')
    .value('hashOpts', {
        iterations: 5000,
        keyLength: 512
    }).factory('pbkdf2', ['hashOpts',
        function(hashOpts) {
            return function(password, salt) {
                var hash = sjcl.misc.pbkdf2(password, salt, hashOpts.iterations, hashOpts.keyLength);

                return sjcl.codec.base64.fromBits(hash);
            };
        }
    ])
    .controller('MainController', ['$scope', '$http', '$location', '$log', 'baseUrl',
        function(scope, http, loc, log, baseUrl) {
            var user = localStorage.getItem('user');

            if (!user) {
                return loc.path('/signin');
            }
            console.log('Found user', JSON.parse(user));

            scope.user = JSON.parse(user);
        }
    ])
    .controller('SignInController', ['$scope', '$http', '$location', '$log', 'baseUrl', 'pbkdf2',
        function(scope, http, loc, log, baseUrl, pbkdf2) {
            scope.username = "";
            scope.password = "";
            scope.message = "";

            scope.submit = function() {
                var hash = pbkdf2(scope.password, sjcl.hash.sha256.hash(scope.username.toLowerCase()));

                // Send username and hashed password for authentication
                http({
                    method: 'POST',
                    url: baseUrl + '/signin',
                    data: {
                        username: scope.username,
                        clientHash: hash
                    }
                }).success(function(data) {
                    log.log('GOOD', arguments);

                    scope.message = '';
                    scope.signin.$setValidity('info', true);

                    localStorage.setItem('user', JSON.stringify(data));
                    loc.path('/');
                }).error(function(data) {
                    log.log('BAD', arguments);

                    scope.message = data.message;
                    scope.signin.$setValidity('info', false);
                });
            };
        }
    ])
    .controller('SignUpController', ['$scope', '$http', '$location', '$log', 'baseUrl', 'pbkdf2',
        function(scope, http, loc, log, baseUrl, pbkdf2) {
            scope.email = "";
            scope.username = "";
            scope.password = "";

            scope.submit = function() {
                var hash = pbkdf2(scope.password, sjcl.hash.sha256.hash(scope.username.toLowerCase()));

                http({
                    method: 'POST',
                    url: baseUrl + '/users',
                    data: {
                        email: scope.email,
                        username: scope.username,
                        clientHash: hash
                    }
                }).success(function(data, status, headers, config) {
                    log.log(arguments);
                    scope.signup.$setValidity('info', true);
                }).error(function(data, status, headers, config) {
                    log.log(arguments);
                    scope.signup.$setValidity('info', false);
                });
            };
        }
    ]);

var lockdown = angular.module('lockdown', ['ngRoute', 'ngAnimate', 'ld.main'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'partials/main.html',
                controller: 'MainController'
            });
            $routeProvider.when('/signin', {
                templateUrl: 'partials/signin.html',
                controller: 'SignInController'
            });
            $routeProvider.when('/signup', {
                templateUrl: 'partials/signup.html',
                controller: 'SignUpController'
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
        }
    ]);
