// I GOT THIS CODE FROM 
// https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
// */
import Phaser from 'phaser'
import eventsCenter from '../EventsCenter';
import { Enemy } from '../componets/enemy';
import { Turret } from '../componets/units';
import { Bullet } from '../componets/attack';

const BULLET_DAMAGE = 33;

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
	bullets!: Phaser.GameObjects.Group;
	waveNumber!: number;
	money!: number;
	moneyText!: Phaser.GameObjects.Text;
	
	constructor() {
		super('helloworldscene')
	}

	preload() {
		this.load.image('background', 'assets/map.png');
		this.load.atlas('sprites', 'assets/redballoon_up.png', 'assets/spritesheet.json');
		//this.load.atlas('cowboy', 'assets/cowboy_cat.png', 'assets/spritesheet.json');
		//this.load.atlas('buff', '/assets/buff_doge.png', 'assets/spritesheet.json');
		this.load.image('bullet','assets/bigbill.png');
		this.load.image('cowboy', '/assets/cowboy_cat.png');
		this.load.image('buff', '/assets/buff_doge.png');
		this.load.image('bar', '/assets/menu.PNG')
		this.load.audio("pop", ["/assets/Pops.mp3"])
	}
  
	create()  {

		this.add.image(415, 320, 'background').setScale(0.89);
		this.add.image(380, 760, 'bar')

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
		// console.log(this.enemies)

		// Units
		this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
  
		this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  
		this.nextEnemy = 0;

		// its underlined in red but still works
		this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy, undefined, this.scene);
  
		/*
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			this.placeTurret(pointer, this.turrets, "unitsprites")
		});
		*/

		this.waveNumber = 0
		var waveText = this.add.text(50, 640, "Wave: " + this.waveNumber)
		var startWaveButton = this.add.text(50,675, 'Start Next Wave')
		startWaveButton.setInteractive()
		startWaveButton.on('pointerdown', () => {
			
			//fucntion called start wave
			if(this.enemies.getLength() == 0){
				this.waveNumber++
				waveText.setText("Wave: " + this.waveNumber)
				this.startWave(this.waveNumber)
			}

		})

		this.money = 300
		this.moneyText = this.add.text(50, 657, "Money: " + this.money)

		var instructionsButton = this.add.text(600,650, 'Instructions')
        instructionsButton.setInteractive()
        instructionsButton.on('pointerdown',  () => {
			console.log("clicked button")
            this.scene.launch("InstructionsScene")
        }
        )

		// event listener 
		// waits for the event "tower-place?"" to be called in the buy menu in PageScene
		eventsCenter.on("tower-place?", (text: any) => {
			this.placeTurret(this.input.mousePointer, this.turrets, text)})
		
		eventsCenter.on("canplace", (pointer: any) => {
			console.log("wipppiee")
			eventsCenter.emit("returnplace", this.canPlace(Math.floor(pointer.y/64), Math.floor(pointer.x/64)))
		})

		eventsCenter.on("changeHorizontally", (lst: any) => {
			var turret = lst[0]
			var newCord = Number(lst[1])
			var original_i = Math.floor(turret.y/64)
			var original_j = Math.floor(turret.x/64)
			if(this.canPlace(original_i, newCord)){
				map[original_i][newCord] = 1
				map[original_i][original_j] = 0
				turret.x = newCord * 64 + 64 / 2
			}
		})
		eventsCenter.on("changeVertically", (lst: any) => {
			var turret = lst[0]
			var newCord = Number(lst[1])
			var original_i = Math.floor(turret.y/64)
			var original_j = Math.floor(turret.x/64)
			if(this.canPlace(newCord, original_j)){
				map[newCord][original_j] = 1
				map[original_i][original_j] = 0
				turret.y = newCord * 64 + 64 / 2
			}
		})

		var popSound = this.sound.add("pop")
		eventsCenter.on("popsound", () => {
			setTimeout(() => {
				popSound.play()
			}, 100)
		})
		

	}

	update(time: number, delta: number): void {  

		this.moneyText.setText("Money: " + this.money)
		
	}

	private damageEnemy(enemy: any, bullet: any): void {
		// only if both enemy and bullet are alive
		
		if (enemy.active === true && bullet.active === true) {
	 		// we remove the bullet right away
	  		bullet.setActive(false);
	  		bullet.setVisible(false);
  
	  		// decrease the enemy hp with BULLET_DAMAGE
	  		enemy.receiveDamage(BULLET_DAMAGE, this.scene, bullet.isFire, bullet.isIce);
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
    	return map[i][j] === 0;
	}

	private placeTurret(pointer: Phaser.Input.Pointer, turrets: Phaser.GameObjects.Group, texture: string): void {
    	const i = Math.floor(pointer.y/64);
    	const j = Math.floor(pointer.x/64);
		// I need to make something that specifies the thing that I need
    	if(this.canPlace(i, j)) {
				// if the texutre passed is doge, scale it down because the original is massive and covers the screen
				if(texture == "cowboy"){
					if (this.money >= 125) {
						this.money -= 125
					} else {
						return
					}
				}
				if (texture == "buff") {
					if (this.money >= 150) {
						this.money -= 150
					} else {
						return
					}
				}
				const turret = turrets.get()
				console.log("texture of tower: ",texture)
				turret.setTexture(texture)
				turret.setScale(0.04)
            	turret.setActive(true);
            	turret.setVisible(true);
            	turret.place(i, j);
				//added to update the map in mainScene
				map[i][j] = 1
				//console.log("about to emit tower success")
				eventsCenter.emit("tower-placed-successfully", turret, texture)
				turret.setInteractive()
				turret.on("pointerdown", () => {console.log("selected unit ")})

        	}
    	}

	private startWave(waveNumber: number) {
		const enemy = this.enemies.get()
		if (enemy){
			enemy.setActive(true)
			enemy.setVisible(true)
			enemy.startOnPath()
		}
		waveNumber--;
		if(waveNumber > 0){
			setTimeout(() => {this.startWave(waveNumber)}, 1000)
		}
	}
}