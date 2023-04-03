import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
	// ! can let take script know that we know that it won't be set for a little bit
	// ? it miight be undefined
	private platforms?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite 
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	private stars?: Phaser.Physics.Arcade.Group

	private score = 0
	private scoreText?: Phaser.GameObjects.Text

	private bombs?: Phaser.Physics.Arcade.Group

	private gameOver = false
	private gameOverText?: Phaser.GameObjects.Text

	//private music?: Phaser.Game
	
	constructor() {
		super('hello-world')
	}

	preload() {
		this.load.image('sky','/assets/nightsky.png') 
		this.load.image('ground','/assets/platform.png')
		this.load.image('ground2','/assets/platform2.png')
		this.load.image('star','/assets/oreo.png') 
		this.load.image('bomb','/assets/bomb.png')
		this.load.image('wall','/assets/wall.png')
		this.load.audio("retro",["/assets/retro.mp3"])
		this.load.spritesheet('dude','/assets/pinkguy.png', { frameWidth: 32, frameHeight: 48 })
	}

	create() {
		this.add.image(400, 225, 'sky')
		//this.add.image(400, 300, 'star')

		this.music = this.sound.add("retro")

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

		this.platforms = this.physics.add.staticGroup()
		const ground = this.platforms.create(400, 568, 'ground') as Phaser.Physics.Arcade.Sprite
		
		ground
			.setScale(2)
			.refreshBody()

		this.platforms.create(775, 425, 'ground') // first platform from the bottom, right side
		this.platforms.create(50, 250, 'ground') //
		this.platforms.create(831, 120, 'ground') // secound platform from the bottom, right side
		this.platforms.create(313, 425, 'ground2')
		this.platforms.create(486.5, 275, 'ground2')
		this.platforms.create(400, 360, 'wall')

		this.player = this.physics.add.sprite(100, 450, 'dude')
		this.player.setBounce(0.2)
		this.player.setCollideWorldBounds

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

		this.physics.add.collider(this.player, this.platforms)

		this.cursors = this.input.keyboard.createCursorKeys()

		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70}
		})

		this.stars.children.iterate(c => {
			const child = c as Phaser.Physics.Arcade.Image
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		})

		this.physics.add.collider(this.stars, this.platforms)
		this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this)

		this.scoreText = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
			color: '#fff' // fill didn't work
		})

		this.gameOverText = this.add.text(225, 250,'Game Over', {
			fontSize: '64px',
			color: '#fff'
		})
		this.gameOverText.visible = false

		this.bombs = this.physics.add.group()

		this.physics.add.collider(this.bombs, this.platforms)
		this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this)
	}

	private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
		this.physics.pause()

		this.player?.setTint(0xff0000)
		this.player?.anims.play('turn')

		this.gameOver = true
		this.gameOverText.visible = true // Giving warning but it works
	}

	// Moon instead of star
	private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
		const star = s as Phaser.Physics.Arcade.Image
		star.disableBody(true,true)

		this.score += 10
		this.scoreText?.setText(`Score: ${this.score}`)

		if (this.stars?.countActive(true) == 0 ){
			this.stars.children.iterate(c => {
				const child = c as Phaser.Physics.Arcade.Image
				child.enableBody(true, child.x, 0, true, true)
			})

			if (this.player) {
				const x = this.player.x < 400 
					? Phaser.Math.Between(400, 800) 
					: Phaser.Math.Between(0,400)

				const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(x, 16, 'bomb')
				bomb.setBounce(1)
				bomb.setCollideWorldBounds(true)
				bomb.setVelocity(Phaser.Math.Between(-200,200), 20)
			}
		}
	}

	update() {
		if (!this.cursors) {
			return
		}

		if (this.cursors.left?.isDown) {
			this.player?.setVelocityX(-160)
			this.player?.anims.play('left',true)
		} else if (this.cursors.right?.isDown) {
			this.player?.setVelocityX(160)
			this.player?.anims.play('right',true)
		} else {
			this.player?.setVelocityX(0)
			this.player?.anims.play('turn')
		}

		if (this.cursors.up?.isDown && this.player?.body.touching.down) {
			this.player.setVelocityY(-330)
		}
	}
}