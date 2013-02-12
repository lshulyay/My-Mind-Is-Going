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
    active: true,
    expansionSpeed: 100,
    contractionSpeed: 300,
    parentGuide: null,

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
                break;
            case 'blue':
                this.color = this.blue;
                break;
            case 'green':
                this.color = this.green;
                break;
            case 'purple':
                this.color = this.purple;
                break;
        }
        var allGuides = ig.game.getEntitiesByType(EntityGuide);
        for (var i = 0; i < allGuides.length; i++) {
            var guide = allGuides[i];
            if (guide.child === null
                && this.pos.x <= guide.pos.x + guide.radius
                && this.pos.x >= guide.pos.x - guide.radius
                && this.pos.y <= guide.pos.y + guide.radius
                && this.pos.y >= guide.pos.y - guide.radius) {
                this.parentGuide = guide;
                guide.child = this;
                guide.childSet = true;

                // Percentage offset of positions x and y from guide pos x and y
                var xOffset = Math.abs(100 - ig.game.controller.calcPercentage(this.pos.x, guide.pos.x));
                var yOffset = Math.abs(100 - ig.game.controller.calcPercentage(this.pos.y, guide.pos.y));

                // Subtract xOffset and yOffset percentage from 0.5
                var xOffsetPoints = ig.game.controller.calcTargetPercentageValue(xOffset, this.parentGuide.posValue);
                var yOffsetPoints = ig.game.controller.calcTargetPercentageValue(yOffset, this.parentGuide.posValue);

                this.parentGuide.posValue -= xOffsetPoints + yOffsetPoints;
                this.parentGuide.tempPoints = 100 - (1 - this.parentGuide.posValue) * 100;
                break;
            }
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
                if (this.parentGuide) {
                    this.parentGuide.child = null;
                }
                this.kill();
            }
        }

    /*    if (this.parentGuide) {
            var radiusOffset = Math.abs(100 - ig.game.controller.calcPercentage(this.radius, this.parentGuide.radius));
            var radiusOffsetPoints = ig.game.controller.calcTargetPercentageValue(radiusOffset, this.sizeValue);
            var minus;
            if (!this.parentGuide.active) {
                console.log('contracting');
                minus = radiusOffsetPoints / 1500;
            }

            else {
                minus = radiusOffsetPoints / 100;
            }
            if (minus < this.sizeValue) {
                this.sizeValue -= minus;
            }
            else {
                this.sizeValue = 0;
            }
        
            this.tempPoints = (this.posValue + this.sizeValue) * 100;

        } */
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

EntityPoints = ig.Entity.extend({
    size: {x:1, y:1},
    kind: null,
    radius: 1,
    alpha: 0.8,
    active: true,
    lifespan: 3,
    points: null,
    text: null,
    gray: {r: 171, g: 171, b: 171},
    red: {r: 255, g: 0, b: 0},
    green: {r: 48, g: 255, b: 0},


    init: function(x, y, settings) {
        this.parent(x, y, settings);
        if (this.points > 80) {
            this.color = this.green;
            if (this.points !== 100) {
                this.text = this.points + " - Great!";
            }
            else {
                this.text = this.points + " - PERFECT!";
            }
        }
        else if (this.points < 50 ) {
            this.color = this.red;
            this.text = this.points + " - Disappointing.";
        }

        else {
            this.color = this.gray;
            this.text = this.points + " - Ok.";
        }
    },
    
    update: function() {
        this.parent();
        this.pos.y -= 0.5;
        this.alpha -= 0.01;
        if (this.alpha <= 0.01) {
            this.kill();
        }
    },

    draw: function() {
        ig.game.ctx.save();
        ig.game.ctx.fillStyle = 'rgba(' + this.color.r + ',' + this.color.g + ',' + this.color.b + ',' + this.alpha + ')';
        ig.game.ctx.font="25px Arial";
        ig.game.ctx.fillText(this.text, this.pos.x, this.pos.y);
        ig.game.ctx.restore();
    }

});
});