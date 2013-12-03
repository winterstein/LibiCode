/* file:Number.js Number extensions 
@author: Richard Assar, Daniel */

// Returns the given number clamped between min and max
Number.prototype.clamp = function(min, max) {
	if(this < min) {
		return min;
	} else if(this > max) {
		return max;
	} else {
		return this;
	}
};

// Modulus operator, corrected to operate correctly with negative numbers
Number.prototype.mod = function(n) {
	return ((this % n) + n) % n;
};

// Return the ordinal of the given number
// (1).ordinal() returns "st" (as in 1st)
// (2).ordinal() returns "nd" (as in 2nd)
Number.prototype.ordinal = function() {
	var s = ["th", "st", "nd", "rd"], v = this % 100;

	return (s[(v - 20) % 10] || s[v] || s[0]);
};

// Is this a number?
Number.isNumber = function(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
};
