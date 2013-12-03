/**
 * Unlike the built-in {} (which secretly uses toString for the key), 
 * this can have any object as a key.
 * Thanks to http://stackoverflow.com/users/2120/pottedmeat
 * 
 */

/**
 * @param dict
 *            Optional. If set, use this as the starting values.
 */
function HashMap(dict) {
	/**
	 * id to value
	 */
	this._dict = {};
	/**
	 * Can be set to null if you _don't_ want to track keys.
	 */
	this._keys = [];
	// initialise
	if (dict) {
		for ( var k in dict) {
			this.put(k, dict[k]);
		}
	}
}

HashMap._sharedId = 1;

HashMap.prototype._fileUnder = function(key) {
	if (typeof key == "object") {
		if (key.__hashId) return key.__hashId;
		HashMap._sharedId++;
		key.__hashId = HashMap._sharedId;		
		return key.__hashId;
	}
	return key;
};

HashMap.prototype.put = function(key, value) {
	if (this._keys && this._keys.indexOf(key) == -1)
		this._keys.push(key);
	var skey = this._fileUnder(key);
	this._dict[skey] = value;
	return this; // for chaining
};

HashMap.prototype.get = function(key) {
	var skey = this._fileUnder(key);
	return this._dict[skey];
};

HashMap.prototype.remove = function(key) {
	var skey = this._fileUnder(key);
	delete this._dict[skey];
	var i = this._keys.indexOf(key);
	if (i != -1) {
		this._keys.splice(i, 1);
	}
};

/**
 * @returns {Array} A copy of the keys
 */
HashMap.prototype.keys = function() {
	return this._keys.slice(0);
};
