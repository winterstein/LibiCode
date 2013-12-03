// Array extensions
// @author: Richard Assar <richard@winterwell.com>

// Array.prototype.map polyfill
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while(k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };      
}

// Array.prototype.filter polyfill
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}

//IE does not provide an array.indexOf function, so add one
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt) {
		var len = this.length;
	
		for (var i = 0; i < len; i++) {
	    		// uses strict equality (no type conversion) for compatibility with Mozilla
		    	if (this[i] === elt) return i;
		}
	
		return -1;
  	};
}

// Define Array.prototype extensions
Array.prototype.insert = function(index, value) {
	Array.prototype.splice.call(this, index, false, value);
};

Array.prototype.remove = function(index) {
	Array.prototype.splice.call(this, index, true);
};

Array.prototype.removeValue = function(value) {
	var index = this.indexOf(value);

	if(index != -1) {
		this.remove(index);
	}

	return this;
};

Array.prototype.prepend = function(b) {
	Array.prototype.unshift.apply(this, b);
};

Array.prototype.append = function(b) {
	Array.prototype.push.apply(this, b);
};

Array.prototype.max = function() {
    return Math.max.apply(Math, this);
};

Array.prototype.min = function() {
    return Math.min.apply(Math, this);
};

/**
 * Sum of values (which must be numbers or parseable to numbers) 
 */
Array.prototype.sum = function() {
	var sum=0;
	for(var i=0; i<this.length; i++) {
		sum += parseFloat(this[i]);
	}
    return sum;
};


function isArray (obj) {
	//obj.constructor.toString().indexOf(â€�Arrayâ€�) != -1;
	return obj instanceof Array;
};

/**
 * Remove first match, based on a boolean function
 * @see removeValue()
 */
Array.prototype.removeObject = function(testFn) {
	for(var i = 0, len = this.length; i < len; ++i) {
		if(testFn(this[i])) {
			this.remove(i);
			return this;
		}
	}		
	
	return this;
};

if ( ! Array.prototype.contains) {
	Array.prototype.contains = function(value) {
		return this.indexOf(value) != -1;
	};
};

Array.prototype.flatten = function() {
	var merged = [];
	for(var i=0; i<this.length; i++) {
		var vi = this[i];
		if (isArray(vi)) {
			vi = vi.flatten();
			for(var j=0; j<vi.length; j++) {
				merged.push(vi[j]);
			}
			continue;
		}
		merged.push(vi);
	}
	return merged;
};
