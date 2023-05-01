// I GOT THIS CODE FROM 
// https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
// */
import Phaser from 'phaser'
import eventsCenter from '../EventsCenter';
import { Enemy } from '../componets/enemy';
import { Cowboy, Buff, Donut } from '../componets/units';
import { Bullet } from '../componets/attack';

const BULLET_DAMAGE = 33;

const map: number[][] = [
	[0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];


export enum CollisionGroup {
    BULLET = -1, ENEMY = -2
}

export default class HelloWorldScene extends Phaser.Scene {

	nextEnemy!: number;
	path!: Phaser.Curves.Path;
	cowboys!: Phaser.GameObjects.Group;
	buffs! : Phaser.GameObjects.Group;
	donuts! : Phaser.GameObjects.Group;
	enemies!: Phaser.GameObjects.Group;
	bullets!: Phaser.GameObjects.Group;
	waveNumber!: number;
	money!: number;
	moneyText!: Phaser.GameObjects.Text;
	
	constructor() {
		super('helloworldscene')
	}

	preload() {
		this.load.image('background', 'assets/grassmeadows.png');
		this.load.atlas('sprites', 'assets/redballoon_up.png', 'assets/spritesheet.json');
		//this.load.atlas('cowboy', 'assets/cowboy_cat.png', 'assets/spritesheet.json');
		//this.load.atlas('buff', '/assets/buff_doge.png', 'assets/spritesheet.json');
		this.load.image('bullet','assets/bigbill.png');
		this.load.image('cat', '/assets/cowboy_cat.png');
		this.load.image('doge', '/assets/buff_doge.png');
	}
  
	create()  {
		this.add.image(200, 200, 'background');
		
		const graphics = this.add.graphics();
		this.drawLines(graphics);
		this.path = this.add.path(96, -20);
		this.path.lineTo(96, 164);
		this.path.lineTo(480, 164);
		this.path.lineTo(480, 544);
  
		graphics.lineStyle(2, 0xffffff, 1);
		this.path.draw(graphics);

  
		this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true, repeat: 0 });
		// console.log(this.enemies)

		// Units
		this.cowboys = this.add.group({ classType: Cowboy, runChildUpdate: true });
		this.buffs = this.add.group({ classType: Buff, runChildUpdate: true });
		this.donuts = this.add.group({ classType: Donut, runChildUpdate: true });
  
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
		var waveText = this.add.text(400, 10, "Wave: " + this.waveNumber)
		var startWaveButton = this.add.text(400,50, 'Start Next Wave')
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
		this.moneyText = this.add.text(400, 30, "Money: " + this.money)

		var instructionsButton = this.add.text(200,650, 'Instructions')
        instructionsButton.setInteractive()
        instructionsButton.on('pointerdown',  () => {
			console.log("clicked button")
            this.scene.launch("InstructionsScene")
        }
        )

		// event listener 
		// waits for the event "tower-place?"" to be called in the buy menu in PageScene
		eventsCenter.on("tower-place?", (doge_text: any) => {
			this.placeTurret(this.input.mousePointer, this.buffs, doge_text)})

		eventsCenter.on("tower-place?",(cat_text: any) => {
			this.placeTurret(this.input.mousePointer, this.cowboys, cat_text)})
		

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

	private drawLines(graphics: Phaser.GameObjects.Graphics): void {
    	graphics.lineStyle(1, 0x000000, 0.8);
    	for(let i = 0; i < 8; i++) {
        	graphics.moveTo(0, i * 64);
        	graphics.lineTo(640, i * 64);
    	}
    	for(let j = 0; j < 10; j++) {
        	graphics.moveTo(j * 64, 0);
        	graphics.lineTo(j * 64, 512);
    	}
    	graphics.strokePath();
	}

	private canPlaceTurret(i: number, j: number): boolean {
		if(i > 7 || j > 9){
			return false
		}
    	return map[i][j] === 0;
	}

	private placeTurret(pointer: Phaser.Input.Pointer, turrets: Phaser.GameObjects.Group, texture: string): void {
    	const i = Math.floor(pointer.y/64);
    	const j = Math.floor(pointer.x/64);
		// I need to make something that specifies the thing that I need 
		const CC = this.cowboys
		const turret = turrets.get();
    	if(this.canPlaceTurret(i, j) && this.money >= 125) {
				this.money -= 125
				console.log("texture of tower: ",texture)
				turret.setTexture(texture)
				// if the texutre passed is doge, scale it down because the original is massive and covers the screen
				if(texture == "cat"){turret.setScale(0.04)}
            	turret.setActive(true);
            	turret.setVisible(true);
            	turret.place(i, j);
				//console.log("about to emit tower success")
				eventsCenter.emit("tower-placed-successfully", turret, texture)
				turret.setInteractive()
				turret.on("pointerdown", () => {console.log("selected unit ")})

        	}
		

			// Buff Doge
		if(this.canPlaceTurret(i, j) && this.money >= 150) {
				this.money -= 150
				console.log("texture of tower: ",texture)
				turret.setTexture(texture)
				// if the texutre passed is doge, scale it down because the original is massive and covers the screen
				if(texture == "doge"){turret.setScale(0.04)}
            	turret.setActive(true);
            	turret.setVisible(true);
            	turret.place(i, j);
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