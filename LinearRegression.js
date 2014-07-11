var LinearRegression = (function() {
    var LinearRegression = function() {}

    var singleVariableSummation = function(values) {
        return values.reduce(function(a, b) {
            return a + b;
        });
    };

    var singleVariableSquaredSummation = function(values) {
        return values.map(function(value) {
            return Math.pow(value, 2);
        }).reduce(function(a, b) {
            return a + b;
        });
    };

    var multiVariableSummation = function(commaSeperatedVariables) {
        var total = 0;
        var variables = arguments;
        var length = variables[0].length;
        for (var i = 0; i < length; i++) {
            var row = [];
            for (var j = 0; j < variables.length; j++) {
                row.push(variables[j][i]);
            }
            total += row.reduce(function(a, b) {
                return a * b
            });
        }

        return total;
    };

    var A = function(x, y, m) {
        var xySummation = multiVariableSummation(y, x);
        var xSummation = singleVariableSummation(x);
        var ySummation = singleVariableSummation(y);
        var xSquaredSummation = singleVariableSquaredSummation(x);

        return (xySummation - (xSummation * ySummation) / m) / (xSquaredSummation - Math.pow(xSummation, 2) / m);
    };

    var B = function(x, y, m) {
        var xSummation = singleVariableSummation(x);
        var ySummation = singleVariableSummation(y);
        var a = A(x, y, m);

        return ((1 / m) * ySummation) - ((a / m) * xSummation);
    };


    var Q = function(a, b, x, y, m) {
        var lineFormulaSquaredSummation = function(a, b, x, y, m) {
            var total = 0;
            for (var i = 0; i < m; i++) {
                var lineFormula = a * x[i] + b - y[i];
                total += Math.pow(lineFormula, 2);
            }

            return total;
        };
        return (1 / (2 * m)) * lineFormulaSquaredSummation(a, b, x, y, m);
    };

    LinearRegression.prototype.getResults = function(data) {
        var m = 10,
            threshold = 0.003,
            results = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (data[i].id != data[j].id) {
                    var x = data[i],
                        y = data[j],
                        a = A(x.values, y.values, m),
                        b = B(x.values, y.values, m),
                        q = Q(a, b, x.values, y.values, m);

                    if (q < threshold)
                        results.push({
                            a: a.toFixed(6),
                            b: b.toFixed(6),
                            x: x,
                            y: y,
                            q: q.toFixed(6),
                            xSummation: singleVariableSummation(x.values).toFixed(6),
                            ySummation: singleVariableSummation(y.values).toFixed(6),
                            xySummation: multiVariableSummation(x.values, y.values).toFixed(6),
                            xSquaredSummation: singleVariableSquaredSummation(x.values).toFixed(6)
                        });
                }
            }
        }
        return results;
    }

    LinearRegression.prototype.toGraphVizSource = function(results) {
        var settings = [
            'node [shape = circle]'
        ].join("\n");
        var body = results.map(function(result) {
            return [result.x.id, "->", result.y.id, '[ label = "' + result.q + '" ]'].join(" ");
        })

        return ['digraph finite_state_machine {', settings, body.join("\n"), '}'].join("\n")
    };

    return LinearRegression;
})()
