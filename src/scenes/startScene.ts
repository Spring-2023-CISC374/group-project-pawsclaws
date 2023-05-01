import Phaser from 'phaser'

export default class startScene extends Phaser.Scene {
    constructor() {
        super('startScene')
    }

    preload() {
        this.load.image('startbutton','assets/pawsclawsupdate.png')
    }

    create() {
        var startButton = this.add.image(320,290, 'startbutton')
        startButton.setInteractive()
        startButton.on('pointerdown', () => {
            this.scene.start("helloworldscene")
            //this.scene.start("PageScene")
        })
    }

    update() {
    }
}