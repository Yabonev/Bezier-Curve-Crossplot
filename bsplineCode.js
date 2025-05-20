/*
 * bsplineCode.js
 * Implementation of uniform B-spline curve evaluation using
 * Cox-de Boor recursion formula. This can be used as a more
 * complex alternative to the Bezier curve implementation
 * in crossplotCode.js.
 */

// Evaluate basis function N_{i,p}(t)
function bsplineBasis(i, p, t, knots) {
    if (p === 0) {
        return (knots[i] <= t && t < knots[i + 1]) ? 1 : 0;
    }
    var leftDenom = knots[i + p] - knots[i];
    var rightDenom = knots[i + p + 1] - knots[i + 1];
    var left = 0;
    var right = 0;

    if (leftDenom !== 0) {
        left = (t - knots[i]) / leftDenom * bsplineBasis(i, p - 1, t, knots);
    }
    if (rightDenom !== 0) {
        right = (knots[i + p + 1] - t) / rightDenom * bsplineBasis(i + 1, p - 1, t, knots);
    }
    return left + right;
}

// Evaluate B-spline curve point for parameter t
function bsplinePoint(controlPoints, degree, knots, t) {
    var n = controlPoints.length - 1;
    var point = { x: 0, y: 0 };

    for (var i = 0; i <= n; i++) {
        var basis = bsplineBasis(i, degree, t, knots);
        point.x += controlPoints[i].x * basis;
        point.y += controlPoints[i].y * basis;
    }
    return point;
}

// Compute points on the B-spline curve with a step size
function computeBSpline(controlPoints, degree, knots, step) {
    if (!step) step = 0.01;
    var points = [];
    var startT = knots[degree];
    var endT = knots[knots.length - degree - 1];
    for (var t = startT; t <= endT; t += step) {
        points.push(bsplinePoint(controlPoints, degree, knots, t));
    }
    return points;
}

// Export for use in other scripts (Node or browser)
if (typeof module !== 'undefined') {
    module.exports = {
        bsplineBasis: bsplineBasis,
        bsplinePoint: bsplinePoint,
        computeBSpline: computeBSpline
    };
}
