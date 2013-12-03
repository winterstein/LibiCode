
/*
 * LibiCode
 * 
 * This code is ugly! It was a quick hack.
 * 
 */

var MOVE_PIXELS = 100;

var STEP_TIME = 750;

window.EVENTS = ['start']; //, 'touch', 'collide'];

var ICONS = {
};
$(function(){
	$('.CommandBox > .Cmd').each(function(){;
		var c = $(this).attr('data-cmd');
		var i = $(this).html();
		if (i.charAt(0)==='<') {
			var j = i.lastIndexOf(c);
			if (j!=-1) i = i.substring(0,j);
			ICONS[c] = i;
		}
	});
});
/**
 * 
 * @param $topPaper
 * @param e 'start'
 */
function updateScriptDisplay($topPaper, e) {
	assertMatch(e, String);
	var onEditor = $('div.On'+e+'Code');
	$('.Line', onEditor).remove();
	var onE = 'on-'+e;
	var script = $topPaper.data(onE);
	if (script) {
		assertMatch(script, KiddyScript);
		for(var ci=0; ci<script.cmds.length; ci++) {
			var c = script.cmds[ci];
			assertMatch(c, Cmd);
			assert(c.text);			
			var cIcon = c.text.split(" ")[0];
			var icon = ICONS[cIcon] || '';
			if (icon) icon += ' ';
			var line = $("<div class='Line Line"+ci+" well well-sm'>"+icon+c.text+" <button type='button' class='close TouchClick' aria-hidden='true'>&times;</button></div>");
			line.data('cmd',c);
			c.script = script;
			onEditor.append(line);
		}
		$('button.close',onEditor).click(function() {
			// Delete a line of code
			var line = $(this).parent();
			var cmd = line.data('cmd');
			var script = cmd.script;
			script.remove(cmd);
			line.fadeOut('fast').remove();
		});
	}
//	var blank = $("<div class='btn btn-default Blank Line Tool TouchClick' data-event='"+e+"'>Add command?</div>");
//	onEditor.append(blank);	
}

/**
 * Lookup TTS renderings of speech.
 */
var text2tts = {};
var lastAddCmd = 0;

function addCmd(topPaper, e, cmd, param) {
	if ( ! cmd) return;
	if (new Date().getTime() - lastAddCmd < 500) {
		// TODO a touch-off requirement?
		console.log("addCmd", "too soon for "+cmd);
		return;
	}
	lastAddCmd = new Date().getTime();
	assertMatch(e, String, cmd, String);
	console.log("addCmd", topPaper, e, cmd, param);
	assert(topPaper.length===1,topPaper.length);
	// Does it need a parameter?
	if (cmd==='sound' && ! param) {
		param = prompt('Your message?');
		if ( ! param) return false;
		cmd += ":"+param;
	}
	var onE = 'on-'+e;
	var script = topPaper.data(onE);
	var ks = new KiddyScript(topPaper, script? script.text+'\n'+cmd : cmd);
	console.log(onE, topPaper, ks, ks.text, cmd);
	topPaper.data(onE, ks);
	updateScriptDisplay(topPaper, e);
}



//***************		PLAYER	****************

function Cmd($target, text) {
	assert(text);
	/**
	 * text, including parameters or complex expressions or whatever.
	 */
	this.text = text;
	this.$target = $target;
	/**
	 * true if this is the first at() call.
	 */
	this.first = true;
	// Sound? Let's render that sound
	if (this.text.substring(0,5)==='sound') {
		var param = this.text.substring(6);
		if ( ! text2tts[param]) {
			text2tts[param] = new TTS(param);
		}
	}
}

