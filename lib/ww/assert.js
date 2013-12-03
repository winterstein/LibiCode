(function () {
	function AssertionError(message) {
		if(message === undefined) message = "";
		/**
		 * warning: might not be a string
		 */
		this.message = message;
	};
	
	AssertionError.prototype = new Error ();
	AssertionError.prototype.toString = function() {
		if (this.message) return ""+this.message;
		return "AssertionError"; 
	};
	AssertionError.prototype.name = "AssertionError";
	
	/**
	 * Underscore is more cross-browser-robust. But handle the no-underscore case without crashing.
	 */
	var isArray = function(a) {
		if (window._) return _.isArray(a);
		return a instanceof Array;		
	};
	
	if ( ! window.reportError) {
		window.reportError = function(err) {
			console.error("assert.fail", ""+err, err.message);
		};
	};
	
	/**
	 * Asserts that an expression is true. Throws an AssertionError if not, and
	 * reports that error to the server.
	 * @param exp Expression to be checked for truth.
	 * Special case for arrays: an empty array is false (this is for
	 * easy sanity checking of jQuery selections).
	 * @param [message] Message that is supplied to the AssertionError, should
	 * the assertion fail.
	**/
	window.assert = function (exp, message) {	
		if (exp && ! isArray(exp)) {
			return;
		}
		if (isArray(exp) && exp.length > 0) {
			return;
		}
		// TODO document what this assumes
		reportError (new AssertionError (message), false, true);
	};
}) ();
