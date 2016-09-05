var keys = Object.keys;

var App, Graph, Bar, app, graph, bar;

// views
const INTRO = 0;
const RACE = 1;
const ETHNICITY = 2;
const SIZE = 3;
const SIZE_COLLAPSE = 4;
const PERCAPITA = 5;
const OUTRO = 6;

var view = INTRO;
var targetView = null;

// bars
const PRIMARY = 1;
const SECONDARY = 2;

function setup() {
	createCanvas(1024, 768);
	noStroke();
	background(255);
	graph = new Graph();
	app = new App();
}

function draw() {
	graph.draw();
	graph.update();
	app.update();
}


var Bar = function(i, viewProps) {

	var views = viewProps;

	var draw = function(view1, view2, amt) {

		console.log(view1, view2, amt);

		// primary bars
		var r1 = lerp(views[view1][PRIMARY]['r'], views[view2][PRIMARY]['r'], amt);
		var g1 = lerp(views[view1][PRIMARY]['g'], views[view2][PRIMARY]['g'], amt);
		var b1 = lerp(views[view1][PRIMARY]['b'], views[view2][PRIMARY]['b'], amt);
		var a1 = lerp(views[view1][PRIMARY]['a'], views[view2][PRIMARY]['a'], amt);
		fill(r1, g1, b1, map(a1, 0, 1, 0, 100));

		var x1 = lerp(views[view1][PRIMARY]['x'], views[view2][PRIMARY]['x'], amt);
		var y1 = lerp(views[view1][PRIMARY]['y'], views[view2][PRIMARY]['y'], amt);
		var w1 = lerp(views[view1][PRIMARY]['w'], views[view2][PRIMARY]['w'], amt);
		var h1 = lerp(views[view1][PRIMARY]['h'], views[view2][PRIMARY]['h'], amt);
		rect(x1, y1, w1, h1);

		// secondary bars
		var r2 = lerp(views[view1][SECONDARY]['r'], views[view2][SECONDARY]['r'], amt);
		var g2 = lerp(views[view1][SECONDARY]['g'], views[view2][SECONDARY]['g'], amt);
		var b2 = lerp(views[view1][SECONDARY]['b'], views[view2][SECONDARY]['b'], amt);
		var a2 = lerp(views[view1][SECONDARY]['a'], views[view2][SECONDARY]['a'], amt);
		fill(r2, g2, b2, map(a2, 0, 1, 0, 100));

		var x2 = lerp(views[view1][SECONDARY]['x'], views[view2][SECONDARY]['x'], amt);
		var y2 = lerp(views[view1][SECONDARY]['y'], views[view2][SECONDARY]['y'], amt);
		var w2 = lerp(views[view1][SECONDARY]['w'], views[view2][SECONDARY]['w'], amt);
		var h2 = lerp(views[view1][SECONDARY]['h'], views[view2][SECONDARY]['h'], amt);
		rect(x2, y2, w2, h2);

		// left labels

		$('.labels .left-label').each(function(index) {
			if (i === index) {
				$(this).css({ 
					'margin-top': y2.toString() + 'px', 
					'opacity': map(a1, 0, 100, 0, 1)
				});
			}
		});

	};

	return {
		'draw': draw
	};
};

