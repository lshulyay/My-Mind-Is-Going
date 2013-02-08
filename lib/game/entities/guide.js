ig.module(
	'game.entities.guide'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityGuide = ig.Entity.extend({
    checkAgainst: ig.Entity.TYPE.B,
    size: {x:1, y:1},
    kind: null,
    radius: 10,
    guideRadius: 100,
    alpha: 0.5,
    targetAlpha: 0.5,
    targetRadius: null,
    active: true,
    expansionSpeed: 100,
    contractionSpeed: 300,
    guideContractionSpeed: 50,

    targetTime: null,
    duration: null,
    child: null,

    red: {r: 255, g: 0, b: 0},
    blue: {r: 0, g: 144, b: 255},
    green: {r: 48, g: 255, b: 0},
    purple: {r: 138, g: 0, b: 255},
    gray: {r: 171, g: 171, b: 171},
    number: null,
    color: null,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
        switch (this.kind) {
            case 'red':
                this.targetColor = this.red;
                this.number = 1;
                break;
            case 'blue':
                this.targetColor = this.blue;
                this.number = 2;
                break;
            case 'green':
                this.targetColor = this.green;
                this.number = 3;
                break;
            case 'purple':
                this.targetColor = this.purple;
                this.number = 4;
                break;
            case 'beat':
                this.pos.y = ig.system.height;
                this.targetColor = this.gray;
                this.guideContractionSpeed = 0.5 * ig.system.height;
                this.size.x = ig.system.width;
                this.size.y = 25;
                break;
        }
        this.color = this.targetColor;
	},
	
    update: function() {
        this.parent();

        // If this is not a beat trigger
        if (this.kind !== 'beat') {
            if ( ig.music.currentTrack.currentTime >= this.targetTime && ig.music.currentTrack.currentTime <= this.targetTime + this.duration) {
                this.radius += this.expansionSpeed * ig.system.tick;
            }

            else if (ig.music.currentTrack.currentTime >= this.targetTime && ig.music.currentTrack.currentTime >= this.targetTime + this.duration) {
                this.radius -= this.contractionSpeed * ig.system.tick;
                if (this.radius <= 0) {
                    this.kill();
                }
            }

            else {
                if (this.guideRadius > 0) {
                    this.guideRadius -= this.guideContractionSpeed * ig.system.tick;
                }
            }
        }

        // If this is a beat trigger
        else {
            if (this.pos.y > 0) {
                this.pos.y -= this.guideContractionSpeed * ig.system.tick;
            }
            else {
                this.kill();
            }
        }
    },

    draw: function() {
        ig.game.ctx.save();
        if (this.kind !== 'beat') {
            ig.game.ctx.beginPath();
            ig.game.ctx.arc(this.pos.x, this.pos.y, this.guideRadius, 0 , 2 * Math.PI, false);
            ig.game.ctx.fillStyle = 'rgba(' + this.gray.r + ',' + this.gray.g + ',' + this.gray.b + ',' + 0.3 + ')';
            ig.game.ctx.fill();

            ig.game.ctx.beginPath();
            ig.game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0 , 2 * Math.PI, false);
            ig.game.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
            ig.game.ctx.fill();
            ig.game.ctx.lineWidth = 2;
            ig.game.ctx.strokeStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
            ig.game.ctx.stroke();

            ig.game.ctx.fillStyle = 'white';
            ig.game.ctx.font="25px Arial";
            ig.game.ctx.fillText(this.number, this.pos.x - 7, this.pos.y + 10);
        }

        else {
            ig.game.ctx.beginPath();
            ig.game.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + 0.5 + ')';
            ig.game.ctx.fillRect(0, this.pos.y, this.size.x, this.size.y);
        }

        ig.game.ctx.restore();
    }

});
});