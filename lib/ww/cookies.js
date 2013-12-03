// Cookies
// @author: Richard Assar <richard@winterwell.com>

/** 
  name - name of the desired cookie
  Return a string containing the value of specified cookie, or null if cookie does not exist
*/
function getCookie(name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	
	if (begin == -1) {	
		begin = dc.indexOf(prefix);
		
		if (begin != 0) return null;
	} 
	else begin += 2;
	
	var end = document.cookie.indexOf(";", begin);
	
	if (end == -1) end = dc.length;
	
	return unescape(dc.substring(begin + prefix.length, end));
};

/** Convert a cookie into a number (otherwise it will be a string) */
function getIntCookie(name) {
	return parseInt( getCookie(name) );
};

/** Create a cookie
	name - name of the cookie
	value - value of the cookie
	These cookies will ask to stay alive for a year.
*/
function setCookie(name, value) {
   var largeExpDate = new Date ();
   
   largeExpDate.setTime(largeExpDate.getTime() + (365 * 24 * 3600 * 1000)); // Last for a year - note that the browser may not respect this.
   
   // Create the cookie string
   var curCookie = name + "=" + escape(value) + "; expires="+largeExpDate.toGMTString()+";";
   
   // Add it to the document
   document.cookie = curCookie; // Note that this *doesn't* re-assign document.cookie (which would delete all existing cookies).
   
   // It magically appends the new cookie to the list.
};
