/* This controller class contains most tree growing functions and some generic utility functions */
ig.module(
	'game.director.controller'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.Controller = ig.Class.extend({

	score: 0,

	/******* UTILITY FUNCTIONS *******/

	randomFromTo: function(from, to) {
       return Math.floor(Math.random() * (to - from + 1) + from);
    },

    inArray: function(arr, obj) {
		return (arr.indexOf(obj) != -1);
	},

	// Calculate what percentage of value2 value1 is.
	calcPercentage: function(value1,value2) {
		return 100 * value1 / value2;
	},

	// Calculate a value2 for targetpercent of value1;
	calcTargetPercentageValue: function(targetpercent,value1) {
		return targetpercent * value1 / 100;
	},

	pickRandomColor: function(rFrom,rTo,gFrom,gTo,bFrom,bTo) {
		var r = this.randomFromTo(rFrom,rTo);
		var g = this.randomFromTo(gFrom,gTo);
		var b = this.randomFromTo(bFrom,bTo);
		return {r: r, g: g, b: b};
	},

	transitionColor: function(currentColor,targetColor) {
		if (currentColor > targetColor) {
			currentColor -= 5;
		}
		else if (currentColor < targetColor) {
			currentColor += 5;
		}
		return currentColor;
	}

});

});