import Phaser, { CANVAS, Scale } from 'phaser'

export default class startScene extends Phaser.Scene {
    constructor() {
        super('startScene')
        console.log('in start const')
    }

    preload() {
        this.load.image('startbutton','assets/pawsclawsupdate.png')
        this.load.image('gif','public/assets/back.png');
    }

    create() {
        const startButton = this.add.image(320,290, 'startbutton')
        console.log('loaded gif')
        const gif = this.add.sprite(this.game.canvas.height/2,this.game.canvas.width/2,'gif');
        console.log('gif done')
        gif.setScale(this.game.canvas.height/2,this.game.canvas.width/2);
        gif.setInteractive()
        console.log('before pointer')
        gif.on('pointerdown', () => {
            this.scene.start("helloworldscene")
        })
        console.log('after pointer')
        this.anims.create({
            key: 'play-gif',
            frames: this.anims.generateFrameNumbers('gif', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
        });
        console.log('done creating animation')
        gif.anims.play('play-gif');
    }
}