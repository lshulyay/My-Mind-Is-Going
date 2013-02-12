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
//	'game.entities.pointer',

	'impact.debug.debug'

)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	controller: new ig.Controller(),
	font: new ig.Font( 'media/04b03.font.png' ),

	// Load music
	virusMusic: new ig.Sound( 'media/virus.*' ),
	titleMusic: new ig.Sound( 'media/titlesound.*' ),

	currentLevel: null,
	triggerMarks: null, // All of the track's triggers
	guideBuffer: 2, // How many seconds before trigger should the guide appear
	
	init: function() {
		// Key bindings
		ig.input.bind( ig.KEY.MOUSE1, 'click' );
		ig.input.bind( ig.KEY._1, '1' ); // Red
		ig.input.bind( ig.KEY._2, '2' ); // Blue
		ig.input.bind( ig.KEY._3, '3' ); // Green
		ig.input.bind( ig.KEY._4, '4' ); // Purple
		ig.input.bind( ig.KEY.SPACE, 'space' );
		ig.input.bind( ig.KEY.ESC, 'pause' );

		this.ctx = ig.system.context; // Define context

		// Define music tracks
		ig.music.add( this.virusMusic, ['virus'] );
		ig.music.add( this.titleMusic, ['title'] );
		ig.music.volume = 1;

		// Load title screen
		this.loadLevel(LevelTitle);
	},

	loadLevel: function( data ) {
		this.currentLevel = data;
		this.parent( data );
	//	this.spawnEntity( EntityPointer, 0, 0 ); // Spawn cursor
		this.tutorialMark = null;
		if (this.currentLevel === LevelMain) {
			this.setTriggerMarks();		// Set all trigger marks for the track
			this.controller.score = 0;	// Reset score
			ig.music.play(['virus']);	// Start music
			ig.music.loop = false;		// Do not loop track
		}
		else {
			ig.music.play(['title']);	// Start title music
			ig.music.loop = true;		// Loop track
		}
	},

	setTriggerMarks: function() {
		// Array of all triggers
		this.triggerMarks = [
					{mark: 5.55, duration: 2, kind: 'red', active: true},
					{mark: 8.90, duration: 2, kind: 'blue', active: true},
					{mark: 12.09, duration: 1, kind: 'red', active: true},
					{mark: 13.71, duration: 1, kind: 'blue', active: true},
					{mark: 15.33, duration: 1, kind: 'green', active: true},
					{mark: 17.01, duration: 0, kind: 'beat', active: true}
		];
	},

	setTutorialMark: function() {
		// Tutorial for title screen
		if (this.currentLevel === LevelTitle) {
			var color = ig.game.controller.randomFromTo(1,4); // Pick random trigger to spawn
			var kind;
			switch (color) {
				case 1: kind = 'red';
				break;
				case 2: kind = 'blue';
				break;
				case 3: kind = 'green';
				break;
				case 4: kind = 'purple';
				break;
			}
			this.tutorialMark = {mark: 1, duration: 1, kind: kind, active: true};
			// Spawn guide according to tutorialMark settings
			this.spawnEntity(EntityGuide, ig.system.width / 2 - 200, 260, {duration: this.tutorialMark.duration, kind: this.tutorialMark.kind, targetTime: this.tutorialMark.mark, guideContractionSpeed: 100} );
			// Remove tutorialMark settings once spawned
			this.tutorialMark = null;
		}
	},

	update: function() {
		this.parent();
		// Keys 1-4 represent different trigger colors
		if (ig.input.pressed('1')) {
			this.spawnEntity(EntityLive, ig.input.mouse.x, ig.input.mouse.y, {kind: 'red'});
		}
		else if (ig.input.pressed('2')) {
			this.spawnEntity(EntityLive, ig.input.mouse.x, ig.input.mouse.y, {kind: 'blue'});
		}
		else if (ig.input.pressed('3')) {
			this.spawnEntity(EntityLive, ig.input.mouse.x, ig.input.mouse.y, {kind: 'green'});
		}
		else if (ig.input.pressed('4')) {
			this.spawnEntity(EntityLive, ig.input.mouse.x, ig.input.mouse.y, {kind: 'purple'});
		}

		if (this.currentLevel === LevelTitle) {
			// Space to start game on title screen
			if (ig.input.pressed('space')) {
				this.loadLevel(LevelMain);
			}
			// If no tutoial guide already exists and the title track is at appropriate currentTime, spawn new tutorial guide
			var allGuides = this.getEntitiesByType(EntityGuide);
			if (ig.music.currentTrack.currentTime <= 0.3 && allGuides.length === 0 ) {
				this.setTutorialMark();
			}
		}
		if (this.currentLevel === LevelMain) {
			// If there are triggers remaining...
			if (this.triggerMarks.length > 0) {
				// Use the first trigger in the array to spawn guide two seconds before mark
				if ( ig.music.currentTrack.currentTime >= this.triggerMarks[0].mark - 2) {
					var currentMark = this.triggerMarks[0];
					// Pick random position on the screen for the guide
					var posX = ig.game.controller.randomFromTo(5, ig.system.width - 15);
					var posY = ig.game.controller.randomFromTo(5, ig.system.height - 15);
					// Spawn guide
					this.spawnEntity(EntityGuide, posX, posY, {duration: currentMark.duration, kind: currentMark.kind, targetTime: currentMark.mark} );
					// Remove first trigger from array
					this.triggerMarks.shift();
				}
			}

			// If Space is pressed and a beat guide is in the appropriate position, award points.
			if (ig.input.pressed('space')) {
				if (this.beatGuide) {
					if (this.beatGuide.pos.y <= 30) {
						this.controller.beatPoints = this.controller.maxBeatPoints;
					}
				}
			}

			// Pause the game
			else if (ig.input.pressed('pause')) {
				ig.game.controller.pause();
			}
		}
	},
	
	draw: function() {
		this.parent();
		// Draw title screen
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
			ig.game.ctx.font='15px Arial';
			ig.game.ctx.fillStyle = '#ffffff';
			ig.game.ctx.fillText('Sustained Triggers:', x, y);
			y += 25;
			ig.game.ctx.fillStyle = '#959595';
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
			ig.game.ctx.fillText('Hit SPACE once when horizontal silhouette touches the guide.', x, y);
			y += 40;
			ig.game.ctx.fillStyle = '#7e0302';
			ig.game.ctx.font='17px Arial';
			ig.game.ctx.fillText('Music by Clearside - www.clearsidemusic.com', x, y);

		}

		// Draw main level
		else if (this.currentLevel === LevelMain) {
			ig.game.ctx.beginPath();
			ig.game.ctx.fillStyle = 'rgba(255,255,255,0.3)';
			ig.game.ctx.fillRect(0, 0, ig.system.width, 25);

			ig.game.ctx.fillStyle = 'gray';
			ig.game.ctx.font="25px Arial";
			ig.game.ctx.fillText('space', ig.system.width / 2 - 27, 18);
			ig.game.ctx.font="50px Arial";
			ig.game.ctx.fillText(this.controller.score, 5, ig.system.height - 55);
		}
	}
});

// Start game on full screen canvas
ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
