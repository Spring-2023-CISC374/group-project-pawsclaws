// I GOT THIS CODE FROM 
// https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
// */
import Phaser from 'phaser'
import eventsCenter from '../EventsCenter';
import { Enemy } from '../componets/enemy';
import { Turret } from '../componets/units';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { Projectile } from '../componets/attack';
import buff_doge from '/assets/buff_doge.png';
import cowboy_cat from '/assets/cowboy_cat.png';
import rootbeer_cat from '/assets/rootbeer_cat.png';
import bulldog from '/assets/bulldog.png';
import doguari from '/assets/dogurai.png';
import reaper_cat from '/assets/reaper_cat.png';
import background from '/assets/map.png';
import lucky_cat from '/assets/lucky.png';
import king from '/assets/benji.png';
import bugs from '/assets/bunny.png';
import foxy from '/assets/foxy.png';
import bango from '/assets/bango_croc.png';
import OG from '/assets/OG.png'

const BULLET_DAMAGE = 50;
const NEXT_BALLOON_SPAWN = 650; //in milliseconds

const map: number[][] = [
	[0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, -1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0],
	[0, -1, 0, 0, 0, 0, 0, -1, 0, -1, 0, 0],
	[0, -1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
	[0, -1, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
	[0, -1, -1, -1, 0, 0, 0, -1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];
const redBalloonsPerWave: number[] = [8,10,8,14,5,8,12,5,0,0,12,0]
const blueBalloonsPerWave: number[] = [0,0,3,6,16,8,10,18,0,45,10,0]
const greenBalloonsPerWave: number [] = [0,0,0,0,0,4,8,10,18,0,8,0]
const purpleBalloonsPerWave: number [] = [0,0,0,0,0,0,0,0,0,0,0,4,100]

export enum CollisionGroup {
    BULLET = -1, ENEMY = -2
}

export default class HelloWorldScene extends Phaser.Scene {

	nextEnemy!: number;
	path!: Phaser.Curves.Path;
	turrets!: Phaser.GameObjects.Group;
	//cowboys!: Phaser.GameObjects.Group;
	//buffs! : Phaser.GameObjects.Group;
	//donuts! : Phaser.GameObjects.Group;
	enemies!: Phaser.GameObjects.Group;
	projectiles!: Phaser.GameObjects.Group;
	waveNumber!: number;
	waveText!: any;
	money!: number;
	moneyText!: Phaser.GameObjects.Text;
	rexUI!: RexUIPlugin;
	gameOver!: boolean
	map!: any;
	bestRound!: string;
	
	constructor() {
		super('helloworldscene')
		this.bestRound = '0'
	}

	preload() {
		this.load.image('background', background);
		this.load.atlas('sprites', 'assets/redballoon_up.png', 'assets/spritesheet.json');
		this.load.atlas('balloons', 'assets/balloonspritesheet.png', 'assets/balloons.json');
		this.load.atlas('projectile','assets/spritesheetprojectiles.png', 'assets/projectiles.json');

		this.load.image('mark', 'assets/marks.png');
		this.load.image('start', 'assets/startbutton.png');
		this.load.image('bar', 'assets/menu.PNG');
		this.load.audio("pop", ["assets/Pops.mp3"]);
		this.load.audio("music", ["assets/Main.mp3"]);

		this.load.image('cowboy', cowboy_cat);
		this.load.image('buff', buff_doge);
		this.load.image('bigm', rootbeer_cat);
        this.load.image('bulldog', bulldog);
		this.load.image('dogurai', doguari);
		this.load.image('reaper', reaper_cat);
		this.load.image('lucky', lucky_cat);
       	this.load.image('king',king);
      	this.load.image('bunny', bugs);
       	this.load.image('fox', foxy);
       	this.load.image('croc', bango);
       	this.load.image('OG',OG);
	}
  
	create()  {
		this.scene.launch("PageScene")
		this.map = JSON.parse(JSON.stringify(map))

		var background = this.add.image(415, 320, 'background').setScale(0.89)
		this.add.image(380, 760, 'bar')

		// Game Over & Restart Screen
		//var restart = this.add.text(400, 300, 'Restart', {fontSize: '32px', color: '#000'})
		//restart.setInteractive
		//restart.on('pointerdown', () => {
		//	this.scene.restart()
		//})

		// Only used for visualization
		const graphics = this.add.graphics();
		this.drawLines(graphics);

		// The path of our enemies 
		// Parameters are the start and y of our path
		this.path = this.add.path(96, -20);
		this.path.lineTo(96, 164);
		this.path.lineTo(96, 350);
		this.path.lineTo(225, 350);
		//this.path.lineTo(225, 230);
		this.path.lineTo(225, 230);
		this.path.lineTo(610, 230);
		this.path.lineTo(610, 100);
		this.path.lineTo(480, 100);
		this.path.lineTo(480, 426);
		this.path.lineTo(610, 426);
		this.path.lineTo(610, 610);
  
		graphics.lineStyle(2, 0xffffff, 1);

		// Visualize the path
		this.path.draw(graphics);

  
		this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true, repeat: 0 });

		// Units
		this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
  
		this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: true });
  
		this.nextEnemy = 0;

		// its underlined in red but still works
		this.physics.add.overlap(this.enemies, this.projectiles, this.damageEnemy, undefined, this.scene);
  
		/*
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			this.placeTurret(pointer, this.turrets, "unitsprites")
		});
		*/

		this.waveNumber = 0
		this.waveText = this.add.text(25, 640, "Wave: " + this.waveNumber).setFontSize(28)
		var startWaveButton = this.add.image(385,672, 'start').setScale(.8,.8)
		startWaveButton.setInteractive()
		startWaveButton.on('pointerdown', () => {
			
			//fucntion called start wave
			if(this.enemies.getLength() == 0){
				this.waveNumber++
				this.startWave(this.waveNumber)
			}

		})

		this.money = 300
		this.moneyText = this.add.text(25, 665, "Money: " + this.money).setFontSize(28)

		var instructionsButton = this.add.image(700,665, 'mark')
        instructionsButton.setInteractive()
        instructionsButton.on('pointerdown',  () => {
            this.scene.launch("InstructionsScene")
        }
        )

		// event listener 
		// waits for the event "tower-place?"" to be called in the buy menu in PageScene
		eventsCenter.on("tower-place?", (text: any, projectile_text: any) => {
			this.placeTurret(this.input.mousePointer, this.turrets, text, projectile_text)})
		
		eventsCenter.on("canplace", (pointer: any) => {
			eventsCenter.emit("returnplace", this.canPlace(Math.floor(pointer.y/64), Math.floor(pointer.x/64)))
		})

		eventsCenter.on("changeHorizontally", (lst: any) => {
			var turret = lst[0]
			var newCord = Number(lst[1])
			var original_i = Math.floor(turret.y/64)
			var original_j = Math.floor(turret.x/64)
			if(this.canPlace(original_i, newCord)){
				this.map[original_i][newCord] = 1
				this.map[original_i][original_j] = 0
				turret.x = newCord * 64 + 64 / 2
				turret.range_circle.x = turret.x
				tower_title.x = turret.x
			}
		})
		eventsCenter.on("changeVertically", (lst: any) => {
			var turret = lst[0]
			var newCord = Number(lst[1])
			var original_i = Math.floor(turret.y/64)
			var original_j = Math.floor(turret.x/64)
			if(this.canPlace(newCord, original_j)){
				this.map[newCord][original_j] = 1
				this.map[original_i][original_j] = 0
				turret.y = newCord * 64 + 64 / 2
				turret.range_circle.y = turret.y
				tower_title.y = turret.y - 64
				if(tower_title.y < 0){
					tower_title.y = turret.y + 60
				}
			}
		})
		// eventsCenter.on("checkIfNameExists", (name: any) => {
		// 	var result = this.turrets.getChildren().find(v => v.name === name);
		// })

		var popSound = this.sound.add("pop")
		eventsCenter.on("popsound", () => {
			setTimeout(() => {
				popSound.play()
			}, 50)
		})

		
        var tower_title = this.rexUI.add.label({
			width: 80, 
			height: 30,
			x: 0,
			y: 0,
			space: {left: 1},
			
			background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 1, 0x7b5e57),
			text: this.add.text(0, 0, "").setFontSize(16),
		}).layout().setVisible(false).setDepth(2);

		eventsCenter.on("selected_tower", (turret: Turret, turrets: Phaser.GameObjects.Group) => {
			if(!(turret.range_circle.visible)){
				tower_title.x = turret.x
				tower_title.y = turret.y - 60
				if(tower_title.y < 0) {
					tower_title.y = turret.y + 60
				}
				if(turret.nameTurret){
					tower_title.setText(turret.nameTurret.substring(0,8)).setVisible(true)
				}
				
				turret.range_circle.setRadius(turret.range)
				turret.range_circle.setVisible(true)
				turret.setDepth(1)
			}
			else {
				tower_title.setVisible(false)
				turret.range_circle.setVisible(false)
				turret.setDepth(0)
			}
			var all_turrets = turrets.getChildren()
			all_turrets.forEach((turret_lst: any) => {
				if(turret_lst !== turret){
					turret_lst.range_circle.setVisible(false)
					turret_lst.setDepth(0)
				}
			})
		})
		background.setInteractive()
		background.on("pointerdown", () => {
			this.turrets.getChildren().forEach((turret: any) => {
				turret.range_circle.setVisible(false)
				turret.setDepth(0)
			})
			tower_title.setVisible(false)
		})

		this.gameOver = false
		eventsCenter.on("GameOver", () => {
			if(!this.gameOver){
				this.gameOver = true
				this.scene.pause("HelloWorldScene")
				this.scene.pause("PageScene")
				this.scene.launch("GameOverScene", {currRound: this.waveNumber, bestRound: this.bestRound})
			}
		})
		eventsCenter.on("Restart", ()=>{
			this.scene.stop("GameOverScene")
			this.scene.resume("PageScene")
			this.scene.resume("HelloWorldScene")
			this.enemies.clear(true, true)
			this.turrets.getChildren().forEach((child: any) =>{
				child.range_circle.setVisible(false)
			})
			tower_title.setVisible(false)
			this.turrets.clear(true, true)
			this.projectiles.clear(true, true)
			this.waveNumber = 0
			this.money = 300
			this.nextEnemy = 0
			this.map = JSON.parse(JSON.stringify(map))
			this.gameOver = false
		})

		// Music not working?????
		var musicConfig = this.sound.add("music", {
			mute: false,
			volume: .5,
			rate: 1,
			detune: 0,
			seek: 0,
			loop: true,
			delay: 0
		})
		musicConfig.play()
	}

	update(): void {  

		this.moneyText.setText("Money: " + this.money)
		this.waveText.setText("Wave: " + this.waveNumber)

		var bestRound = localStorage.getItem("highscore")
		if(bestRound !== null){
			this.bestRound = bestRound
		}
		else{bestRound = "0"}
		if(this.waveNumber > (this.bestRound as unknown as number)){
			localStorage.setItem("highscore", this.waveNumber as unknown as string)
		}

		
	}

	private damageEnemy(enemy: any, projectile: any): void {
		// only if both enemy and projectile are alive
		
		// if (enemy.active === true && bullet.active === true) {
	 	// 	// we remove the bullet right away
		// 	if(bullet.texture.key === "fists"){
		// 		bullet.setDepth(1).setScale(1.5)
		// 		bullet.setActive(false);
		// 		//bullet.x = enemy.x
		// 		//bullet.y = enemy.y
		// 		setTimeout(() => {
		// 			bullet.setVisible(false);
		// 		}, 150)
		// 	}
		// 	else{
		// 		bullet.setActive(false);
	  	// 		bullet.setVisible(false);
		// 	}
		// }
		if (enemy.active === true && projectile.active === true) {
	 		// we remove the projectile right away
	  		projectile.setActive(false);
	  		projectile.setVisible(false);
  
	  		// decrease the enemy hp with BULLET_DAMAGE
	  		enemy.receiveDamage(BULLET_DAMAGE, this.scene, projectile.isFire, projectile.isIce);
			var hp = enemy.getHp();
			if (hp > 150){ //purple == 151-200
				enemy.setTexture('balloons', 'purple');
			}
			else if (hp > 100){ //green == 101-150
				enemy.setTexture('balloons', 'green');
			}
			else if (hp > 50){ //blue == 51-100
				enemy.setTexture('balloons', 'blue');
			}
			else if (hp > 0){	//red === 0-50
				enemy.setTexture('balloons', 'red');
			}
		}
	}

	// Draws the grid and makes it bigger
	private drawLines(graphics: Phaser.GameObjects.Graphics): void {
    	graphics.lineStyle(1, 0x000000, 0.8);
    	for(let i = 0; i < 10; i++) {
        	graphics.moveTo(0, i * 64);
        	graphics.lineTo(800, i * 64);
    	}
    	for(let j = 0; j < 13; j++) {
        	graphics.moveTo(j * 64, 0);
        	graphics.lineTo(j * 64, 610);
    	}
    	graphics.strokePath();
	}

	private canPlace(i: number, j: number): boolean {
		if(i > 8 || j > 11){
			return false
		}
		if(i < 0 || j < 0){
			return false
		}
    	return this.map[i][j] === 0;
	}

	private placeTurret(pointer: Phaser.Input.Pointer, turrets: Phaser.GameObjects.Group, texture: string, textureP: string): void {
    	const i = Math.floor(pointer.y/64);
    	const j = Math.floor(pointer.x/64);
		// I need to make something that specifies the thing that I need
    	if(this.canPlace(i, j)) {
				var range;
				// if the texutre passed is doge, scale it down because the original is massive and covers the screen
				if(texture == "cowboy" || texture == "cowboys"){
					// I thought it made sense for the projectiles to go within the if and or 
					// into another if statement spritesheetprojectile.json
					if (this.money >= 150) {
						this.money -= 150
						range = 200
					} else {
						return 
					}
				}
				if (texture == "buff" || texture == "buffs") {
					
					if (this.money >= 175) {
						this.money -= 175
						range = 150
					} else {
						return
					}
					
				}
				if (texture == "bigm" || texture == "bigms") {
					
					if (this.money >= 225) {
						this.money -= 225
						range = 200
					} else {
						return
					}
					
				}
				if (texture == "bulldog" || texture == "bulldogs") {
					
					if (this.money >= 275) {
						this.money -= 275
						range = 150
					} else {
						return
					}
					
				}
				if (texture == "reaper" || texture == "reapers") {					
					if (this.money >= 350) {
						this.money -= 350
						range = 150
					} else {
						return
					}
					
				}
				if (texture == "dogurai" || texture == "dogurais") {
					if (this.money >= 375) {
						this.money -= 375
						range = 150
					} else {
						return
					}
					
				}

				// New Units

				if(texture == "lucky" || texture == "luckys"){
					// I thought it made sense for the projectiles to go within the if and or 
					// into another if statement spritesheetprojectile.json
					if (this.money >= 450) {
						this.money -= 450
						range = 200
					} else {
						return 
					}
				}
				if (texture == "king" || texture == "kings") {
					
					if (this.money >= 475) {
						this.money -= 475
						range = 200
					} else {
						return
					}
					
				}
				if (texture == "bunny" || texture == "bunnys") {
					
					if (this.money >= 525) {
						this.money -= 525
						range = 200
					} else {
						return
					}
					
				}
				if (texture == "fox" || texture == "foxes") {
					
					if (this.money >= 600) {
						this.money -= 600
						range = 200
					} else {
						return
					}
					
				}
				if (texture == "croc" || texture == "crocs") {					
					if (this.money >= 650) {
						this.money -= 650
						range = 200
					} else {
						return
					}
					
				}
				if (texture == "OG" || texture == "OGs") {
					if (this.money >= 1000) {
						this.money -= 1000
						range = 350
					} else {
						return
					}
					
				}


				const turret = turrets.get()
				turret.setTexture(texture)
				turret.setScale(0.04)
            	turret.setActive(true);
            	turret.setVisible(true);
            	turret.place(i, j);
				turret.range = range

				turret.projectile_texture = textureP

				//added to update the map in mainScene
				this.map[i][j] = 1
				eventsCenter.emit("tower-placed-successfully", turret, texture)
				
				turret.setInteractive()
				turret.on("pointerdown", () => {
					eventsCenter.emit("selected_tower", turret, turrets)
				})
        	}
    	}
	
	// Takes in the current wave number and uses it to get number of each type of balloon per wave
	private async startWave(waveNumber: number) {
		var numberOfRedBalloons = 0;
		var numberOfBlueBalloons = 0;
		var numberOfGreenBalloons = 0;
		var numberOfPurpleBalloons = 0;
		//Checks redBalloonsPerWave array and uses waveNumber as index to get correct number of balloons for this wave
		//continues spawning until meets expect number of balloons
		while(numberOfRedBalloons < redBalloonsPerWave[waveNumber-1]){
			this.spawnBalloon(50, 'red');
			await this.sleep(NEXT_BALLOON_SPAWN)
			numberOfRedBalloons++;
		}
		//Checks blueBalloonsPerWave array and uses waveNumber as index to get correct number of balloons for this wave
		//continues spawning until meets expect number of balloons
		while(numberOfBlueBalloons < blueBalloonsPerWave[waveNumber-1]){
			this.spawnBalloon(100, 'blue');
			await this.sleep(NEXT_BALLOON_SPAWN);
			numberOfBlueBalloons++;
		}
		//Checks greenBalloonsPerWave array and uses waveNumber as index to get correct number of balloons for this wave
		//continues spawning until meets expect number of balloons
		while(numberOfGreenBalloons < greenBalloonsPerWave[waveNumber-1]){
			this.spawnBalloon(150, 'green');
			await this.sleep(NEXT_BALLOON_SPAWN);
			numberOfGreenBalloons++;
		}
		//Checks purpleBalloonsPerWave array and uses waveNumber as index to get correct number of balloons for this wave
		//continues spawning until meets expect number of balloons
		while(numberOfPurpleBalloons < purpleBalloonsPerWave[waveNumber-1]){
			this.spawnBalloon(200, 'purple');
			await this.sleep(NEXT_BALLOON_SPAWN);
			numberOfPurpleBalloons++;
		}
	}

	// Used to create spawning break between balloons
	private sleep(ms: any){
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	// Used to spawn balloon upon call in startWave function, takes in hp and texture to be placed
	private spawnBalloon(hp: any, texture: any){
		const enemy = this.enemies.get()
		if (enemy){
			enemy.setActive(true);
			enemy.setVisible(true);
			enemy.startOnPath(hp);
			enemy.setTexture('balloons', texture);
		}
	}
}