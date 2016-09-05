var keys = Object.keys;

var Graph;

var graph;

const VIEW_INTRODUCTION = 0;
const VIEW1 = 1;
const VIEW2 = 2;
const VIEW3 = 3;
const VIEW_CONCLUSION = 4

var view = VIEW_INTRODUCTION;

function setup() {
	createCanvas(1024, 768);
	noStroke();
	background(255);
	graph = new Graph();
}

function draw() {
	graph.draw();
	graph.update();
}



Bar = function(i, x, y1, y2, w1, w2, h, r, g, b, a1, a2, label, labelA1, labelA2, startAmt) {

	var amt = startAmt;
	var amt2 = startAmt;

	const RACE = 0;
	const ETHNICITY = 1;

	const HOUSEHOLD = 0;
	const PERCAPITA = 1;

	var update = function(newAmt, newAmt2) {
		amt = newAmt;	
		amt2 = newAmt2;
		$('.race-labels .label').each(function(index) {
			if (i === index) {
				$(this).css({ 
					'margin-top': (lerp(y1, y2, amt)).toString() + 'px', 
					'opacity': lerp(labelA1, labelA2, amt)
				});
			}
		});
		$('.race-labels .number').each(function(index) {
			if (i === index) {
				$(this).css({ 
					'margin-top': (lerp(y1, y2, amt)).toString() + 'px', 
					'opacity': lerp(labelA1, labelA2, amt)
				});
			}
		});

	}

	var draw = function() {

		fill(r, g, b, map(lerp(a1, a2, amt), 0, 1, 0, 100));
		rect(x, lerp(y1, y2, amt), lerp(w1, w2, amt2), h);

		if (a1 !== 0) {
			fill(r, g, b, map(lerp(a1, a2, amt), 0, 1, 0, 30));
			rect(x, lerp(y1, y2, amt), w1, h);
		}
		

	};

	return {
		'draw': draw,
		'update': update
	};
};




