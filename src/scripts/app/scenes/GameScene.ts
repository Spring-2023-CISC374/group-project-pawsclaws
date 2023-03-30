import { Scene } from 'phaser'
import { isEmpty, range, take, zip } from 'lodash';
import Unit, {} from '../componets/units'
import Balloon from '../componets/balloon'
import Graphics = Phaser.GameObjects.Graphics;
import Vector2 = Phaser.Math.Vector2;
import Tilemap = Phaser.Tilemaps.Tilemap;
//import StaticTilemapLayer = Phaser.Tilemaps.StaticTilemapLayer;
import Sprite = Phaser.Physics.Matter.Sprite;
//import DynamicTilemapLayer = Phaser.Tilemaps.DynamicTilemapLayer;

export enum UnitType {
    
}

export type GameTile =
    Phaser.Tilemaps.Tile
    & { properties: { collides: boolean, mount: boolean, weapon_type: UnitType, unit_price: number } }

export type placedUnit = { sprite: Unit, tile: { x: number, y: number } }

export enum CollisionGroup {
    BULLET = -1, ENEMY = -2
}

export default class GameScene extends Scene {
	// ! can let take script know that we know that it won't be set for a little bit
	// ? it miight be undefined
	private paths?: Phaser.Physics.Arcade.StaticGroup
	private player?: Phaser.Physics.Arcade.Sprite 
	//private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	private balloons?: Phaser.Physics.Arcade.Group

	private score = 0
	private scoreText?: Phaser.GameObjects.Text

	//private bombs?: Phaser.Physics.Arcade.Group

	private gameOver = false
	private gameOverText?: Phaser.GameObjects.Text

	//private music?: Phaser.Game
	
	

	preload() {
		this.load.image('grasslands','/assets/grasslands.png')
		this.load.image('pathHor1', '/assets/pathHor.png')
		this.load.image('pathHor2', '/assets/pathHor.png')
		this.load.image('pathVer', '/assets/pathVer.png')
		//this.load.audio("retro",["/assets/retro.mp3"])
		//this.load.spritesheet('dude','/assets/pinkguy.png', { frameWidth: 32, frameHeight: 48 })
	}

    create() {



        this.scoreText = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
			color: '#fff' // fill didn't work
		})

		this.gameOverText = this.add.text(225, 250,'Game Over', {
			fontSize: '64px',
			color: '#fff'
		})
		this.gameOverText.visible = false
    }
}