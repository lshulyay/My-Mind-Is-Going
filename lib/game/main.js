ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.title',
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
		ig.input.bind( ig.KEY.SPACE, 'space' );
		this.ctx = ig.system.context;
		ig.music.add( this.virusMusic, ['virus'] );
		ig.music.volume = 1;
		this.loadLevel(LevelTitle);
	},

	loadLevel: function( data ) {
		this.currentLevel = data;
		this.parent( data );
		this.spawnEntity( EntityPointer, 0, 0 );
		this.setTriggerMarks();
		if (this.currentLevel === LevelMain) {
			this.controller.score = 0;
			ig.music.play(['virus']);
		}
	},

	setTriggerMarks: function() {
		if (this.currentLevel === LevelTitle) {
			this.tutorialMarks = [{mark: 2, duration: 5, kind: 'red', active: true}];
		}

		else if (this.currentLevel === LevelMain) {
			this.triggerMarks = [
						{mark: 5.55, duration: 2, kind: 'red', active: true},
						{mark: 8.90, duration: 2, kind: 'blue', active: true},
						{mark: 12.09, duration: 1, kind: 'red', active: true},
						{mark: 13.71, duration: 1, kind: 'blue', active: true},
						{mark: 15.33, duration: 1, kind: 'green', active: true},
						{mark: 17.01, duration: 0, kind: 'beat', active: true}
			];
		}
	},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		if (this.currentLevel === LevelTitle) {
			if (ig.input.pressed('space')) {
				this.loadLevel(LevelMain);
			}
		}
		if (this.currentLevel === LevelMain) {
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
			else if (ig.input.pressed('space')) {
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
		}
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		if (this.currentLevel === LevelTitle) {
			var x = ig.system.width / 2 - 200;
			var y = 100;
			ig.game.ctx.fillStyle = '#7e0302';
			ig.game.ctx.font='25px Arial';
			ig.game.ctx.fillText('my mind is going', x, y);
			y += 30;
			ig.game.ctx.fillStyle = '#cccccc';
			ig.game.ctx.font='20px Arial';
			ig.game.ctx.fillText('space to start.', x, y);
			y += 40;
			
			ig.game.ctx.fillStyle = '#7e0302';
			ig.game.ctx.font='20px Arial';
			ig.game.ctx.fillText('how:', x, y);
			y += 30;
			ig.game.ctx.fillStyle = '#959595';
			ig.game.ctx.font='15px Arial';
			ig.game.ctx.fillText('+ Hold keys 1-4 to grow circle at current mouse cursor position.', x, y);
			y += 20;
			ig.game.ctx.fillText('+ Release key to stop growing circle.', x, y);
			y += 20;
			ig.game.ctx.fillText('+ Press SPACE on beat trigger.', x, y);
			y += 40;
			ig.game.ctx.fillStyle = '#ffffff';
			ig.game.ctx.fillText('Sustained Triggers:', x, y);
			y += 25;
			ig.game.ctx.fillStyle = '#959595';
			ig.game.ctx.save();
			ig.game.ctx.beginPath();
            ig.game.ctx.arc(x, y + 35, 50, 0 , 2 * Math.PI, false);
            ig.game.ctx.fillStyle = 'rgba(171,171,171,0.3)';
            ig.game.ctx.fill();

            ig.game.ctx.beginPath();
            ig.game.ctx.arc(x, y + 35, 15, 0 , 2 * Math.PI, false);
            ig.game.ctx.fillStyle = 'rgba(255,0,0,0.5)';
            ig.game.ctx.fill();
            ig.game.ctx.lineWidth = 2;
            ig.game.ctx.strokeStyle = 'rgba(255,0,0,0.5)';
            ig.game.ctx.stroke();

            ig.game.ctx.fillStyle = 'white';
            ig.game.ctx.font="25px Arial";
            ig.game.ctx.fillText(1, x - 7, y + 45);
            ig.game.ctx.restore();

            x += 60;
            ig.game.ctx.fillText('Move mouse cursor to center of guide.', x, y);
            y += 20;
            ig.game.ctx.fillText('Press and hold number key in guide when gray silhouette touches guide outline.', x, y);
            y += 20;
            ig.game.ctx.fillText('Your circle will start growing with the guide circle.', x, y);
            y += 20;
			ig.game.ctx.fillText('Release when guide circle starts shrinking.', x, y);
            y += 20;
			ig.game.ctx.fillText('Try to keep your circle identical in size to the guide.', x, y);
			x -= 60;
			y += 40;
			ig.game.ctx.fillStyle = '#ffffff';
			ig.game.ctx.fillText('Beat Triggers:', x, y);
			y += 15;
			ig.game.ctx.fillStyle = '#959595';

			ig.game.ctx.save();
			ig.game.ctx.beginPath();
			ig.game.ctx.fillStyle = 'rgba(255,255,255,0.3)';
			ig.game.ctx.fillRect(x, y, 433, 25);

			ig.game.ctx.fillStyle = 'gray';
			ig.game.ctx.font="25px Arial";
			ig.game.ctx.fillText('space', ig.system.width / 2 - 27, y + 18);
			ig.game.ctx.restore();
			y += 40;
			ig.game.ctx.fillText('Hit SPACE once when horizontal silhouette is aligns with the guide.', x, y);



		}
		else if (this.currentLevel === LevelMain) {
			ig.game.ctx.beginPath();
			ig.game.ctx.fillStyle = 'rgba(255,255,255,0.3)';
			ig.game.ctx.fillRect(0, 0, ig.system.width, 25);

			ig.game.ctx.fillStyle = 'gray';
			ig.game.ctx.font="25px Arial";
			ig.game.ctx.fillText('space', ig.system.width / 2 - 27, 18);
		}
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
