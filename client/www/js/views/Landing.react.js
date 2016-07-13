var AppConstants = require("../constants");
var AppDispatcher = require("../dispatcher");
var getPath = require("../utils").getPath;
var React = require("react");
var ReactDOM = require("react-dom");
var moment = require('moment');
var InputMoment = require('input-moment')
var Geosuggest = require('react-geosuggest').default;
var Send = require('../models/send').Send;


var HumboldtNature = React.createClass({
    render: function() {
    return (
            <div id="humboldt">
                <div className="row humboldt-text">
                    <div className="col-xs-12">
                        <h1> Denn das Ungemessene, ja selbst das Schreckliche in der Natur, alles was unsere Fassungskraft übersteigt, wird in einer romantischen Gegend zur Quelle des Genusses. Die Phantasie übt dann das freie Spiel ihrer Schöpfungen an dem, was von den Sinnen nicht vollständig erreicht werden kann; ihr Wirken nimmt eine andere Richtung bei jedem Wechsel in der Gemüthsstimmung des Beobachters.  </h1>
                    </div>
                </div>
            </div>
        );
    }
});

var BrainForest = React.createClass({
    render: function() {
    return (
            <div id="landing">
                <div className="row drawings">
                    <div className="col-xs-12">
                        <div id="flower"></div>
                        <div id="flower2"></div>
                        <div id="new"></div>
                    </div>
                </div>
                <div className="row text">
                    <div className="col-xs-12">
                        <h2> The brain is a forest of flowers. For best results: add water, nutrients, air, sunlight, love, and affection. Then watch it bloom. </h2>
                    </div>
                </div>
            </div>
        );
    }
});

var DateAndPlaceForm = React.createClass({
    getInitialState() {
        return {
          m: moment(),
          location: '',
          time: ''
        };
    },
    onFocus: function() {
    // console.log('onFocus'); // eslint-disable-line
    },
    onBlur: function(value) {
    },
    onChange: function(value) {
        // console.log('input changes to :' + value); // eslint-disable-line
    },
    onSuggestSelect: function(suggest) {
        this.setState({location: suggest.label});
    },
    handleChange(m) {
     this.setState({m: m});
    },
    handleSave() {
        console.log('time and location', this.state.m._d, this.state.location); 
        var time = this.state.m.format('llll');
        console.log('time', time);
        var place = this.state.location;
        this.setState({time: time, location: place});
        $('#fill').hide();
        $('#send').show();
    },
    clear: function(){
        $('#send').hide();
        $('#fill').show();
    },
    send: function(){
        console.log(this.refs.message.value);
        var message = {};
        message.content = this.refs.message.value;
        message.time = this.state.time;
        message.location = this.state.location;
        Send.sendMessage(message);
    },
    render: function() {
	return (
			<div id="dateForm">
                <div id="send" style={{'display' : 'none'}}>
                    <div className="row meeting-details">
                        <div className="col-xs-12">
                            <div> Place: {this.state.location} </div>
                            <div> Time: {this.state.time} </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <textarea autofocus className="message" cols="50" rows="10" ref="message" placeholder="Leave a metaphor!"></textarea> 
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4"></div>
                        <div className="col-xs-12 col-sm-4">
                            <div className="row">
                                <div className="col-xs-6">
                                    <div className="cancel-btn" onClick={this.clear}> Cancel :( </div>
                                </div>
                                <div className="col-xs-6">
                                    <div className="send-btn" onClick={this.send}> Send :) </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4"></div>
                    </div>
                </div>
                <div id="fill" style={{'display' : 'none'}}>
                   <div>
                    <div className="container-fluid greeting">
                        <div> Can I see you again? </div>
                    </div>
                   </div>
                   <div>
                    <div className="row">
                        <div className="col-xs-12 where"> Where? </div>
                    </div>
                   </div>
                   <div className="geosuggest-input">
                    <Geosuggest 
                        onSuggestSelect={this.onSuggestSelect}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                    />
                    </div>
                    <div className="row">
                        <div className="col-xs-12 when"> When? </div>
                    </div>
                    <form>
                    <div className="date-input">
                      <input
                        type="text"
                        value={this.state.m.format('llll')}
                        readOnly
                      />
                    </div>
                    <div className="date-form">
                    <InputMoment
                      moment={this.state.m}
                      onChange={this.handleChange}
                      onSave={this.handleSave}
                    />
                    </div>
                    </form>
                </div>
	   		</div>
		);
    }
});


AppDispatcher.on(AppConstants.LANDING_PAGE, function(){
    var main = document.querySelector("main");
    ReactDOM.unmountComponentAtNode(main);
    // ReactDOM.render(<DateAndPlaceForm />, main);
    ReactDOM.render(<HumboldtNature />, main);

});


