

function TTS(text) {
	this.text = text;
	this.name = 'tts'+Math.floor(Math.random()*1000000);
	$.ajax({
		url:'http://'+WW+'.soda.sh:8101/speech-cereproc',
		data:{
			'text':text
		},
		dataType:'jsonp',
		context:this,
		success:function(r){
			console.log(':)', r);
			this.mp3 = r.cargo;			
			console.log('registerSound', this.mp3, this.name);
			createjs.Sound.registerSound(this.mp3, this.name);
			this.registered = true;			
		},
		error:function(e){
			console.log(':(',e);
			alert(JSON.stringify(e));
		}
	});
}
TTS.prototype.play = function() {
	if ( ! this.mp3 || ! this.registered) {
		alert("The sound '"+this.name+"' is not ready.");
		return;
	}
	var instance = createjs.Sound.play(this.name);
}