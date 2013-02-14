ig.module(
	'game.entities.guide'
)
.requires(
	'impact.entity'
)

.defines(function(){

EntityGuide = ig.Entity.extend({
    size: {x:1, y:1},
    kind: null,
    radius: 10,
    guideRadius: 100,
    alpha: 0.3,
    active: false,
    expansionSpeed: 100,
    contractionSpeed: 300,
    guideContractionSpeed: 50,

    targetTime: null,
    duration: null,
    child: null,
    childSet: false,

    posValue: 0.5,      // Points for positioning
    sizeValue: 1,     // Points for size matching
    tempPoints: null,   // (posValue + sizeValue) * 100 before kill

    red: {r: 255, g: 0, b: 0},
    blue: {r: 0, g: 144, b: 255},
    green: {r: 48, g: 255, b: 0},
    purple: {r: 138, g: 0, b: 255},
    gray: {r: 171, g: 171, b: 171},
    number: null,
    targetColor: null,
    color: null,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
        // Set attributes depending on guide kind. 
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
            // Expand radius while it is meant to be alive
            if ( ig.music.currentTrack.currentTime >= this.targetTime && ig.music.currentTrack.currentTime <= this.targetTime + this.duration) {
                this.active = true;
                this.radius += this.expansionSpeed * ig.system.tick;
            }

            // Contract radius when it's time to die
            else if (ig.music.currentTrack.currentTime >= this.targetTime && ig.music.currentTrack.currentTime >= this.targetTime + this.duration) {
                this.active = false;
                this.radius -= this.contractionSpeed * ig.system.tick;
                // When guide radius is 0, calculate points
                if (this.radius <= 0) {
                    if (this.childSet) {
                        this.tempPoints = Math.round(this.sizeValue * 100);
                        ig.game.controller.score += Math.round(this.tempPoints);
                        ig.game.spawnEntity(EntityPoints, this.pos.x, this.pos.y, {points: this.tempPoints});
                    }

                    // If no live entity was spawned for this guide, points awarded are 0
                    else {
                        this.tempPoints = 0;
                        ig.game.spawnEntity(EntityPoints, this.pos.x, this.pos.y, {points: this.tempPoints});
                    }
                    this.kill();
                }
            }

            else {
                // Gray guide silhouette contracts to give user time to get ready
                if (this.guideRadius > 0.5) {
                    this.guideRadius -= this.guideContractionSpeed * ig.system.tick;
                }
            }

            // Calculate how many points to remove for radius offset
            if (this.childSet) {
                var minus = 0;
                if (this.child) {
                    var radiusOffset = Math.abs(100 - ig.game.controller.calcPercentage(this.child.radius, this.radius));
                    var radiusOffsetPoints = ig.game.controller.calcTargetPercentageValue(radiusOffset, this.sizeValue);
                    if (!this.active) {
                        minus = radiusOffsetPoints / 400; // If contracting, be more lenient as player has less warning
                    }
                    else {
                        minus = radiusOffsetPoints / 200; // When expanding remove more points as player has more warning
                    }
                }

                // Work on this:
                else {
                    var radiusOffset = Math.abs(100 - ig.game.controller.calcPercentage(0, this.radius));
                    var radiusOffsetPoints = ig.game.controller.calcTargetPercentageValue(radiusOffset, this.sizeValue);
                    minus = radiusOffsetPoints / 100;
                }

                if (minus < this.sizeValue) {
                    this.sizeValue -= minus;
                }
                else {
                    this.sizeValue = 0;
                }
            }

            // If expanding and child is not set, reduce points
            else if (this.active && !this.childSet) {
                this.sizeValue -= 0.6 * ig.system.tick;
            }

        }

        // If this is a beat guide
        else {
            // Make it travel upward
            if (this.pos.y > -100) {
                this.pos.y -= this.guideContractionSpeed * ig.system.tick;
            }

            // Kill when beat guide is too high
            else if (this.pos.y <= -100) {
                ig.game.spawnEntity(EntityPoints, this.pos.x, this.pos.y + 150, {points: ig.game.controller.beatPoints});
                ig.game.controller.beatPoints = 0;
                this.kill();
            }

            // If Space is pressed and a beat guide is in the appropriate position, award points.
            if (ig.input.pressed('space')) {
                if (this.kind === 'beat') {
                    if (this.pos.y <= 30) {
                        ig.game.controller.beatPoints = ig.game.controller.maxBeatPoints;
                    }
                }
            }

        }
    },

    draw: function() {
        ig.game.ctx.save();
        if (this.kind !== 'beat') {
            ig.game.ctx.beginPath();
            if (this.guideRadius > 0) {
                ig.game.ctx.arc(this.pos.x, this.pos.y, this.guideRadius, 0 , 2 * Math.PI, false);
                ig.game.ctx.fillStyle = 'rgba(' + this.gray.r + ',' + this.gray.g + ',' + this.gray.b + ',' + 0.3 + ')';
                ig.game.ctx.fill();
            }

            ig.game.ctx.beginPath();
            ig.game.ctx.arc(this.pos.x, this.pos.y, this.radius, 0 , 2 * Math.PI, false);
            ig.game.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
            ig.game.ctx.fill();
            ig.game.ctx.lineWidth = 2;
            ig.game.ctx.strokeStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
            ig.game.ctx.stroke();

            ig.game.ctx.fillStyle = 'white';
            ig.game.ctx.font="19pt Arial";
            ig.game.ctx.fillText(this.number, this.pos.x - 7, this.pos.y + 10);
        }

        else {
            ig.game.ctx.beginPath();
            ig.game.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + 0.3 + ')';
            ig.game.ctx.fillRect(0, this.pos.y, this.size.x, this.size.y);
        }

        ig.game.ctx.restore();
    }

});
});