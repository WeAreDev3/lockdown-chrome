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
    .controller('SignInController', ['$scope', '$log', 'baseUrl',
        function(scope, log) {
            scope.username = "";
            scope.password = "";

            var getCreds = function(username) {
                http({
                    method: 'GET',
                    url: scope.baseUrl + '/signin',
                    params: {
                        username: username
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
                // 32 bits = 4 bytes, 8 * 4 bytes = 32 byte long salt
                var salt = new Int32Array(8);
                window.crypto.getRandomValues(salt);

                var pbkdf2Opts = {
                    email: scope.email,
                    username: scope.username,
                    salt: sjcl.codec.base64.fromBits(salt),
                    iter: 1000,
                    keyLength: 512,
                    hash: null,
                };

                var hash = sjcl.misc.pbkdf2(scope.password, pbkdf2Opts.salt, pbkdf2Opts.itr, pbkdf2Opts.keyLength);
                pbkdf2Opts.hash = sjcl.codec.base64.fromBits(hash);
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
