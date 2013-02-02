ig.module(
	'game.entities.pointer'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityPointer = ig.Entity.extend({
    checkAgainst: ig.Entity.TYPE.B,
    size: {x:1, y:1},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
        ig.game.pointer = this;
	},
	
    update: function() {
        this.pos.x = ig.input.mouse.x;
        this.pos.y = ig.input.mouse.y;
    },

    check: function( other ) {
        if (other.cursorFade && other.active) {
            if (other.alpha >= 0.15) {
                other.alpha -= 0.03;
            }
        }

        // console.log('other: ' + other.kind);
        if (ig.input.pressed('click') && other.active && other.clickable ) {
            other.clicked();
        }
    }

});
});