
// TODO save and load

function MyStash(name) {
	if ( ! name) {
		name = localStorage['username'];
		if ( ! name) {
			name = 'u'+Math.floor(Math.random()*1000);		
			localStorage['username'] = name;
		}
	}
	this.name = name;
}

MyStash.prototype.load = function(slug, onload) {
	console.log(slug);
	$.ajax({
		url:'http://'+WW+'.soda.sh:8101/daniel-stash/'+slug+".json",
		dataType:'jsonp',
		data:{'action':'load'},
		success:onload		
	});
}

MyStash.prototype.save = function() {
	var slug = this.name+'/'+escape(new Date().toString().replace(' ', '_'));
	var saveme = {};

	$('.Scripted').each(function() {
		var id = $(this).attr('id');
		var html = $(this).html();
		var script = $(this).data('on-start');
		if (script) script = script.text;
		var startpos = $(this).data('start-pos');
		saveme[id] = {id:id, html:html, 'on-start':script, 'start-pos':startpos};
	});	
	
	var json = JSON.stringify(saveme);
	console.log("JSON", json);
	var url = 'http://'+WW+'.soda.sh:8101/daniel-stash/'+slug+'.json';
	var shareUrl = window.location+"#"+slug;
	$.ajax({
		url:url,
		type:'POST',
		data:{action:'save', stash:json},
		})
		.done(function(result){
			$('#savedas').text(shareUrl).attr('href', shareUrl);
		});
	return slug;
}

function processLoad(r) {
	console.log(r);
	var cargo = JSON.parse(r.cargo);
	$('.Scripted').each(function() {
		var id = $(this).attr('id');
		var cargoi = cargo[id];
		if (cargoi) {
			var html = cargoi.html;
			var script = cargoi['on-start'];
			var startpos = cargoi['start-pos'];
			
			$(this).html(html);
			if (script) {
				$(this).data('on-start', new KiddyScript(this, script));
			}
			if (startpos) {
				$(this).data('start-pos', startpos);
				$(this).css({left:startpos.left, top:startpos.top});
			}			
		}
	});	
	$('.PlayButton').click();
}

function saveIt() {
	var ms = new MyStash();
	var saveSlug = ms.save();
}
