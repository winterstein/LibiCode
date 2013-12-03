/* file: encoding.js Convenient String encoding functions for common cases.
 * These should ALWAYS be used when making html from json data.
 * @author Daniel  
 */

/** Url-encoding:
 * 
 * Why? When rhere are 2 built in functions:
 * escape(), and encodeURIComponent() has better unicode handling -- however it doesn't
 escape ' which makes it dangerous.
 This is a convenient best-of-both.
*/
function encURI(urlPart) {
	urlPart = encodeURIComponent(urlPart);
	urlPart = urlPart.replace("'","%27");
	return urlPart;
}

/** Quote-encoding: Encode for use as an html attribute value (i.e. encode quotes).
 * This does _not_ add enclosing quotes.
 * E.g. <a title="<%= attr(name) %>">
*/
function attr(str) {
	if ( ! str) return str;
	str = str.replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
	return str;
}

/** Plain text for use in html: tags are removed with clean, and entities are encoded */
function plain(str) {
	return encodeEntities(clean(str));
}


/**  
 * @param s String to encode
 */
function encodeEntities(s){
	var encodedText = $("<div>").text(s).html();
	encodedText = encodedText.replace(/"/g, '&quot;');
	return encodedText;
};

function decodeEntities(s){
	return $("<div>").html(s).text();
};


/** A strong anti-hacking defence: strips out all html tags */
function clean(html) {
	if (html === undefined) return "";
	
	html = html
		.replace(/<!--/g, '&lt;!--')
		.replace(/-->/g, '--&gt;'); // Ensure that html comments are escaped.
	
	return html.replace(/<[^>]+.*?\/?>/g, ""); // The original expression here was wrong, only removed OPEN tag and not CLOSE tag. Did not have g modifier. - RA
};

/**
 * Translate!
 * See i18n.js
 * @param english
 */
function tr(english) {
	if (window.i18n) return i18n.tr(english);
	console.log("I18N", "fail (no i18n loaded): "+english);
	// Remove {}s
	_english = english.replace(/\{(.*?)\}/g, "$1"); 
	return _english;
}


