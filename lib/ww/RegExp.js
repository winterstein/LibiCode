// Escapes a string, allowing it to be safely used within a regular expression
function regExpEscape(string) {
	return string.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};
