angular.module('ld.navbar', [])
    .controller('NavbarRoute', ['$scope', '$location', '$log',
        function(scope, loc, log) {
            scope.isAt = function(where) {
                log.log(where, loc.path());
                return where === loc.path();
            };
        }
    ]);

angular.module('ld.main', [])
    .value('baseUrl', 'http://localhost:3000')
    .controller('SignInController', ['$scope', '$http','$log', 'baseUrl',
        function(scope, http, log, baseUrl) {
            scope.username = "";
            scope.password = "";

            scope.submit = function(username) {
                http({
                    method: 'GET',
                    url: baseUrl + '/signin',
                    params: {
                        username: scope.username
                    }
                })
                    .success(function(data, status, headers, config) {
                        log.log(arguments);
                    })
                    .error(function(data, status, headers, config) {
                        log.log(arguments);
                    });
            };
        }
    ])
    .controller('SignUpController', ['$scope', '$http', '$log', 'baseUrl',
        function(scope, http, log, baseUrl) {
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
                    hash: null,
                };

                var hash = sjcl.misc.pbkdf2(scope.password, pbkdf2Opts.salt, pbkdf2Opts.itr, pbkdf2Opts.keyLength);
                pbkdf2Opts.hash = sjcl.codec.base64.fromBits(hash);

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
                    });
            };
        }
    ]);

var lockdown = angular.module('lockdown', ['ngRoute', 'ngAnimate', 'ld.navbar', 'ld.main'])
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