Cmd.prototype.at = function(fraction) {
	if ( ! this.initial) {
		this.initial = this.$target.position();
		this.initial.rotate = this.$target.data('rotate') || 0;
		console.log(this.text, this.initial, this.$target);
	}
	// Run (a big hacky switch for now)
	// Rotate
	if (this.text==='spin-right') {
		var rnow = this.initial.rotate + fraction*45;
		this.$target.css('rotate', rnow);
		this.$target.data('rotate', rnow);
		return;
	}
	if (this.text==='spin-left') {
		var rnow = this.initial.rotate - fraction*45;
		this.$target.css('rotate', rnow);
		this.$target.data('rotate', rnow);
		return;
	}
	
	// Move
	if (this.text==='up') {
		var ynow = this.initial.top - fraction*MOVE_PIXELS;
		this.$target.css('top', Math.round(ynow));
		this.at2_animate(fraction);
	} else if (this.text==='down') {
		var ynow = this.initial.top + fraction*MOVE_PIXELS;
		this.$target.css('top', Math.round(ynow));
		this.at2_animate(fraction);
	} else if (this.text==='right') {
		var xnow = this.initial.left + fraction*MOVE_PIXELS;
		this.$target.css('left', Math.round(xnow));
		this.at2_animate(fraction);
	} else if (this.text==='left') {
		var xnow = this.initial.left - fraction*MOVE_PIXELS;
		this.$target.css('left', Math.round(xnow));
		this.at2_animate(fraction);
	}
	
	if (this.text==='wait') {
		// no-op
		return;
	}
	
	// Shiny
	if (this.text==='show') {
		if (this.first) {
			this.$target.fadeIn();
		}
		return;
	}
	if (this.text==='hide') {
		if (this.first) {
			this.$target.fadeOut();
		}
		return;
	}
	if (this.text.substring(0,5)==='sound') {
		if (this.first) {
			var param = this.text.substring(6);
			console.log("sound", param);
			var tts = text2tts[param];
			console.log(param, text2tts);
			assert(tts, param);
			tts.play();
		}
		return;
	}
};
Cmd.prototype.at2_animate = function(fraction) {
	if ( ! this.$target.hasClass('dino')) return;
	if (this.first) {
		if ( ! this.$target.data('sprited')) {
			this.$target.sprite({fps: 6, no_of_frames: 4});
			this.$target.data('sprited', true);
		} else {
			this.$target.spStart();
		}
	} else if (fraction===1) {
		this.$target.spStop();
	}	
}

/**
* @param object The thing to be scripted
* @param text {string}
*/
function KiddyScript(object, text) {
	this.$object = $(object);
	this.text = text || '';
	/** {Cmd[]} */
	this.cmds = [];
	this.prevCmd = null;
	var _cmds = this.text.split(/\n/);
	for(var i=0; i<_cmds.length; i++) {
		var ci = _cmds[i].trim();
		if ( ! ci) continue;
		var c = new Cmd(this.$object, _cmds[i]);
		this.cmds.push(c);
	}
	this.start = null;
};

KiddyScript.prototype.remove = function(cmd) {
	assertMatch(cmd, Cmd);
	var _cmds = [], _text='';
	for(var i=0; i<this.cmds.length; i++) {
		var c = this.cmds[i];
		if (c===cmd) continue;
		_cmds.push(c);
		_text += c.text+"\n";
	}
	this.cmds = _cmds;
	this.text = _text;
};
/**
* 
* @param dt {number}
* @param dtStart {number}
*/
KiddyScript.prototype.tick = function() {
	if ( ! this.start) {
		this.start = new Date();
		this.done = false;
	}
	var dt = new Date().getTime() - this.start.getTime();
	var n = Math.floor(dt / STEP_TIME);
	// Highlight script
	$('.is-running').not('.Line'+n).removeClass('is-running');
	$('.Line'+n).addClass('is-running');
	var fraction = (dt - n*STEP_TIME)/STEP_TIME;
	var cmd = this.cmds[n];
	// Finish off any stray fraction of previous
	if (this.prevCmd && this.prevCmd !== cmd) {
		this.prevCmd.at(1);		
	}
	this.prevCmd = cmd;
	// All done?
	if ( ! cmd) {
		this.done = true;
		return;
	}
	cmd.at(fraction);
	cmd.first = false;
};

function Player() {	
	/** {KiddyScript[]} */
	this.scripts = [];
	this.start = null;
	this.lastTick = null;
}

Player.prototype.tick = function() {
	this.lastTick = new Date();
	assert(this.scripts, this);
	var _scripts = [];
	for(var i=0; i<this.scripts.length; i++) {
		var s = this.scripts[i];
		s.tick();
		if ( ! s.done) _scripts.push(s);
	}
	// Removing any done ones
	this.scripts = _scripts;
};

/**
* Stop and rewind
*/
Player.prototype.stop = function() {
	$('.PlayButton').removeClass('active');
	var paper = $('.Scripted');
	// stop
	if ( ! this.intervalId) return;
	clearInterval(this.intervalId);
	
	// Reset everything!
	paper.each(function() {
		// position
		// TODO remember start for dino
		$(this).css({top:0,left:0,rotate:0});
		$(this).data('rotate', 0);
		// uncrop
		var size = $(this).data('size');
		if (size) {
			$(this).css({top:0, left:0, width:size.width, height:size.height});
			$('.Splodge', this).each(function(){
				var posn = $(this).data('start-posn');
				$(this).css({top:posn.top, left:posn.left});
			});
		}
	});
	// Where's that dino?	
	var pos = $('#dino').data('start-pos');
	if (pos) {
		$('#dino').css({left:pos.left, top:pos.top});
	}
	// TODO crop & uncrop paper
	
	// fade paper
	$('.PaperTab').first().click();
};



