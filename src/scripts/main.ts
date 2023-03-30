import Phaser from 'phaser'

import Scene from './app/scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false //Handy for checking physics
		},
	},
	scene: [Scene],
}

export default new Phaser.Game(config)
