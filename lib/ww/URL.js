// file:URL.js URL functions
// @author: Daniel, Richard Assar

var URL_REGEX = /([hf]tt?ps?:\/\/[a-zA-Z0-9_%\-\.,\?&\/=\+'~#!\*:]+[a-zA-Z0-9_%\-&\/=\+])/g;

/**
* Parse a URI into its components
* TODO Is this used at all??
* TODO document better
*/
function parseUri(str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

/**
 * @param url Can be null (returns null)
 * @returns e.g. bbc.co.uk from http://bbc.co.uk/whatever. false if url is not
 * a url. 
 */
function getDomainFromUrl(url) {
	if (!url) return null;
	// convert window.location into a String
	url = "" + url;
	
	var m = url.match(/:\/\/([^\/]+)/);
	
	if (!m) return false;
	
	return m[1];
};

/** Add a GET url argument, triggering a reload */
function addArg(name, value) {
	var url = ""+window.location;
	url = addArg2(url, name, value, [name]);
	window.location = url;
};

function addRemoveArg(name, value, removeNames) {
	var url = ""+window.location;
	removeNames.push(name);
	url = addArg2(url, name, value, removeNames);
	window.location = url;
};

/**Add a set of GET url arguments, triggering a reload*/
function addArgs(args) {
	var url = ""+window.location;
	for(var name in args) {
		url = addArg2(url, name, args[name], [name]);
	}
	window.location = url;
};

/**
 * @param url
 * @param name
 * @param value
 * @param removeNames args to remove. Can be null
 * @returns url with name=value (escaped), and with any of removeNames gone
 */
function addArg2(url, name, value, removeNames) {		
	// Extract the hash param
	var matches = url.match(/#.+/);

	url = url.replace(/#.*$/, '');
	
	var hashParam = (matches != null) ? matches[0] : '';
	
	// There must be a better way!
	var eName = encURI(name);
	
	// remove old
	if(!removeNames) removeNames = [name];	
	
	for(var ri = 0; ri<removeNames.length; ri++) {		
		url = removeArg(url, removeNames[ri]);
	}
	
	if(!value) {
		return url;
	}
	
	// prep for adding
	var lc = url.charAt(url.length-1);
	
	if(url.indexOf("?") == -1) {
		url += "?";	
	} else {		
		if(lc != "&" && lc != "?") url += "&";
	}
	
	// add new
	url += eName+"="+encURI(value);

	// add hash param back in
	url += hashParam;
	
	return url;
};

/**
 * @returns url without name=?
 */
function removeArg(url, name) {
	var reName = encURI(name);	
	url = url.replace("?"+reName, "?&"+reName);	
	
	var oldValRE = new RegExp("&"+reName+"=[^&]*");
	url = url.replace(oldValRE,"");
	
	// clean up trailing ?&
	while(true) {
		var lc = url.charAt(url.length-1);
		if (lc=="?" || lc=="&") url = url.substring(0,url.length-1);
		else break;
	}
	
	url = url.replace("?&", "?");
	
	return url;
};

/** change the rest type of a url, e.g. .html to .json */
function setUrlType(url, type) {
	url = ""+url; // handle window.location
	
	var url2 = url.replace(/\.\w+\?/, type+"?");
	
	if (url2 != url) return url2;	
	url2 = url.replace(/\.\w+$/, type);
	
	if (url2 != url) return url2;
	url2 = url.replace(/\?/, type+"?");
	
	if (url2 != url) return url2;
	
	return url+type;
};

/** Parse url arguments 
 * @param [string] Optional, the string to be parsed, will default to window.location when not provided.
 * @returns a map */
function getUrlVars(string) {
	var url;
	
	if(string === undefined) {
		url = ""+window.location;
	} else {
		url = string;
	}
	
	url = url.replace(/#.*/, ''); // IS THIS CORRECT? It looks a bit over-zealous
	var s = url.indexOf("?");

	if (s==-1 || s==url.length-1) return {};
	
	var varstr = url.substring(s+1);
	var kvs = varstr.split("&");
	var urlVars = {};
	
	for(var i=0; i<kvs.length; i++) {
		var kv = kvs[i];
		if ( ! kv) continue; // ignore trailing &
		var e = kv.indexOf("=");
		
		if (e!=-1 && e!=kv.length-1) {
			k = kv.substring(0,e);
			k = decodeURIComponent(k.replace(/\+/g, " "));
			v = kv.substring(e+1);
			v = decodeURIComponent(v.replace(/\+/g, " "));
			urlVars[k] = v;
		} else {
			urlVars[kv] = '';
		}
	}	
	
	return urlVars;
};

/** 
* Shortens the inner text of any anchor elements in a string 
* @param str The string to be shortened
* @param threshold The threshold value for the length of anchor inner text.
* @param [truncatedLength] If specified will be used instead of the threshold as the length of the resuling inner text
* @author Richard Assar
*/
function shortenURLs(str, threshold, truncatedLength) {
	return str.replace(/<a(.*?)>(.*?)<\/a>/g, function() {
		return '<a' + arguments[1] + '>' + (arguments[2].length > threshold ? arguments[2].substr(0, truncatedLength || threshold) + ' &hellip;' : arguments[2]) + '</a>';
	});
};

// Append a "scraper safe" email url.
function email(name, domain) {
	document.write("<a href='mailto:"+name+"@"+domain+"'>");
	document.write(name+"@"+domain);
	document.write("</a>");
};

/** Global object which contains all $_GET params **/
window.urlVars = getUrlVars();
