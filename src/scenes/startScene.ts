import Phaser from "phaser";
import LoadScene from "./LoadScenes";
import startscene from "../startscene";

export default class StartScene extends Phaser.Scene{
    sceneSprite: any;
    startSprite: any;
    music: any;
    constructor(){
        super({key: 'loadScene'});
    }

    preload(){
                this.load.spritesheet('bg', 'public/assets/home.png',{ frameWidth: 1090, frameHeight: 1100})
                this.load.audio('bgMusic',["public/assets/Bg.mp3"])
    }
    create()
{
    this.anims.create({
        key: 'play-bg',
        frames: this.anims.generateFrameNumbers('bg', { 
            start: 0, 
            end: 49
        }),
        frameRate: 10,
        repeat: -1
    });
    this.sceneSprite = this.add.sprite(this.game.canvas.width/2, this.game.canvas.height/2, "startGif")
    this.sceneSprite.play("play-bg")
    this.sceneSprite.setInteractive()
    this.music = this.sound.add('bgMusic')
    this.bgMusic()
    var text = this.add.text(500, 500, "start game")
    text.setInteractive()
    var text2 = this.add.text(500, 550, "options")
    var text3 = this.add.text(500, 600, "instructions")
    text.on('pointerdown',  () => {
        this.scene.start("startScene")
        this.stopMusic()
    }
    )

    }
    bgMusic(){
        this.music.play();
    }
    stopMusic(){
        this.music.stopMusic();
    }

    update() {
    }
}