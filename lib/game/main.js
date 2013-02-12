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
	titleMusic: new ig.Sound( 'media/titlesound.*' ),

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
		ig.input.bind( ig.KEY.ESC, 'pause' );
		this.ctx = ig.system.context;
		ig.music.add( this.virusMusic, ['virus'] );
		ig.music.add( this.titleMusic, ['title'] );
		ig.music.volume = 1;
		this.loadLevel(LevelTitle);
	},

	loadLevel: function( data ) {
		this.currentLevel = data;
		this.parent( data );
		this.spawnEntity( EntityPointer, 0, 0 );
		this.tutorialMark = null;
		if (this.currentLevel === LevelMain) {
			this.setTriggerMarks();
			this.controller.score = 0;
			ig.music.play(['virus']);
		}
		else {
			ig.music.play(['title']);
			ig.music.loop = true;
		}
	},

	setTriggerMarks: function() {
		if (this.currentLevel === LevelMain) {
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

	setTutorialMark: function() {
		if (this.currentLevel === LevelTitle) {
			var color = ig.game.controller.randomFromTo(1,4);
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
			this.spawnEntity(EntityGuide, ig.system.width / 2 - 200, 260, {duration: this.tutorialMark.duration, kind: this.tutorialMark.kind, targetTime: this.tutorialMark.mark, guideContractionSpeed: 100} );
			this.tutorialMark = null;
		}
	},

	update: function() {
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

		if (this.currentLevel === LevelTitle) {
			if (ig.input.pressed('space')) {
				this.loadLevel(LevelMain);
			}
			var allGuides = this.getEntitiesByType(EntityGuide);
			if (ig.music.currentTrack.currentTime <= 0.3 && allGuides.length === 0 ) {
				this.setTutorialMark();
			}
		}
		if (this.currentLevel === LevelMain) {
			if (this.triggerMarks.length > 0) {
				if ( ig.music.currentTrack.currentTime >= this.triggerMarks[0].mark - 2) {
					var currentMark = this.triggerMarks[0];
					var posX = ig.game.controller.randomFromTo(5, ig.system.width - 5);
					var posY = ig.game.controller.randomFromTo(5, ig.system.height - 5);
					this.spawnEntity(EntityGuide, posX, posY, {duration: currentMark.duration, kind: currentMark.kind, targetTime: currentMark.mark} );
					this.triggerMarks.shift();
				}
			}

			if (ig.input.pressed('space')) {
				if (this.beatGuide) {
					if (this.beatGuide.pos.y <= 30) {
						this.controller.beatPoints = this.controller.maxBeatPoints;
					}
				}
			}

			else if (ig.input.pressed('pause')) {
				ig.game.controller.pause();
				console.log('pause game here');
			}
		}
	},
	
	draw: function() {
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

ig.main( '#canvas', MyGame, 60, window.innerWidth, window.innerHeight, 1 );

});
