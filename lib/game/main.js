ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.title',
	'game.levels.main',
	'game.levels.end',

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
				//	{mark: 69.17, duration: 0, kind: 'beat'},
				//	{mark: 69.61, duration: 0, kind: 'beat'},
					{mark: 70.25, duration: 1.08, kind: 'red'},
				//	{mark: 71.93, duration: 0, kind: 'beat'},
					{mark: 72.51, duration: 0, kind: 'beat'},
					{mark: 72.92, duration: 0.9, kind: 'blue'},
				//	{mark: 74.44, duration: 0, kind: 'beat'},
					{mark: 75.08, duration: 0, kind: 'beat'},
				//	{mark: 75.68, duration: 0, kind: 'beat'},
					{mark: 76.19, duration: 0.75, kind: 'purple'},
					{mark: 77.76, duration: 0.75, kind: 'purple'},
					{mark: 79.46, duration: 1.3, kind: 'red'},
					{mark: 81.01, duration: 1.3, kind: 'blue'},
					{mark: 82.72, duration: 1.19, kind: 'blue'},
					{mark: 84.43, duration: 1.24, kind: 'purple'},
					{mark: 86.07, duration: 1.21, kind: 'purple'},
					{mark: 86.53, duration: 0, kind: 'beat'},
					{mark: 86.68, duration: 0, kind: 'beat'},
					{mark: 87.73, duration: 1.22, kind: 'red'},
					{mark: 88.10, duration: 0, kind: 'beat'},
					{mark: 88.29, duration: 0, kind: 'beat'},
					{mark: 89.31, duration: 1.25, kind: 'purple'},
					{mark: 90.96, duration: 1.25, kind: 'purple'},
					{mark: 92.59, duration: 0.77, kind: 'red'},
				//	{mark: 93.84, duration: 1.11, kind: 'red'},
					{mark: 94.27, duration: 0.68, kind: 'blue'},
				//	{mark: 94.95, duration: 0, kind: 'beat'},
					{mark: 95.52, duration: 0, kind: 'beat'},
					{mark: 96.81, duration: 0, kind: 'beat'},
					{mark: 97.65, duration: 0, kind: 'beat'},
					{mark: 99.17, duration: 0, kind: 'beat'},
					{mark: 100.76, duration: 0, kind: 'beat'},
					{mark: 101.63, duration: 0, kind: 'beat'},
					{mark: 102.03, duration: 0, kind: 'beat'},
					{mark: 102.44, duration: 0, kind: 'beat'},
					{mark: 102.86, duration: 0, kind: 'beat'},
					{mark: 103.29, duration: 0, kind: 'beat'},
					{mark: 103.72, duration: 0, kind: 'beat'},
					{mark: 104.11, duration: 0, kind: 'beat'},
					{mark: 104.50, duration: 0, kind: 'beat'},
					{mark: 104.86, duration: 0, kind: 'beat'},
					{mark: 105.31, duration: 0, kind: 'beat'},
					{mark: 105.74, duration: 0, kind: 'beat'},
					{mark: 106.16, duration: 0, kind: 'beat'},
					{mark: 106.59, duration: 0, kind: 'beat'},
					{mark: 106.99, duration: 0, kind: 'beat'},
					{mark: 107.40, duration: 0, kind: 'beat'},
					{mark: 107.76, duration: 0, kind: 'beat'},
					{mark: 108.21, duration: 0, kind: 'beat'},
					{mark: 108.59, duration: 0, kind: 'beat'},
					{mark: 109.02, duration: 3.32, kind: 'red'},
					{mark: 110.71, duration: 3.27, kind: 'green'},
					{mark: 115.63, duration: 1.65, kind: 'purple'},
					{mark: 117.88, duration: 0, kind: 'beat'},
					{mark: 118.43, duration: 0, kind: 'beat'},
					{mark: 118.90, duration: 1.67, kind: 'blue'},
					{mark: 119.52, duration: 1.7, kind: 'green'},
					{mark: 122.77, duration: 1.1, kind: 'red'},
					{mark: 123.24, duration: 0, kind: 'beat'},
					{mark: 124.41, duration: 0.63, kind: 'purple'},
					{mark: 125.91, duration: 1.17, kind: 'blue'},
					{mark: 126.46, duration: 1.23, kind: 'green'},
					{mark: 128.36, duration: 0, kind: 'beat'},
					{mark: 129.15, duration: 1.26, kind: 'blue'},
					{mark: 129.81, duration: 1.26, kind: 'green'},
					{mark: 131.59, duration: 0, kind: 'beat'},
					{mark: 132.41, duration: 1.26, kind: 'blue'},
					{mark: 133.06, duration: 1.26, kind: 'green'},
					{mark: 134.83, duration: 0, kind: 'beat'},
					{mark: 135.80, duration: 1.26, kind: 'blue'},
					{mark: 136.35, duration: 1.26, kind: 'green'},
					{mark: 138.65, duration: 0, kind: 'beat'},
					{mark: 138.87, duration: 0, kind: 'beat'},
					{mark: 139.06, duration: 0, kind: 'beat'},
					{mark: 139.12, duration: 1.26, kind: 'blue'},
					{mark: 139.76, duration: 1.26, kind: 'green'},
					{mark: 139.76, duration: 0, kind: 'beat'},
					{mark: 140.38, duration: 0, kind: 'beat'},
					{mark: 141.02, duration: 0, kind: 'beat'},
				//	{mark: 141.53, duration: 0, kind: 'beat'},
				//	{mark: 141.71, duration: 0, kind: 'beat'},
				//	{mark: 141.93, duration: 0, kind: 'beat'},
					{mark: 142.11, duration: 0, kind: 'beat'},
					{mark: 142.32, duration: 0, kind: 'beat'},
					{mark: 142.32, duration: 1.26, kind: 'blue'},
					{mark: 142.94, duration: 1.26, kind: 'green'},
					{mark: 145.19, duration: 0, kind: 'beat'},
					{mark: 146.15, duration: 0, kind: 'beat'},
					{mark: 146.84, duration: 0, kind: 'beat'},
					{mark: 147.43, duration: 0, kind: 'beat'},
					{mark: 148.53, duration: 0.94, kind: 'red'},
					{mark: 150.20, duration: 0.56, kind: 'purple'},
					{mark: 151.43, duration: 0, kind: 'beat'},
					{mark: 151.80, duration: 0.77, kind: 'blue'},
					{mark: 152.23, duration: 0, kind: 'beat'},
					{mark: 153.54, duration: 1.18, kind: 'green'},
					{mark: 154.10, duration: 0.62, kind: 'red'},
					{mark: 155.08, duration: 0.92, kind: 'purple'},
					{mark: 156.76, duration: 0, kind: 'beat'},
					{mark: 157.32, duration: 0, kind: 'beat'},
					{mark: 157.97, duration: 0, kind: 'beat'},
					{mark: 158.42, duration: 0.95, kind: 'green'},
					{mark: 160.40, duration: 0, kind: 'beat'},
					{mark: 161.22, duration: 0, kind: 'beat'},
					{mark: 162.04, duration: 0, kind: 'beat'},
					{mark: 162.86, duration: 0, kind: 'beat'},
					{mark: 163.70, duration: 0, kind: 'beat'},
					{mark: 164.16, duration: 0, kind: 'beat'},
					{mark: 164.35, duration: 0, kind: 'beat'},
					{mark: 164.52, duration: 0, kind: 'beat'},
					{mark: 164.73, duration: 0, kind: 'beat'},
					{mark: 164.91, duration: 1.63, kind: 'blue'},
					{mark: 166.99, duration: 0, kind: 'beat'},
					{mark: 167.19, duration: 0, kind: 'beat'},
					{mark: 168.24, duration: 1.63, kind: 'blue'},
					{mark: 170.26, duration: 0, kind: 'beat'},
					{mark: 170.47, duration: 0, kind: 'beat'},
					{mark: 171.54, duration: 0.58, kind: 'red'},
					{mark: 173.13, duration: 0.58, kind: 'blue'},
					{mark: 174.73, duration: 1.28, kind: 'green'},
					{mark: 176.48, duration: 1.28, kind: 'purple'},
					{mark: 178.13, duration: 0, kind: 'beat'},
					{mark: 178.63, duration: 2.72, kind: 'green'},
					{mark: 180.20, duration: 1.15, kind: 'red'},
					{mark: 182.13, duration: 0.93, kind: 'blue'},
					{mark: 183.73, duration: 0, kind: 'beat'},
					{mark: 184.56, duration: 0.81, kind: 'red'},
					{mark: 186.26, duration: 0.81, kind: 'purple'},
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
		else if (this.currentLevel === LevelMain) {
			// If there are triggers remaining...
			if (this.triggerMarks.length > 0) {
				// Use the first trigger in the array to spawn guide two seconds before mark
				if ( ig.music.currentTrack.currentTime >= this.triggerMarks[0].mark - this.guideBuffer) {
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

			if (ig.music.currentTrack.currentTime >= 30 && this.guideBuffer === 2) {
				this.guideBuffer = 1;
			}

			// Pause the game
			if (ig.input.pressed('pause')) {
				ig.game.controller.pause();
			}

			if (ig.music.currentTrack.currentTime >= 240) {
				console.log('level end! ' + ig.music.currentTrack.currentTime);
				this.loadLevel(LevelEnd);
			}
		}

		else if (this.currentLevel === LevelEnd) {
			if (ig.input.pressed('space')) {
				this.loadLevel(LevelTitle);
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

		else if (this.currentLevel === LevelEnd) {
			var x = ig.system.width / 2 - 200;
			var y = 100;
			ig.game.ctx.fillStyle = '#7e0302';
			ig.game.ctx.font='19pt Arial';
			ig.game.ctx.fillText('finished', x, y);
			y += 30;
			ig.game.ctx.fillStyle = '#cccccc';
			ig.game.ctx.font='14.5pt Arial';
			ig.game.ctx.fillText('Score: ' + this.controller.score, x, y);
			y += 40;
			ig.game.ctx.fillText('Space to try again.', x, y);
		}
	}
});

// Start game on full screen canvas
ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
