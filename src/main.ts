import Phaser from 'phaser'
//import { Controller, SceneA, SceneB, SceneC } from './scripts/scenes/SideMenu'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import HelloWorldScene from './HelloWorldScene';
import startScene from './scenes/startScene';
import { PageScene } from './scripts/scenes/PageScene';
// import startScene from './scenes/startScene'
// import HelloWorldScene from './HelloWorldScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app', //Other one is parent: 'content' ...?
	width: 1150,
	height: 600,
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
	},
	scene: [startScene, HelloWorldScene,PageScene],
	scale: {
		// fits the game to the window
		mode: Phaser.Scale.FIT,
		// centers both horizontally and vertically if we want to
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
