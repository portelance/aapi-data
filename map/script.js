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
		var currentState = this.state.currentState;

		var USStatesRows = [];
		var currentRow = [];
		for (var i = 0; i < USStatesNames.length; i++) {
			var name = USStatesNames[i] || "";
			if (i % 2 === 0) {
				currentRow = [name];
			} else {
				currentRow.push(name);
				USStatesRows.push(currentRow);
			}
		}

	    return (
	    	<div id="state-index">
	    		{USStatesRows.map(function(row) {
	    			var statePopulationsLeft = USStatesData[row[0]];
	    			var statePopulationsRight = USStatesData[row[1]];
					return (
	    				<USStateRow 
		    				names={row} 
		    				updateCurrentState={updateCurrentState}
		    				currentState={currentState}
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



var USStateRow = React.createClass({

	onClickLeft: function() {
		this.props.updateCurrentState(this.props.names[0]);
	},

	onClickRight: function() {
		this.props.updateCurrentState(this.props.names[1]);
	},

	render: function() {

		var selectedLeft = this.props.currentState === this.props.names[0] ? "selected" : "";
		var selectedRight = this.props.currentState === this.props.names[1] ? "selected" : "";

		return (
			<div>
				<div className={"col-2 state-name " + selectedLeft} onClick={this.onClickLeft}>
					{this.props.names[0]}
				</div>
				<div className={"col-10 state-name " + selectedRight} onClick={this.onClickRight}>
					{this.props.names[1]}
				</div>
			</div>
		);
	}

});



var Vis = React.createClass({

	componentDidMount: function() {

		var radius = 100;

		var color = d3.scaleOrdinal()
	    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

	    var arc = d3.arc()
	    	.outerRadius(radius - 10)
	    	.innerRadius(0);

	    var data = [
			this.props.hispanic,
			this.props.black,
			this.props.white,
			this.props.asian
	    ];

		var pie = d3.pie()
			.sort(null);

		var svg = d3.select("#vis").append("svg")
			.attr("width", radius * 2)
		    .attr("height", radius * 2)
		  	.append("g")
		    .attr("transform", "translate(" + radius + "," + radius + ")")
		
		var g = svg.selectAll('.arc')
			.data(pie(data))
			.enter()
			.append('g')
			.attr('class', 'arc');

		g.append('path')
			.attr('d', arc)
			.style('fill', function(d, i) { return color(i); });

	},

	componentDidUpdate: function() {

		var radius = 100;

		var color = d3.scaleOrdinal()
	    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

	    var arc = d3.arc()
	    	.outerRadius(radius - 10)
	    	.innerRadius(0);

	    var data = [
			this.props.hispanic,
			this.props.black,
			this.props.white,
			this.props.asian
	    ];

		var pie = d3.pie()
			.sort(null);
		
		var g = d3.select("#vis").select("svg").selectAll('.arc')
			.data(pie(data))
			.attr('class', 'arc')
			.select('path')
			.attr('d', arc)
			.style('fill', function(d, i) { return color(i); });

	},

	render: function() {
		return (
			<svg id="vis">
			</svg>	
		);
	}

});



React.render(<USStatesList USStatesData={data.state_populations}/>, document.getElementById('wrapper'));