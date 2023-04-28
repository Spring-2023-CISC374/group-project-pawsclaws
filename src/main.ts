import Phaser from 'phaser'
import startScene from './scenes/startScene'
import HelloWorldScene from './HelloWorldScene'
import { InstructionsScene } from './scripts/scenes/InstructionsScene';

//import { Controller, SceneA, SceneB, SceneC } from './scripts/scenes/SideMenu'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { PageScene } from './scripts/scenes/PageScene';



const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 1280,
	height: 720,
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
		default: 'arcade'
	},
	scene: [startScene, HelloWorldScene, PageScene, InstructionsScene],
	scale: {
		// fits the game to the window
		mode: Phaser.Scale.FIT,
		// centers both horizontally and vertically if we want to
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)