var Graph = function() {

	var amt = new SoftFloat(0);

	var bars = [];
	
	var catToColor = {
		'Asian': { 'r': 0, 'g': 0, 'b': 200 },
		'Black': { 'r': 50, 'g': 100, 'b': 255 },
		'White': { 'r': 200, 'g': 50, 'b': 100 },
		'Hispanic': { 'r': 150, 'g': 200, 'b': 150 }
	};


	function initBars() {

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

			var views = {};

			var collapsedY = (function() {
				if (races.indexOf(cat) !== -1) {
					return 122 + 25 * races.indexOf(cat);
				} else {
					return 122 + 25 * races.indexOf('Asian');
				}
			})();

			var expandedY = (function() {
				if (races.indexOf(cat) !== - 1 && i > races.indexOf('Asian')) {
					return 147 + 25 * (i - 1);
				} else {
					return 147 + 25 * i;
				}
			})();

			var householdIncomeW = (function() {
				if (races.indexOf(cat) !== -1) {
					return data.race[cat] * 5;
				} else {
					return data.ethnicity[cat] * 5;
				}
			})();

			var householdSizeW = (function() {
				if (races.indexOf(cat) !== -1) {
					return data.size[cat] * 30;
				} else {
					return 0;
				}
			})();

			var percapitaIncomeW = (function() {
				if (races.indexOf(cat) !== -1) {
					return data.percapita[cat] * 5;
				} else {
					return 0;
				}
			})();

			var r = cat in catToColor ? catToColor[cat]['r'] : catToColor['Asian']['r'];
			var g = cat in catToColor ? catToColor[cat]['g'] : catToColor['Asian']['g'];
			var b = cat in catToColor ? catToColor[cat]['b'] : catToColor['Asian']['b'];

			var raceA = races.indexOf(cat) !== -1 ? 1 : 0;
			var ethnicityA = (function() {
				if (races.indexOf(cat) !== -1) {
					if (cat === 'Asian') {
						return 0;
					} else {
						return .3;
					}
				} else {
					return 1;
				}	
			})();
			var secondaryRaceA = races.indexOf(cat) !== -1 ? .2 : 0;

			views[INTRO] = {};
			views[RACE] = {};
			views[ETHNICITY] = {};
			views[SIZE] = {};
			views[SIZE_COLLAPSE] = {};
			views[PERCAPITA] = {};
			views[OUTRO] = {};

			views[INTRO][PRIMARY] = {	
				'x': 480,
				'y': collapsedY,
				'w': 0,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0
			};
			views[INTRO][SECONDARY] = {
				'x': 480,
				'y': collapsedY,
				'w': 0,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0
			};
			views[RACE][PRIMARY] = {
				'x': 480,
				'y': collapsedY,
				'w': householdIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': raceA,
			};
			views[RACE][SECONDARY] = { 
				'x': 480,
				'y': collapsedY,
				'w': householdIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0,
			};
			views[ETHNICITY][PRIMARY] = {
				'x': 480,
				'y': expandedY,
				'w': householdIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': ethnicityA
			};
			views[ETHNICITY][SECONDARY] = { 
				'x': 480,
				'y': expandedY,
				'w': householdIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0
			};
			views[SIZE][PRIMARY] = {
				'x': 480,
				'y': collapsedY,
				'w': householdSizeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': raceA,
			};
			views[SIZE][SECONDARY] = {
				'x': 480,
				'y': expandedY,
				'w': householdIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0
			};
			views[SIZE_COLLAPSE][PRIMARY] = {
				'x': 480,
				'y': collapsedY,
				'w': 0,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': raceA,
			};
			views[SIZE_COLLAPSE][SECONDARY] = {
				'x': 480,
				'y': collapsedY,
				'w': 0,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0,
			};
			views[PERCAPITA][PRIMARY] = {
				'x': 480,
				'y': collapsedY,
				'w': percapitaIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': raceA,
			};
			views[PERCAPITA][SECONDARY] = { 
				'x': 480,
				'y': collapsedY,
				'w': householdIncomeW,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': secondaryRaceA,
			};
			views[OUTRO][PRIMARY] = {
				'x': 480,
				'y': collapsedY,
				'w': 0,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0
			};
			views[OUTRO][SECONDARY] = {
				'x': 480,
				'y': collapsedY,
				'w': 0,
				'h': 20,
				'r': r,
				'g': g,
				'b': b,
				'a': 0
			};

			var bar = new Bar(i, views);
			bars.push(bar);


			$('<div>')
				.addClass('left-label')
				.css({
					'margin-left': 400,
					'margin-top': collapsedY.toString() + 'px'
				})
				.text(cat)
				.appendTo($('.labels'));
		}


	}

	var draw = function() {
		if (targetView !== null) {
			background(255);
			for (var i = 0; i < bars.length; i++) {
				bars[i].draw(view, targetView, amt.get());
			}
		}
	};

	var update = function() {

		if (targetView !== null) {
			amt.setTarget(1);
			amt.update();

			if (amt.atTarget()) {
				view = targetView;
				targetView = null;
				amt.set(0);
				if (view === SIZE_COLLAPSE) {
					targetView = PERCAPITA;
				}
			}
		}
		
	};

	initBars();

	return {
		'update': update,
		'draw': draw
	};

};

var App = function() {

	var appView = INTRO;

	$('#defaultCanvas0, .copy, .labels').css('opacity', 0);
	$('.copy.intro, .headline.intro').css('opacity', 1);

	var update = function() {

		if (appView !== targetView) {
			
			appView = targetView;

			switch(appView) {

				case RACE:
					$('#defaultCanvas0, .labels').css('opacity', 1);
					$('.copy, .headline').css('opacity', 0);
					$('.copy.race, .headline.race').css('opacity', 1);
					break;
				
				case ETHNICITY:
					$('#defaultCanvas0, .labels').css('opacity', 1);
					$('.copy, .headline').css('opacity', 0);
					$('.copy.ethnicity, .headline.ethnicity').css('opacity', 1);
					break;
				
				case SIZE:
					$('#defaultCanvas0, .labels').css('opacity', 1);
					$('.copy, .headline').css('opacity', 0);
					$('.copy.size, .headline.size').css('opacity', 1);
					break;

				case PERCAPITA:
					$('#defaultCanvas0, .labels').css('opacity', 1);
					$('.copy, .headline').css('opacity', 0);
					$('.copy.percapita, .headline.percapita').css('opacity', 1);
					break;
				
				case OUTRO:
					$('#defaultCanvas0, .copy, .labels').css('opacity', 0);
					$('.copy, .headline').css('opacity', 0);
					$('.copy.outro, .headline.outro').css('opacity', 1);
					break;
			}

		}
	}

	return {
		'update': update
	};
}


function mouseClicked() { 

	if (view === SIZE_COLLAPSE) {
		targetView = OUTRO;
	} else {
		targetView = view + 1;
	}
}
