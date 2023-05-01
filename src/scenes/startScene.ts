import Phaser from "phaser";

export default class StartScene extends Phaser.Scene{
    sceneSprite: any;
    startSprite: any;

    constructor(){
        super({key: 'loadScene'});
    }

    preload(){
                this.load.spritesheet('bg', 'public/assets/b2.png',{ frameWidth: 300, frameHeight: 300})
                this.load.image('buttons', 'public/assets/butts.jpg');
    }
    create()
{
    this.anims.create({
        key: 'play-bg',
        frames: this.anims.generateFrameNumbers('bg', { 
            start: 0, 
            end: 32
        }),
        frameRate: 10,
        repeat: -1
    });
    this.sceneSprite = this.add.sprite(this.game.canvas.width/2, this.game.canvas.height/2, "startGif")
    this.sceneSprite.play("play-bg")
    const buttons = this.add.image(200,200, 'buttons').setDepth(1)
    buttons.setInteractive()
    buttons.on('pointerdown',  () => {
        this.scene.start("helloworldscene")
    }
    )

    }
    update() {
    }
}