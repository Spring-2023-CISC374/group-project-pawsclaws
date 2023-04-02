import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import ButtonPlugin from 'phaser3-rex-plugins/plugins/button-plugin.js';

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
	scene: [HelloWorldScene],
	plugins: {
        global: [{
            key: 'rexButton',
            plugin: ButtonPlugin,
            start: true
        	}
		]
	}
}

export default new Phaser.Game(config)
