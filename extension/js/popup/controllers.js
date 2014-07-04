angular.module('ld.main', [])
    .value('baseUrl', 'http://localhost:3000')
    .controller('MainController', ['$scope', '$http', '$location', '$log', 'baseUrl',
        function(scope, http, loc, log, baseUrl) {
            
        }
    ])
    .controller('SignInController', ['$scope', '$http', '$location', '$log', 'baseUrl',
        function(scope, http, loc, log, baseUrl) {
            scope.username = "";
            scope.password = "";

            scope.submit = function(username) {
                // Get PBKDF2 parameters
                http({
                    method: 'GET',
                    url: baseUrl + '/signin',
                    params: {
                        username: scope.username
                    }
                })
                    .success(function(pbkdf2Opts, status, headers, config) {
                        var hash = sjcl.misc.pbkdf2(scope.password, sjcl.codec.base64.toBits(pbkdf2Opts.salt), pbkdf2Opts.itr, pbkdf2Opts.keyLength);
                        hash = sjcl.codec.base64.fromBits(hash);

                        // Send hashed password and username for authentication
                        http({
                            method: 'POST',
                            url: baseUrl + '/signin',
                            data: {
                                username: scope.username,
                                clientHash: hash
                            }
                        })
                            .success(function(data) {
                                log.log('GOOD', arguments);
                                scope.signin.$setValidity('info', true);
                                loc.path('/');
                            })
                            .error(function(data, status, headers, config) {
                                log.log('BAD', arguments);
                                scope.signin.$setValidity('info', false);
                            });
                    })
                    .error(function(data, status, headers, config) {
                        log.log(arguments);
                        scope.signin.$setValidity('info', false);
                    });
            };
        }
    ])
    .controller('SignUpController', ['$scope', '$http', '$location', '$log', 'baseUrl',
        function(scope, http, loc, log, baseUrl) {
            scope.email = "";
            scope.username = "";
            scope.password = "";

            scope.submit = function() {
                var pbkdf2Opts = {
                    email: scope.email,
                    username: scope.username,
                    // Each "word" is 4 bytes, so 8 would be 32 bytes
                    salt: sjcl.random.randomWords(8),
                    iter: 1000,
                    keyLength: 512,
                    clientHash: null,
                };

                var hash = sjcl.misc.pbkdf2(scope.password, pbkdf2Opts.salt, pbkdf2Opts.itr, pbkdf2Opts.keyLength);
                pbkdf2Opts.clientHash = sjcl.codec.base64.fromBits(hash);

                // Use base64 for easy storage of the salt
                pbkdf2Opts.salt = sjcl.codec.base64.fromBits(pbkdf2Opts.salt);

                log.log(pbkdf2Opts);

                http({
                    method: 'POST',
                    url: baseUrl + '/users',
                    data: pbkdf2Opts
                })
                    .success(function(data, status, headers, config) {
                        log.log(arguments);
                    })
                    .error(function(data, status, headers, config) {
                        log.log(arguments);
                        scope.signin.$setValidity('info', false);
                    });
            };
        }
    ]);

var lockdown = angular.module('lockdown', ['ngRoute', 'ngAnimate', 'ld.main'])
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
                redirectTo: '/signin'
            });
        }
    ]);
