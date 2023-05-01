import Phaser from 'phaser'

export default class startScene extends Phaser.Scene {
    constructor() {
        super('startScene')
    }

    preload() {
        this.load.image('startbutton','assets/pawsclaws.png')
    }

    create() {
        var startButton = this.add.image(644,337, 'startbutton')
        startButton.setInteractive()
        startButton.on('pointerdown', () => {
            this.scene.start("helloworldscene")
            this.scene.start("PageScene")
        })
    }

    update() {
    }
}