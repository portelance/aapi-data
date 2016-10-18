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

		var radius = 200;
		var labelRadius = 120;

		var color = d3.scaleOrdinal()
	    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

	    var arc = d3.arc()
	    	.outerRadius(radius)
	    	.innerRadius(0);

	    var labelArc = d3.arc()
	    	.outerRadius(radius - 20)
	    	.innerRadius(0);

	    var data = [
			this.props.hispanic,
			this.props.black,
			this.props.white,
			this.props.asian
	    ];

		var pie = d3.pie().sort(null)(data);

		d3.select("#vis")
		  	.append("g")
		    .attr("transform", "translate(" + radius + "," + radius + ")");

		var arcs = d3.select('#vis g')    
			.selectAll('.arc')
			.data(pie)
			.enter()
			.append('g')
			.attr('class', 'arc');

		arcs.append('path')
			.attr('d', arc)
			.style('fill', function(d, i) { 
				return color(i) 
			});

		arcs.append('text')
			.attr("transform", function(d) { 
				return "translate(" + labelArc.centroid(d) + ")"; 
			})
			.text(function(d) {
				return d.data;
			})
			.style('font-size', '11px');

	},

	componentDidUpdate: function() {

		var radius = 200;
		var labelRadius = 120;

		var color = d3.scaleOrdinal()
	    	.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

	    var arc = d3.arc()
	    	.outerRadius(radius)
	    	.innerRadius(0);

	    var labelArc = d3.arc()
	    	.outerRadius(radius - 20)
	    	.innerRadius(0);

	    var data = [
			this.props.hispanic,
			this.props.black,
			this.props.white,
			this.props.asian
	    ];

		var pie = d3.pie().sort(null)(data);

		d3.select('#vis g')    
			.selectAll('.arc path')
			.data(pie)
			.attr('d', arc);

		d3.select('#vis g')
			.selectAll('.arc text')
			.data(pie)
			.attr("transform", function(d) { 
				return "translate(" + labelArc.centroid(d) + ")"; 
			})
			.text(function(d) {
				return d.data;
			});

	},

	render: function() {
		return (
			<svg id="vis"></svg>	
		);
	}

});



React.render(<USStatesList USStatesData={data.state_populations}/>, document.getElementById('wrapper'));