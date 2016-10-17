var USStatesList = React.createClass({

	getInitialState: function() {
		return {
			'currentState': 'All'
		};
	},

	updateCurrentState: function(stateName) {
		this.setState({
			'currentState': stateName
		});
	},

	render: function() {

		var USStatesData = this.props.USStatesData;
		var USStatesNames = Object.keys(USStatesData);
		USStatesNames.splice(USStatesNames.indexOf('All'), 1);
		USStatesNames.sort();
		USStatesNames = ['All'].concat(USStatesNames);

		var updateCurrentState = this.updateCurrentState;

	    return (
	    	<div className="container">
	    		{USStatesNames.map(function(name) {
	    			var statePopulations = USStatesData[name];
	    			return (
	    				<USState 
		    				name={name} 
		    				all={statePopulations['All']}
		    				hispanic={statePopulations['Hispanic']}
		    				black={statePopulations['Black']}
		    				white={statePopulations['White']}
		    				asian={statePopulations['Asian']}
		    				updateCurrentState={updateCurrentState}
	    				/>
	    			);	
	    		})}
	    		<Vis 
	    			all={USStatesData[this.state.currentState]['All']}
		    		hispanic={USStatesData[this.state.currentState]['Hispanic']}
		    		black={USStatesData[this.state.currentState]['Black']}
		    		white={USStatesData[this.state.currentState]['White']}
		    		asian={USStatesData[this.state.currentState]['Asian']}
	    		/>
	    	</div>
	    );
	}

});



var USState = React.createClass({

	onMouseOver: function() {
		this.props.updateCurrentState(this.props.name);
	},

	render: function() {
		return (
			<div>
				<div className="col-1"></div>
				<div className="col-11 state-name" onMouseOver={this.onMouseOver}>
					{this.props.name}
				</div>
			</div>
		);
	}

});



var Vis = React.createClass({

	componentDidMount: function() {

		var width = 100,
		    height = 100,
		    radius = Math.min(width, height) / 2;

		var color = d3.scaleOrdinal()
	    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

	    var arc = d3.arc()
	    	.outerRadius(radius - 10)
	    	.innerRadius(0);

	    var data = [
	    	this.props.all, 
			this.props.hispanic,
			this.props.black,
			this.props.white,
			this.props.asian
	    ];

		var pie = d3.pie()
			.sort(null);

		var svg = d3.select("#vis").append("svg")
			.attr("width", width)
		    .attr("height", height)
		  	.append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		
		var g = svg.selectAll('.arc')
			.data(pie(data))
			.enter()
			.append('g')
			.attr('class', 'arc');

		g.append('path')
			.attr('d', arc)
			.style('fill', function(d) { return color(d); });

	},

	componentDidUpdate: function() {

		var width = 100,
		    height = 100,
		    radius = Math.min(width, height) / 2;

		var color = d3.scaleOrdinal()
	    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

	    var arc = d3.arc()
	    	.outerRadius(radius - 10)
	    	.innerRadius(0);

	    var data = [
	    	this.props.all, 
			this.props.hispanic,
			this.props.black,
			this.props.white,
			this.props.asian
	    ];

		var pie = d3.pie()
			.sort(null);
		
		var g = d3.select("#vis").select("svg").selectAll('.arc')
			.data(pie(data))
			.attr('class', 'arc');
			.select('path')
			.attr('d', arc)
			.style('fill', function(d) { return color(d); });

	},

	render: function() {
		return (
			<svg id="vis">
			</svg>	
		);
	}

});


React.render(<USStatesList USStatesData={data.state_populations}/>, document.getElementById('wrapper'));

