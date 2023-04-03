import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 640,
	height: 512,
	physics: {
		default: 'arcade'
	},
	scene: [HelloWorldScene]
}

export default new Phaser.Game(config)