Player.prototype.play = function() {
	// Where's that dino?
	var pos = {left:$('#dino').css('left'), top:$('#dino').css('top')}; 
	$('#dino').data('start-pos', pos);
	
	$('.PlayButton').addClass('active');
	$('.StopButton').removeClass('active');
	// order and show paper
	var paper = $('.Scripted');
	paper.css('opacity',1.0);
	for(var i=0; i<paper.length; i++) {
		var ri = paper.length - i;
		var pi = $(paper[i]);
		// Sprites on top
		if (pi.hasClass('dino')) {
			ri += 10;
		}
		pi.css('z-index', 100 + 10*ri);				
	}
	// Fresh scripts
	for(var i=0; i<paper.length; i++) {
		var pi = $(paper[i]);
		var ks = pi.data('on-start');
		if (ks) {
			assertMatch(ks, KiddyScript);
			var ks2 = new KiddyScript(paper[i], ks.text);
			pi.data('on-start', ks2);			
		}
	}
	
	// Crop paper (for rotation about it's centre)
	paper.not('.dino').each(function() {
		var bounds = $('.Splodge', this).bounds();
		$(this).data('size', {width:$(this).css('width'), height:$(this).css('height')});
		$(this).css({top:bounds.top, left:bounds.left, width:bounds.width, height:bounds.height});
		$('.Splodge', this).each(function(){
			var posn = $(this).position();
			$(this).data('start-posn', posn);
			$(this).css({top:posn.top - bounds.top, left:posn.left - bounds.left});
		});
		console.log("crop", bounds, $(this).data('size'));
	});
	
	// Collect start scripts from DOM
	var _scripts = [];
	paper.each(function() {
		var $p = $(this);
		var ons = $p.data('on-start');
		if (ons) {
			ons.start = null;
			_scripts.push(ons);
		}
	});
	this.scripts = _scripts;
	assert(this.scripts);
	// TODO prime the collider checks
	
	// Tick!
	if (this.intervalId) clearInterval(this.intervalId);
	this.start = new Date();
	this.intervalId = setInterval(this.tick.bind(this), 20);
};


$(function(){

	for(var i=0; i<window.EVENTS.length; i++) {
		var e = window.EVENTS[i];
		var script = $("<div class='OnXEditor On"+e+" well well-sm'><h4 data-target='.On"+e+"Code'>On "+
						e+"</h4><div class='On"+e+"Code'></div></div>");
		$('.CodeBox').append(script);
	}


// EDITOR
function buildScript(tool, scriptEditor) {
	console.log(tool,scriptEditor);
	var cmd = $(tool).attr('data-cmd');
	assert(cmd, tool);
	//add to script
	var targetPaper = $('.Scripted.active');
	var eType = 'start'; //$(scriptEditor).attr('data-event');
	assert(eType,scriptEditor);
	addCmd(targetPaper, eType, cmd);
	// clean up
	$('.is-selected').removeClass('is-selected');
	$('.is-adding').removeClass('is-adding');
}

//$('.CodeBox').on('click', '.Blank', function(e){
//	console.log(e);
//	// do we have a command?
//	var tool = $('.CommandBox > .is-selected');
//	if (tool.length) {
//		buildScript(tool, e.target);
//		return;
//	}
//	// highlight the box
//	$('.is-selected').removeClass('is-selected');
//	$('.is-adding').removeClass('is-adding');
//	$('.CommandBox').addClass('is-selected');
//	$(this).addClass('is-selected');
//	$(this).addClass('is-adding');
//});

$('.CommandBox > .Tool').click(function(e) {
	// Do we have a script?
	var editors = $('.OnstartCode'); //$('.is-adding');
	console.log(editors, e);
	if (editors.length) {
		buildScript(this, editors);
		return false;
	}
});

var player = new Player();

//	***************		PLAY CONTROLS	****************

$('.PlayButton').click(function() {
	console.log('play!');
	player.stop();
	player.play();
	$('.StopButton').removeClass('disabled');
});

$('.StopButton').click(function() {
	console.log('stop!');
	player.stop();
});

// GO EDIT!
$('.PaperTab').first().click();

// Load and play??
if (window.location.hash) {
	var h = window.location.hash.substring(1);	
	var bit = h.split("/")[0];
	if ( ! bit) return;
	var s = new MyStash(bit);
	var stashed = s.load(h, processLoad);	
}

}); // end on-load