Graph = function() {

	const RACE = 0;
	const ETHNICITY = 1;

	const HOUSEHOLD = 0;
	const PERCAPITA = 1;

	var amt = new SoftFloat(0);
	var amt2 = new SoftFloat(0);

	amt.setTarget(RACE);
	amt2.setTarget(HOUSEHOLD);

	var bars = [];

	var catToColor = {
		'All': { 'r': 100, 'g': 100, 'b': 50 },
		'Asian': { 'r': 0, 'g': 0, 'b': 200 },
		'Black': { 'r': 50, 'g': 100, 'b': 255 },
		'White': { 'r': 200, 'g': 50, 'b': 100 },
		'Hispanic': { 'r': 150, 'g': 200, 'b': 150 }
	};

	var initGraph = function() {
		
		var races = keys(data.race);
		var ethnicities = keys(data.ethnicity);
		
		races.sort();
		ethnicities.sort();

		var cats = [];
		for (var i = 0; i < races.length; i++) {
			if (races[i] !== 'All') {
				cats.push(races[i]);
			}
		}
		for (var i = 0; i < ethnicities.length; i++) {
			cats.splice(cats.indexOf('Asian'), 0, ethnicities[i]);
		}

		for (var i = 0; i < cats.length; i++) {
			var cat = cats[i];
			var x = 480;
			if (races.indexOf(cat) !== -1) {
				var y1 = 122 + 25 * races.indexOf(cat);
			} else {
				var y1 = 122 + 25 * races.indexOf('Asian');
			}
			if (races.indexOf(cat) !== - 1 && i > races.indexOf('Asian')) {
				var y2 = 147 + 25 * (i - 1);
			} else {
				var y2 = 147 + 25 * i;
			}
			if (races.indexOf(cat) !== -1) {
				var w1 = data.race[cat] * 5;
			} else {
				var w1 = data.ethnicity[cat] * 5;
			}
			if (races.indexOf(cat) !== -1) {
				var w2 = data.percapita[cat] * 5;
			} else {
				var w2 = data.ethnicity[cat] * 5;
			}
			var h = 20;
			if (cat in catToColor) {
				var r = catToColor[cat]['r']; 
				var g = catToColor[cat]['g'];
				var b = catToColor[cat]['b'];
			} else {
				var r = catToColor['Asian']['r'];
				var g = catToColor['Asian']['g'];
				var b = catToColor['Asian']['b'];
			}
			if (races.indexOf(cat) !== -1) {
				if (cat === 'Asian') {
					var a1 = 1;
					var a2 = 0;
				} else {
					var a1 = 1;
					var a2 = .3;
				}
			} else {
				var a1 = 0;
				var a2 = 1;
			}
			var label = cat;
			if (races.indexOf(cat) !== -1) {
				if (cat === 'Asian') {
					var labelA1 = 1;
					var labelA2 = 0;
				} else {
					var labelA1 = 1;
					var labelA2 = .3;
				}
			} else {
				var labelA1 = 0;
				var labelA2 = 1;
			}
			var amt = 0;
			var bar = new Bar(
				i, x, y1, y2, w1, w2, h, r, g, 
				b, a1, a2, label, labelA1, labelA2, amt
			);
			bars.push(bar);

			$('<div>')
				.addClass('label')
				.css({
					'margin-left': 400,
					'margin-top': y1.toString() + 'px'
				})
				.text(label)
				.appendTo($('.race-labels'));

			$('<div>')
				.addClass('number')
				.css({
					'margin-left': 400 + w1 + 40,
					'margin-top': y1.toString() + 'px'
				})
				.text("$" + (w1 / 5).toString() + "k")
				.appendTo($('.race-labels'));
		}
		background(255);
		drawBars();
	};


	var update = function() {
		amt.update();
		amt2.update();
		for (var i = 0; i < bars.length; i++) {
			bars[i].update(amt.get(), amt2.get());
		}
	};


	var drawBars = function() {
		for (var i = 0; i < bars.length; i++) {
			bars[i].draw();
		}
	};


	var draw = function() {
		if (!amt.atTarget() || !amt2.atTarget()) {
			background(255);
			drawBars();
		}
	};


	var toggleView = function() {

		if (view === VIEW_INTRODUCTION) {

			amt.setTarget(RACE);
			amt2.setTarget(HOUSEHOLD);
			
			$('#defaultCanvas0').css('opacity', 1);
			$('.copy1, .copy2, .copy3, .headline1, .headline2, .headline3').css('opacity', 1);
			$('.race-labels').css('opacity', 1);
			$('#defaultCanvas0').css('opacity', 1);
			$('.race-labels').css('opacity', 1);

			$('.headline, .copy').css('opacity', 0);
			$('.headline1, .copy1').css('opacity', 1);
			
			view = VIEW1;

		} else if (view === VIEW1) {

			amt.setTarget(ETHNICITY);
			amt2.setTarget(HOUSEHOLD);

			$('.headline, .copy').css('opacity', 0);
			$('.headline2, .copy2').css('opacity', 1);

			view = VIEW2;

		} else if (view === VIEW2) {

			amt.setTarget(RACE);
			amt2.setTarget(PERCAPITA);

			$('.headline, .copy').css('opacity', 0);
			$('.headline3, .copy3').css('opacity', 1);

			view = VIEW3;

		} else if (view === VIEW3) {


			$('#defaultCanvas0').css('opacity', 0);
			$('.copy1, .copy2, .copy3, .headline1, .headline2, .headline3').css('opacity', 0);
			$('.race-labels').css('opacity', 0);
			$('#defaultCanvas0').css('opacity', 0);
			$('.race-labels').css('opacity', 0);
			$('.headline, .copy').css('opacity', 0);
			$('.headline4, .copy4').css('opacity', 1);

			view = VIEW_CONCLUSION;
		}
	};

	initGraph();

	return {
		'draw': draw,
		'toggleView': toggleView,
		'update': update
	};
};


function mouseClicked() { 
	graph.toggleView();
}
