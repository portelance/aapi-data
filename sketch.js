var keys = Object.keys;

var Graph;

var graph;

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



Bar = function(i, x, y1, y2, w, h, r, g, b, a1, a2, label, labelA1, labelA2, startAmt) {

	var amt = startAmt;

	const RACE = 0;
	const ETHNICITY = 1;

	console.log(x, w, h, a1, a2);

	var update = function(newAmt) {
		amt = newAmt;	
		$('.race-labels .label').each(function(index) {
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
		rect(x, lerp(y1, y2, amt), w, h);
	};

	return {
		'draw': draw,
		'update': update
	};
};



Graph = function() {

	const RACE = 0;
	const ETHNICITY = 1;

	var amt = new SoftFloat(0);
	amt.setTarget(RACE);

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
			var x = 600;
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
				var w = data.race[cat] * 5;
			} else {
				var w = data.ethnicity[cat] * 5;
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
				i, x, y1, y2, w, h, r, g, 
				b, a1, a2, label, labelA1, labelA2, amt
			);
			bars.push(bar);

			$('<div>')
				.addClass('label')
				.css({
					'margin-left': 520,
					'margin-top': y1.toString() + 'px'
				})
				.text(label)
				.appendTo($('.race-labels'));
		}
		background(255);
		drawBars();
	};


	var update = function() {
		amt.update();
		for (var i = 0; i < bars.length; i++) {
			bars[i].update(amt.get());
		}
	};


	var drawBars = function() {
		for (var i = 0; i < bars.length; i++) {
			bars[i].draw();
		}
	};


	var draw = function() {
		if (!amt.atTarget()) {
			background(255);
			drawBars();
		}
	};


	var toggleView = function() {
		if (amt.getTarget() === RACE) {
			amt.setTarget(ETHNICITY);
			$('.copy2, .headline2').css('opacity', 1);
			$('.copy1, .headline1').css('opacity', 0);
		} else {
			amt.setTarget(RACE);
			$('.copy2, .headline2').css('opacity', 0);
			$('.copy1, .headline1').css('opacity', 1);
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