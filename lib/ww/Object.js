// Object extensions
// @author: Richard Assar <richard@winterwell.com>

// Object.keys
if(Object.keys === undefined) {
	Object.keys = function(obj) {
		var ret = new Array();

		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				ret.push(prop);
			}
		}

		return ret;
	};
}

/**
* Deep clones an object 
* @param [ignore] Optional parameter. An array or string specifying which property/properties to ignore upon recursion
* Richard Assar
*/
Object.clone = function(obj, ignore) {	
	var ret = (obj instanceof Array) ? [] : {};
  
	for (var prop in obj) {
		if(
			obj.hasOwnProperty(prop) && // Ensure property is not deeper in the prototype chain and...
			!(	// Property is not in our ignore string/array (if supplied)
				ignore !== undefined &&
				ignore instanceof Array ?
					ignore.indexOf(prop) > -1 :
					(prop == ignore)
			)		
		) {
			if (obj[prop] !== null && typeof obj[prop] == "object") {    
				ret[prop] = Object.clone(obj[prop], ignore); // Recurse
			} else {
				ret[prop] = obj[prop];	// Leaf
			}
		}
	}
	 
  	return ret;
};

/**
 * Input: list of key, value pairs. E.g. asMap(Fields.TAG, "myTag", Fields.XID, "dan@twitter");
 * This is useful 'cos {Fields.TAG, "myTag"} doesn't work.
 * @returns map
 */
function asMap() {
	var mp = {};
	
	for(var i = 0; i < arguments.length; i += 2) {
		mp[arguments[i]] = arguments[i+1];
	}
	
	return mp;
}
