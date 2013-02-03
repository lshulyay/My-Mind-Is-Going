ig.module(
	'game.entities.live'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityLive = ig.Entity.extend({
    checkAgainst: ig.Entity.TYPE.B,
    size: {x:1, y:1},
    kind: null,
    radius: 1,
    alpha: 0.8,
    targetRadius: null,
    active: true,
    expansionSpeed: 100,
    contractionSpeed: 300,

    red: {r: 255, g: 0, b: 0},
    blue: {r: 0, g: 144, b: 255},
    green: {r: 48, g: 255, b: 0},
    purple: {r: 138, g: 0, b: 255},
    color: null,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
        switch (this.kind) {
            case 'red': 
                this.color = this.red;
                console.log('red');
                break;
            case 'blue':
                this.color = this.blue;
                console.log('blue');
                break;
            case 'green':
                this.color = this.green;
                break;
            case 'purple':
                this.color = this.purple;
                break;
        }
	},
	
    update: function() {
        this.parent();
        if (ig.input.state('1') && this.kind === 'red' && this.active ||
            ig.input.state('2') && this.kind === 'blue' && this.active ||
            ig.input.state('3') && this.kind === 'green' && this.active ||
            ig.input.state('4') && this.kind === 'purple' && this.active) {
            this.radius += this.expansionSpeed * ig.system.tick;
        }

        else {
            this.active = false;
            this.radius -= this.contractionSpeed * ig.system.tick;
            if (this.radius <= 0) {
                this.kill();
            }
        }
    },

    draw: function() {
        ig.game.ctx.save();
        ig.game.ctx.beginPath();
        ig.game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0 , 2 * Math.PI, false);
        ig.game.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
        ig.game.ctx.fill();
        ig.game.ctx.lineWidth = 2;
        ig.game.ctx.strokeStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + 1 + ')';
        ig.game.ctx.stroke();
        ig.game.ctx.restore();    
    }

});
});