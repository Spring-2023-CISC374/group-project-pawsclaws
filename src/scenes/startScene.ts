import Phaser, { CANVAS, Scale } from 'phaser'


export default class startScene extends Phaser.Scene {

    sceneSprite: any


    constructor() {
        super('startScene')
        console.log('in start const')
    }

    preload() {
        this.load.image('startbutton','assets/pawsclawsupdate.png')
        //this.load.image('gif','public/assets/back.png');
        //this.load.spritesheet('gif', 'public/assets/back.png',{ frameWidth: 1000, frameHeight: 1000 })
        this.load.spritesheet('cat', 'public/assets/cats.png',{ frameWidth: 500, frameHeight: 500 })
    }

    create() {
        // const startButton = this.add.image(320,290, 'startbutton')
        // console.log('loaded gif')
        // const gif = this.add.sprite(0,0,'gif');
        // console.log('gif done')
        // gif.setScale(0.5);
        // gif.setInteractive()
        // console.log('before pointer')
        // gif.on('pointerdown', () => {
        //     this.scene.start("helloworldscene")
        // })
        // console.log('after pointer')
        this.anims.create({
            key: 'play-cat',
            frames: this.anims.generateFrameNumbers('cat', { 
                start: 0, 
                end: 50 
            }),
            frameRate: 10,
            repeat: -1
        });
        console.log('done creating animation')

        this.sceneSprite = this.add.sprite(this.game.canvas.width/2, this.game.canvas.height/2, "startGif")
        this.sceneSprite.play("play-cat")
        //var startGif = this.add.sprite(500, 500, "startGif")
        //startGif.play("play-gif")

        var text = this.add.text(800, 100, "click the cat")

        this.input.on("pointerdown", () =>{
            this.scene.start("helloworldscene")
        })



        //gif.anims.play('play-gif');
    }

    update() {  
	}
}