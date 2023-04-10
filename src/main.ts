import Phaser from 'phaser'
import startScene from './scenes/startScene'
import HelloWorldScene from './HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 640,
	height: 512,
	physics: {
		default: 'arcade'
	},
	scene: [startScene, HelloWorldScene]
}

export default new Phaser.Game(config)