import Phaser from 'phaser'
import startScene from './scenes/startScene'
import HelloWorldScene from './HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 1280,
	height: 720,
	physics: {
		default: 'arcade'
	},
	scene: [startScene, HelloWorldScene],
	scale: {
		// fits the game to the window
		mode: Phaser.Scale.FIT,
		// centers both horizontally and vertically if we want to
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)