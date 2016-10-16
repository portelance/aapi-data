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
		d3.select('#vis')
			.append('g')
			.selectAll('rect')
			.data([
				this.props.all, 
				this.props.hispanic,
				this.props.black,
				this.props.white,
				this.props.asian
			])
			.enter()
			.append('rect')
			.attr('y', function(d, i) { return i * 20 + 'px'})
			.attr('width', function(d) { return d / 100000 + 'px'; })
			.attr('height', '20px');
	},

	componentDidUpdate: function() {

		console.log(this.props);

		d3.select('#vis')
			.selectAll('rect')
			.data([
				this.props.all, 
				this.props.hispanic,
				this.props.black,
				this.props.white,
				this.props.asian
			])
			.attr('y', function(d, i) { return i * 20 + 'px'})
			.attr('width', function(d) { return d / 100000 + 'px'; })
			.attr('height', '20px');
	},

	render: function() {
		return (
			<svg id="vis">
			</svg>	
		);
	}

});


React.render(<USStatesList USStatesData={data.state_populations}/>, document.getElementById('wrapper'));

