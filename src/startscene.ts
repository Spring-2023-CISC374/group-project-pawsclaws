import Phaser from 'phaser'

export default class startscene extends Phaser.Scene {
	
	constructor() {
		super('startscene')
	}

	preload() {
		this.load.image('startbutton', 'assets/start.png');
	}
  
	create()  {
        var startbutton = this.add.image(200,200, 'startbutton')
        startbutton.setInteractive()
        startbutton.on('pointerdown',  () => {
            this.scene.start("helloworldscene")
			this.scene.start("")
        }
        )

    }
  
	update() {  
	}
}