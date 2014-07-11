angular.module('CS634Midterm', []);

angular.module('CS634Midterm').controller("Main", function($scope) {
    var regression = new LinearRegression;
    $scope.results = regression.getResults(data);
});
