 # Bezier-Curve-Crossplot
## Simple interactive JavaScript project for creating custom n-th dimension Bezier Curve and its coordinate functions

### --------------CONTROLS--------------------
0. *Interaction is possibly only in __I__ quadrant.*
1. **Left Mouse Button** : creates a *point* for the *control polygon* of the Bezier curve.
2. **Spacebar** :
    * computes and draws the *Bezier curve* in the __I__ quadrant.
    * computes and draws the coordinate functions(also *Bezier curves*) in the __II__ and __IV__ quadrants.
    * **halts** interaction with the canvas.
3. **ESC** : resets the canvas and resumes intercation with the canvas

*--Actual implementation code with comments is in the **js** file--*

## Additional algorithms
A simple B-spline evaluator is available in **bsplineCode.js** which demonstrates a more complex curve computation based on the Cox–de Boor recursion formula.
