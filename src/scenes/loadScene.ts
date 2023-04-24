import Phaser from "phaser";

export default class loadScene extends Phaser.Scene{
    constructor(){
        super({key: 'loadScene'});
    }

    preload(){
        this.load.spritesheet('mainBg', "public/assets/back.gif", {frameWidth: 500, frameHeight: 475});
    }
    createMainBG(){
        this.anims.create({
          key:'mainBg',
          frames: this.anims.generateFrameNumbers('mainBg', {}),
          frameRate: 10,
          repeat: -1
      });
      }
}