ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.main',

	'game.entities.live',
	'game.entities.pointer'

)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	currentLevel: null,
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		ig.input.bind( ig.KEY._1, '1' ); // Red
		ig.input.bind( ig.KEY._2, '2' ); // Blue
		ig.input.bind( ig.KEY._3, '3' ); // Green
		ig.input.bind( ig.KEY._4, '4' ); // Purple
		ig.input.bind( ig.KEY._5, '5' );
		this.ctx = ig.system.context;
		this.loadLevel(LevelMain);
	},

	loadLevel: function( data ) {
		this.currentLevel = data;
		this.parent( data );
		this.spawnEntity( EntityPointer, 0, 0 );
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		if (this.pointer) {
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

		}
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
		
		this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 800, 600, 1 );

});
