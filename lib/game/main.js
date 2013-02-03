ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.main',

	'game.director.controller',

	'game.entities.live',
	'game.entities.guide',
	'game.entities.pointer',

	'impact.debug.debug'

)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	controller: new ig.Controller(),

	font: new ig.Font( 'media/04b03.font.png' ),
	currentLevel: null,
	virusMusic: new ig.Sound( 'media/virus.*' ),

	triggerMarks: null,

	guideBuffer: 2,
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		ig.input.bind( ig.KEY._1, '1' ); // Red
		ig.input.bind( ig.KEY._2, '2' ); // Blue
		ig.input.bind( ig.KEY._3, '3' ); // Green
		ig.input.bind( ig.KEY._4, '4' ); // Purple
		ig.input.bind( ig.KEY._5, '5' );
		this.ctx = ig.system.context;
		ig.music.add( this.virusMusic, ['virus'] );
		ig.music.volume = 1;
		this.loadLevel(LevelMain);
	},

	loadLevel: function( data ) {
		this.currentLevel = data;
		this.parent( data );
		this.spawnEntity( EntityPointer, 0, 0 );
		if (this.currentLevel === LevelMain) {
			this.setTriggerMarks();
			ig.music.play(['virus']);
		}
	},

	setTriggerMarks: function() {
		this.triggerMarks = [
					{mark: 5.55, duration: 2, kind: 'red', active: true},
					{mark: 8.90, duration: 2, kind: 'blue', active: true},
					{mark: 12.09, duration: 1, kind: 'red', active: true},
					{mark: 13.71, duration: 1, kind: 'blue', active: true},
					{mark: 15.33, duration: 1, kind: 'green', active: true},
					{mark: 17.01, duration: 0, kind: 'beat', active: true}
		];
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		if (ig.input.pressed('1')) {
			this.spawnEntity(EntityLive, this.pointer.pos.x, this.pointer.pos.y, {kind: 'red'});
		}
		else if (ig.input.pressed('2')) {
			this.spawnEntity(EntityLive, this.pointer.pos.x, this.pointer.pos.y, {kind: 'blue'});
		}
		else if (ig.input.pressed('3')) {
			this.spawnEntity(EntityLive, this.pointer.pos.x, this.pointer.pos.y, {kind: 'green'});
		}
		else if (ig.input.pressed('4')) {
			this.spawnEntity(EntityLive, this.pointer.pos.x, this.pointer.pos.y, {kind: 'purple'});
		}
		else if (ig.input.pressed('5')) {
			console.log('w0t');
		}
		if (this.triggerMarks.length > 0) {
			if ( ig.music.currentTrack.currentTime >= this.triggerMarks[0].mark - 2) {
				var currentMark = this.triggerMarks[0];
				var posX = ig.game.controller.randomFromTo(5, ig.system.width - 5);
				var posY = ig.game.controller.randomFromTo(5, ig.system.height - 5);
				this.spawnEntity(EntityGuide, posX, posY, {duration: currentMark.duration, kind: currentMark.kind, targetTime: currentMark.mark} );
				this.triggerMarks.shift();
			}
		}
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
        ig.game.ctx.beginPath();
        ig.game.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ig.game.ctx.fillRect(0, 0, ig.system.width, 25);

        ig.game.ctx.fillStyle = 'gray';
        ig.game.ctx.font="25px Arial";
        ig.game.ctx.fillText('space', ig.system.width / 2 - 27, 18);

	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 800, 600, 1 );

});
