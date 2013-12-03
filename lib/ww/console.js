/**
* Console replacement, no firebug.
*/

var NATIVELOG = (""+window.location).indexOf("nativelog") != -1;

var DEBUG = (""+window.location).indexOf("debug") != -1;

(function() {
	/**
	* Console replacement, no firebug.
	*/
	if (window.console === undefined) {
		window.console = new Object();
	} 

	if (window.console.log === undefined) {
		if(window.DEBUG) {
			var console = $('<div id="substitute-console"></div>');

			$(function() {
				$(document.body).append(console);
			});

			window.console.log = function() {			
				var args = Array.prototype.slice.call(arguments); // Cast Arguments from "object" to Array

				for(var i = 0; i < args.length; i++) {
					if(args[i] instanceof Object) {				
						args[i] = JSON.stringify(args[i]);
					}
				}

				console.append($("<p>").text(args.join(" ")));

				console[0].scrollTop = console[0].scrollHeight;
			};	
		} else {
			window.console.log = function() {};
		}
	}
	
	if ( ! window.console.warn) {
		window.console.warn = window.console.log;
	}
	
	if (!window.console.error) {
		window.console.error = window.console.log;
	}
	
	/** Upgrade the log to support Android LogCat style tags.
	 * Usage: put log=tag1+tag2 into the url to restrict logging to just those tags.
	 * Call console.log with a tag as the 1st argument.
	 * E.g. console.log('template', "Loading templates...");  */
	if(!window.NATIVELOG) {
		var nativeLog = window.console.log;

		window.console.log = function() {
			var args = Array.prototype.slice.call(arguments); // Cast Arguments from "object" to Array

			// filter by logcat tag?
			var tags = urlVars["log"];
			if (tags) {
				if(tags.indexOf(args[0]) == -1) {
					return;
				}
			}
			
			if(nativeLog.apply !== undefined) {
				nativeLog.apply(window.console, args);
			} else {
				nativeLog(args.join(" ")); // See previous comment for description.
			}
		};
	}

	/**
	* Alert wrapper. Useful if you need to set a breakpoint here for debugging.
	*/
	nativeAlert = window.alert;

	window.alert = function(message) {
		if(nativeAlert.call !== undefined) {
			nativeAlert.call(window, message);
		} else {
			nativeAlert(message);
		}
	};
})();
