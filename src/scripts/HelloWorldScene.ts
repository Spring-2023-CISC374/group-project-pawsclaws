import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	// ! can let take script know that we know that it won't be set for a little bit
	// ? it miight be undefined
	private paths?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite 
	//private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	private balloons?: Phaser.Physics.Arcade.Group

	private score = 0
	private scoreText?: Phaser.GameObjects.Text

	//private bombs?: Phaser.Physics.Arcade.Group

	private gameOver = false
	private gameOverText?: Phaser.GameObjects.Text

	//private music?: Phaser.Game
	
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('grasslands','/assets/grasslands.png')
		this.load.image('pathHor1', '/assets/pathHor.png')
		this.load.image('pathHor2', '/assets/pathHor.png')
		this.load.image('pathVer', '/assets/pathVer.png')
		//this.load.audio("retro",["/assets/retro.mp3"])
		//this.load.spritesheet('dude','/assets/pinkguy.png', { frameWidth: 32, frameHeight: 48 })
	}

	create() {
		this.add.image(400, 225, 'sky')
		//this.add.image(400, 300, 'balloon')

		//this.music = this.sound.add("retro")

		/*
		var musicConfig = {
			mute: false,
			volume: 1,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: false,
			delay: 0
		}
		this.music.play(musicConfig)
		*/

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0, end: 3
			}),
			frameRate: 10,
			repeat: -1
		})

		this.anims.create({
			key: 'turn',
			frames: [{key: 'dude', frame: 4}],
			frameRate: 20
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude',{
				start: 5, end: 8
			}),
			frameRate: 10,
			repeat: -1
		})

		//this.physics.add.collider(this.player, this.platforms)

		//this.cursors = this.input.keyboard.createCursorKeys()

		/*
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70}
		})

		this.stars.children.iterate(c => {
			const child = c as Phaser.Physics.Arcade.Image
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})
		*/

		//this.physics.add.collider(this.stars, this.platforms)
		//this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this)

		this.scoreText = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
			color: '#fff' // fill didn't work
		})

		this.gameOverText = this.add.text(225, 250,'Game Over', {
			fontSize: '64px',
			color: '#fff'
		})
		this.gameOverText.visible = false

		//this.bombs = this.physics.add.group()

		//this.physics.add.collider(this.bombs, this.platforms)
		//this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this)
	}

	private handleHitBalloon(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
		const balloon = b as Phaser.Physics.Arcade.Image

		this.score += 20
		this.scoreText?.setText(`Score: ${this.score}`)

		if (this.balloons?.){

		}
	}

	private handleHealth() {

	}

	update() {
	}
}
