

function selectPaper(topPaper) {
	$('.Scripted').removeClass('active');
	$('.Scripted').removeClass('is-selected');
	topPaper.addClass('active');
	topPaper.css({'opacity':1.0, 'z-index':1000});
	
	$('#code4layer').text('Code for '+topPaper.attr('data-name'));
	
	for(var i=0; i<EVENTS.length; i++) {
		var e = EVENTS[i];
		updateScriptDisplay(topPaper, e);
	}
}
function selectSprite(sprite) {
	$('.Scripted').removeClass('active');
	$('.Scripted').removeClass('is-selected');
	sprite.addClass('is-selected');
	sprite.addClass('active');	
	$('#code4layer').text('Code for '+sprite.attr('data-name'));
	
	for(var i=0; i<EVENTS.length; i++) {
		var e = EVENTS[i];
		updateScriptDisplay(sprite, e);
	}
}




$(function(){

$('.Tool').click(function() {
	$('.is-selected').removeClass('is-selected');
	$(this).addClass('is-selected');
	return true;
});

// HACK
$('#dino').click(function() {
	selectSprite($(this));
	return true;
});

var state = {};

var paper = $('.Paper');

$('#PaperThing1').tab('show');

paper.mousedown(function() {
	state.isPainting = true;
	$('.PaintBox > .is-selected').addClass('is-active');
});
paper.mouseup(function() {
	state.isPainting = false;
	$('.PaintBox > .is-selected').removeClass('is-active');
});
paper.mouseleave(function() {
	state.isPainting = false;
	$('.PaintBox > .is-selected').removeClass('is-active');
});

var zerox = paper.offset().left;
var zeroy = paper.offset().top;

// Paper Tabs
$('.PaperTab').click(function() {
	var $this = $(this);
	$('.PaperTab').removeClass('active');
	paper.css({'opacity':0.5, 'z-index':100});
	
	$this.addClass('active');
	var pchosen = $this.attr('href');
	var myPaper = $(pchosen);
	selectPaper(myPaper);
});

$('body').keydown(function(e) {
	if (e.which===27) { //escape
		$('.is-selected').removeClass('is-selected');
		state.isPainting = false;
	}
});

paper.on('click', '.Thing', function(e) {
	var tool = $('.is-selected');
	if (tool.hasClass('Delete')) return;
	//console.log(e, this);
	e.preventDefault();
	$('.is-selected').removeClass('is-selected');
	$(this).addClass('is-selected');
});

//var quadtree = new QuadTree(bounds, false, 10);

paper.click(function(e){
	var tool = $('.is-selected');
	if (tool.hasClass('ThingButton')) {
		var circle = tool.clone();
		$(circle).removeClass('ThingButton');
		$(circle).removeClass('is-selected');
		$(circle).addClass('Thing');
		$(this).append(circle);
//		console.log(e, tool, circle, circle.html(), html);
		$(circle).css({position:'absolute', left:e.pageX - zerox - 10, top:e.pageY - zeroy - 10});		
	}
});

$('.Paper').mousemove(function(e){
	paintDrop(this, e);
});


function paintDrop(el, e) {
	//console.log(el, e);
	if (e.type==='mousemove' && ! state.isPainting) {
		return;
	}
	var tool = $('.is-selected');
	if (tool.length===0) return;
	if (tool.hasClass('Delete')) {
		var tgt = e.target;
		// TODO touchmove has no target!
		if (tgt && ($(tgt).hasClass('Thing') || $(tgt).hasClass('Splodge'))) {
			$(tgt).remove();
		} else {
			// quadtree.retrieve();
		}
		return;
	}
	var circle = $("<div class='Splodge'></div>");
	var bc = $('.PaintBox > .is-selected').css('background-color');
	if (!bc) return;
	circle.css('background-color',bc);
	$(el).append(circle);
	$(circle).css({left:e.pageX - zerox - 10, top:e.pageY - zeroy - 10});
	// ensure the paper is selected
	if ( ! $('.active').hasClass('Paper')) {
		$('.PaperTab.active').click();
	}
}


$('.Tool').not('.draggable').each(function(){
	console.log('not-draggable', this);
	  $(this).bind("touchstart", function(e){
		  $(this).click();
	  });
	  $(this).bind("touchmove", function(e){
		  //console.log(e);
	  });	
	  $(this).bind("touchend", function(e){
		  console.log(e);
		  $(this).click();
	  });
});


$(document).on('touchend', '.TouchClick', function(e){
	  console.log(e);
	  $(this).click();
});


paper.bind('touchmove', function(e){
	e.preventDefault();
	var orig = e.originalEvent;
	e.pageX = orig.changedTouches[0].pageX;
	e.pageY = orig.changedTouches[0].pageY;
	paintDrop(this, e);
});
paper.bind('touchstart', function(e){
	e.preventDefault();
	var orig = e.originalEvent;
	console.log(e);
	e.pageX = orig.changedTouches[0].pageX;
	e.pageY = orig.changedTouches[0].pageY;
	paintDrop(this, e);
});
// TODO if you drag your finger from a colour box.


$.fn.draggable = function() {
	return this.each(function() {
		var $el = $(this);
		var pos = $el.position();
		console.log(pos, $el.offset());
		$el.css('position', 'absolute');
		$el.css({top:pos.top, left:pos.left});
		console.log('draggable', this);
		//$(this).attr('draggable', true);
		  var offset = null;
		  var start = function(e) {
			  console.log(e, this);
			  $el.css('z-index', 10000);
		    var orig = e.originalEvent;
		    var pos = $el.position();
		    offset = {
		      x: orig.changedTouches[0].pageX - pos.left,
		      y: orig.changedTouches[0].pageY - pos.top
		    };
		    
		    // HACK 
		    if ($el.hasClass('dino')) {
		    	selectSprite($el);
		    }
		  };
		  
		  var moveMe = function(e) {
			  console.log('moveMe',e,this);
		    e.preventDefault();
		    var orig = e.originalEvent;
		    $el.css({
		      top: orig.changedTouches[0].pageY - offset.y,
		      left: orig.changedTouches[0].pageX - offset.x
		    });
		  };
		  
		  var drop = function(e) {
			  // Find drop-target
			  $('.dropTarget').each(function() {
				  
			  });
		  };
		  
		  $el.bind("touchstart", start);
		  $el.bind("touchmove", moveMe);
		  $el.bind("touchend", drop);
		});
};
	 
$(".draggable").draggable();

// ADD LAYER
$('.NewPaperThing').click(function() {
	// new tab
	var id = 'L' + new Date().getTime();
	var n = $('.PaperTab').length - 1;
	var tab = $("<li><a href='#Paper"+id+"' class='PaperTab' data-toggle='tab'>Layer "+n
		  +"&nbsp;&nbsp;<button type='button' data-target='#Paper"+id+"' class='close Erase'>"
		  +"<small><span class='glyphicon glyphicon-trash'></span></small></button></a></li>");
	$('.NewPaperThing').parent('li').before(tab);
	// todo new paper
	var paper = $("<div class='Paper' id='Paper"+id+"'></div>");
	$('.Paperbackground').before(paper);
});
// ERASE
$('#PaperTabs').on('click', '.PaperTab > .Erase', function() {
	var t = $(this).attr('data-target');
	var ok = confirm("Delete this layer?");
	if ( ! ok) return;
	// No script
	$(t).data('on-start', null); // TODO reorganise script storage, trash all
	updateScriptDisplay($(t), 'start');
	// Always keep the BG and top layers
	if (t==='#Paperbackground' || t==='#PaperThing1' || t==='#PaperThing2') {
		$(t).empty();
	} else {
		$(t).remove();
		$(this).parent('li').remove();
	}
});

});