import Phaser from 'phaser'
//import { Controller, SceneA, SceneB, SceneC } from './scripts/scenes/SideMenu'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { PageScene } from './scripts/scenes/PageScene';

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 1000,
	dom: {
		createContainer: true
	},
	plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false //Handy for checking physics
		},
	},
	scene: [PageScene],
}

export default new Phaser.Game(config)
