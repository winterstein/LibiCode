
var HashMapTests = {
	name : "HashMap",

	"basic get/put" : function() {
		var hm = new HashMap();
		hm.put("a", "a-v");
		var b = {};
		var c = {};
		var d = {
			d : 1
		};
		hm.put("a", "a-v");
		hm.put(b, "b-v");
		hm.put(c, "c-v");
		hm.put(d, "d-v");

		SJTest.assert(hm.get("a") == "a-v");
		SJTest.assert(hm.get(b) == "b-v");
		SJTest.assert(hm.get(c) == "c-v");
		SJTest.assert(hm.get(d) == "d-v");

		console.log(hm);
	},

	"get/put/remove" : function() {
		var hm = new HashMap();
		hm.put("a", "a-v");
		var b = {};
		var c = {};
		var d = {
			d : 1
		};
		hm.put("a", "a-v");
		hm.put(b, "b-v");
		hm.put(c, "c-v");
		hm.put(d, "d-v");

		hm.remove(b);
		hm.put(c, "c-v2");

		SJTest.assert(hm.get("a") == "a-v");
		SJTest.assert(!hm.get(b));
		SJTest.assert(hm.get(c) == "c-v2");
		SJTest.assert(hm.get(d) == "d-v");

	},
	"keys" : function() {
		var hm = new HashMap();
		hm.put("a", "a-v");
		var b = {};
		var c = {};
		var d = {
			d : 1
		};
		hm.put("a", "a-v");
		hm.put(b, "b-v");
		hm.put(c, "c-v");
		hm.put(d, "d-v");

		hm.remove(b);
		hm.put(c, "c-v2");

		var keys = hm.keys();

		assert(keys.length == 3);
		assert(keys.indexOf("a") != -1);
		assert(keys.indexOf(b) == -1);
		assert(keys.indexOf(c) != -1);
		assert(keys.indexOf(d) != -1);

		// damage it!
		keys.push("foo");
		var keys2 = hm.keys();
		assert(keys2.length == 3);

	}
};

SJTest.run(HashMapTests);