// String extensions
// @author: Richard Assar <richard@winterwell.com>

/** Number of occurances of a pattern within an input string
// e.g. "aaahhhh".numberOfOccurances(/a/g) -> 3
// Accepts regexp object or string
// e.g. "aaahhhh".numberOfOccurances("a") also equivalent to above -> 3
// e.g. "adcc".numberOfOccurances("(a|c)[^d]") -> 1 */
String.prototype.numberOfOccurances = function(pattern) {
	var n = 0;

	if(typeof pattern == "string") {
		pattern = new RegExp(pattern, "g");
	}
	
	this.replace(pattern, function() { n++ });
	
	return n;
};

/** Trim whitespace from both ends of the string
// "  test" becomes "test"
// "test  " becomes "test"
// "  test  " becomes "test"*/
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
};

/** Transform the first character of the string to uppercase */
String.prototype.ucfirst = function() {
	return this.charAt(0).toUpperCase() + this.substr(1, this.length - 1);	
};

String.prototype.contains = function(string) {
	return this.indexOf(string) != -1;
};

/** Truncates text strings to #words, or #words*6 (whichever is shorter).
 *  Warning: This also compacts whitespace!
 * @param appendString Optional. e.g. "..." This is added if a truncation is performed.
 *  
 */
function truncateWords(string, numWords, appendString) {
	var words = string.split(/\s+/);
	var nWords = words.length;
	var text = words.splice(0, numWords).join(" ");
	
	// chop if there are very long words (which are generally junk)
	if (text.length > numWords*6) {
		text = text.substring(0, numWords*6);
	}
	
	return text + (appendString !== undefined && nWords > numWords ? appendString : '');	
};

/**
* Wraps each of a string's character in an element
* e.g. "abc".wrapCharsInTag("span") -> "<span>a</span><span>b</span><span>c</span>"
*/
String.prototype.wrapCharsInElement = function(tag) {
	var open = '<' + tag + '>';
	var close = '</' + tag + '>';	

	return open + this.split('').join(close + open) + close;
};
