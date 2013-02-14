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
					{mark: 5.55, duration: 2, kind: 'red'},
					{mark: 8.90, duration: 2, kind: 'blue'},
					{mark: 12.09, duration: 1, kind: 'red'},
					{mark: 13.71, duration: 1, kind: 'blue'},
					{mark: 15.33, duration: 1, kind: 'green'},
					{mark: 17.01, duration: 0, kind: 'beat'},
					{mark: 18.59, duration: 0, kind: 'beat'},
					{mark: 20.25, duration: 0.5, kind: 'purple'},
					{mark: 21.80, duration: 1, kind: 'red'},
					{mark: 22.48, duration: 0, kind: 'beat'},
					{mark: 24.11, duration: 1, kind: 'green'},
					{mark: 25.15, duration: 0, kind: 'beat'},
					{mark: 25.74, duration: 0, kind: 'beat'},
					{mark: 26.39, duration: 0, kind: 'beat'},
					{mark: 27.43, duration: 1.05, kind: 'blue'},
					{mark: 29.74, duration: 0, kind: 'beat'},
				//	{mark: 28.48, duration: 2, kind: 'red'},
					{mark: 30.29, duration: 0.55, kind: 'purple'},
					{mark: 31.78, duration: 0.61, kind: 'green'},
					{mark: 33.41, duration: 0.63, kind: 'red'},
					{mark: 35.07, duration: 0.56, kind: 'blue'},
					{mark: 36.71, duration: 0.57, kind: 'green'},
					{mark: 38.34, duration: 0, kind: 'beat'},
					{mark: 38.99, duration: 0, kind: 'beat'},
					{mark: 39.55, duration: 0, kind: 'beat'},
					{mark: 39.97, duration: 0, kind: 'beat'},
					{mark: 41.63, duration: 1.63, kind: 'red'},
				//	{mark: 43.26, duration: 1, kind: 'purple'},
					{mark: 44.88, duration: 0, kind: 'beat'},
					{mark: 45.57, duration: 0, kind: 'beat'},
					{mark: 46.13, duration: 0, kind: 'beat'},
					{mark: 46.55, duration: 0.68, kind: 'purple'},
					{mark: 48.18, duration: 0, kind: 'beat'},
					{mark: 48.82, duration: 0, kind: 'beat'},
					{mark: 49.39, duration: 0, kind: 'beat'},
					{mark: 49.82, duration: 0.68, kind: 'blue'},
					{mark: 51.47, duration: 0, kind: 'beat'},
					{mark: 52.11, duration: 0, kind: 'beat'},
					{mark: 52.68, duration: 0, kind: 'beat'},
					{mark: 53.17, duration: 0.68, kind: 'green'},
					{mark: 54.76, duration: 0.68, kind: 'red'},
					{mark: 56.37, duration: 0.84, kind: 'blue'},
					{mark: 58.07, duration: 0.61, kind: 'purple'},
					{mark: 59.28, duration: 0, kind: 'beat'},
					{mark: 60.33, duration: 0, kind: 'beat'},
					{mark: 61.33, duration: 0.63, kind: 'green'},
					{mark: 62.57, duration: 0, kind: 'beat'},
					{mark: 63.00, duration: 0, kind: 'beat'},
					{mark: 64.61, duration: 0.63, kind: 'green'},
				//	{mark: 65.86, duration: 0, kind: 'beat'},
					{mark: 66.32, duration: 0, kind: 'beat'},
				//	{mark: 67.89, duration: 0.63, kind: 'green'},
					{mark: 69.89, duration: 0, kind: 'beat'},
					{mark: 69.17, duration: 0, kind: 'beat'},
				//	{mark: 69.61, duration: 0, kind: 'beat'},
					{mark: 70.25, duration: 1.08, kind: 'red'},
				//	{mark: 71.93, duration: 0, kind: 'beat'},
					{mark: 72.51, duration: 0, kind: 'beat'},
					{mark: 72.92, duration: 0.9, kind: 'blue'},
				//	{mark: 74.44, duration: 0, kind: 'beat'},
				//	{mark: 75.08, duration: 0, kind: 'beat'},
				//	{mark: 75.68, duration: 0, kind: 'beat'},
					{mark: 76.19, duration: 0.75, kind: 'purple'},
					{mark: 77.76, duration: 0.75, kind: 'purple'},
					{mark: 79.46, duration: 1.3, kind: 'red'},
					{mark: 81.01, duration: 1.3, kind: 'blue'}
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
			this.spawnEntity(EntityGuide, ig.system.width / 2 - 200, 250, {duration: this.tutorialMark.duration, kind: this.tutorialMark.kind, targetTime: this.tutorialMark.mark, guideContractionSpeed: 100} );
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
					var posX = ig.game.controller.randomFromTo(50, ig.system.width - 50);
					var posY = ig.game.controller.randomFromTo(50, ig.system.height - 50);
					// Spawn guide
					this.spawnEntity(EntityGuide, posX, posY, {duration: currentMark.duration, kind: currentMark.kind, targetTime: currentMark.mark} );
					// Remove first trigger from array
					this.triggerMarks.shift();
				}
			}

			// Pause the game
			if (ig.input.pressed('pause')) {
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
			ig.game.ctx.font='19pt Arial';
			ig.game.ctx.fillText('my mind is going', x, y);
			y += 30;
			ig.game.ctx.fillStyle = '#cccccc';
			ig.game.ctx.font='14.5pt Arial';
			ig.game.ctx.fillText('space to start.', x, y);
			y += 40;
			
			ig.game.ctx.fillStyle = '#7e0302';
			ig.game.ctx.font='14.5pt Arial';
			ig.game.ctx.fillText('how:', x, y);
			y += 30;
			ig.game.ctx.font='11pt Arial';
			ig.game.ctx.fillStyle = '#ffffff';
			ig.game.ctx.fillText('Sustained Triggers:', x, y);
			y += 25;
			ig.game.ctx.fillStyle = '#959595';
            x += 60;
            ig.game.ctx.fillText('+ Press number key shown in guide when gray silhouette touches guide outline.', x, y);
            y += 20;
			ig.game.ctx.fillText('+ Hold to expand as the guide expands.', x, y);
            y += 20;
			ig.game.ctx.fillText('+ Release to contract when guide starts contracting.', x, y);

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
			ig.game.ctx.font="19pt Arial";
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
			ig.game.ctx.font="19pt Arial";
			ig.game.ctx.fillText('space', ig.system.width / 2 - 27, 18);
			ig.game.ctx.font="40pt Arial";
			ig.game.ctx.fillText(this.controller.score, 5, ig.system.height - 55);
		}
	}
});

// Start game on full screen canvas
ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
