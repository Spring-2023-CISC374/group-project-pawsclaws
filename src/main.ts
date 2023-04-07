import Phaser from 'phaser'
import { Controller, SceneA, SceneB, SceneC } from './scripts/scenes/SideMenu'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false //Handy for checking physics
		},
	},
	scene: [Controller, SceneA, SceneB, SceneC],
}

export default new Phaser.Game(config)
