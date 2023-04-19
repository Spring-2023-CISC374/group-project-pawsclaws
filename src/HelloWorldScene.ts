// I GOT THIS CODE FROM 
// https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
// */
import Phaser from 'phaser'

const ENEMY_SPEED = 1 / 10000;
  
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


class Enemy extends Phaser.GameObjects.Image {
	follower = { t: 0, vec: new Phaser.Math.Vector2() };
	hp = 0;
	path: Phaser.Curves.Path;
	timeOnPath = 0;

	constructor(scene: HelloWorldScene) {
		var scenePath = scene.path
		super(scene, 0, 0, 'sprites', 'enemy');
		this.path = scenePath
	}

	startOnPath() {
		this.follower.t = 0;
		this.hp = 100;
		this.timeOnPath = 0;
		
		this.path.getPoint(this.follower.t, this.follower.vec);

		this.setPosition(this.follower.vec.x, this.follower.vec.y);
	}

	receiveDamage(damage: number, gameScene: Phaser.Scenes.ScenePlugin) {
		//console.log(damage)
		//console.log(this.hp)
		this.hp -= damage;
		//console.log(this.hp)
		
		// if hp drops below 0 we deactivate this enemy
		if (this.hp <= 0) {
			this.setActive(false);
			this.setVisible(false);
			this.destroy();
			gameScene.money += 50;
			
		}
	}

	update(time: number, delta: number) {
		this.follower.t += ENEMY_SPEED * delta;
		this.path.getPoint(this.follower.t, this.follower.vec);
		this.timeOnPath = this.timeOnPath + delta;

		this.setPosition(this.follower.vec.x, this.follower.vec.y);

		if (this.follower.t >= 1) {
			console.log(this.timeOnPath)
			this.setActive(false);
			this.setVisible(false);
		}
	}
}

class Turret extends Phaser.GameObjects.Image {
	private nextTic = 0;
	private enemies: Phaser.GameObjects.Group;
	private bullets: Phaser.GameObjects.Group;

	constructor(scene: HelloWorldScene) {
		super(scene, 0, 0, 'unitsprites', 'turret');
		var enemymaybe = scene.enemies
		var bulletsmaybe = scene.bullets
		
		this.enemies = enemymaybe;
		this.bullets = bulletsmaybe;
	}

	place(i: number, j: number): void {
		  this.y = i * 64 + 64 / 2; // Please check into this
		  this.x = j * 64 + 64 / 2;
		  map[i][j] = 1;
	}

	fire(): void {
		  const enemy = this.getEnemy(this.x, this.y, 200);
		  if (enemy) {
			const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
			this.addBullet(this.x, this.y, angle);
			this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
		  }
	}

	update(time: number, delta: number): void {
		  if (time > this.nextTic) {
			this.fire();
			this.nextTic = time + 1000;
		  }
	}

	private getEnemy(x: number, y: number, distance: number) {
		const enemyUnits = this.enemies.getChildren();
		const maybe = enemyUnits.entries()
		for (let i = 0; i < enemyUnits.length; i++) {
	  		const enemy = enemyUnits[i] as Enemy;
	  		if (enemy.active && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) < distance) {
				return enemy;
	  		}
		}
		return false;
	}
	private addBullet(x: number, y: number, angle: number): void {
    	const bullet = this.bullets.get();
    	if (bullet)
    	{
        	bullet.fire(x, y, angle);
    	}
	}
}

class Bullet extends Phaser.GameObjects.Image {
	private incX = 0;
	private incY = 0;
	private lifespan = 0;
	private speed = Phaser.Math.GetSpeed(600, 1);
	private dx = 0;
	private dy = 0;

	constructor(scene: Phaser.Scene) {
		  super(scene, 0, 0, 'bullet');
	}

	fire(x: number, y: number, angle: number): void {
		  this.setActive(true);
		  this.setVisible(true);
		  // Bullets fire from the middle of the screen to the given x/y
		  this.setPosition(x, y);

		  // we don't need to rotate the bullets as they are round
		  // this.setRotation(angle);

		  this.dx = Math.cos(angle);
		  this.dy = Math.sin(angle);

		  this.lifespan = 1000;
		}

	update(time: number, delta: number): void {
		  this.lifespan -= delta;

		  this.x += this.dx * (this.speed * delta);
		  this.y += this.dy * (this.speed * delta);

		  if (this.lifespan <= 0) {
			this.setActive(false);
			this.setVisible(false);
		  }
	}
}

export default class HelloWorldScene extends Phaser.Scene {

	nextEnemy!: number;
	path!: Phaser.Curves.Path;
	turrets!: Phaser.GameObjects.Group;
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
		this.load.atlas('unitsprites', 'assets/cowboy.png', 'assets/spritesheet.json');
		this.load.image('bullet','assets/bigbill.png');
	}
  
	create()  {
		this.scene.launch("PageScene") 
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
  
		this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
  
		this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  
		this.nextEnemy = 0;

		// its underlined in red but still works
		this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy, undefined, this.scene);
  
		this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			this.placeTurret(pointer, this.turrets)
		});

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
		this.scene.launch("PageScene")

		var instructionsButton = this.add.text(200,650, 'Instructions')
        instructionsButton.setInteractive()
        instructionsButton.on('pointerdown',  () => {
			console.log("clicked button")
            this.scene.launch("InstructionsScene")
        }
        )
	}

	update(time: number, delta: number): void {  

		this.moneyText.setText("Money: " + this.money)
	}

	private damageEnemy(enemy: Enemy, bullet: Bullet): void {
		// only if both enemy and bullet are alive
		
		if (enemy.active === true && bullet.active === true) {
	 		// we remove the bullet right away
	  		bullet.setActive(false);
	  		bullet.setVisible(false);
  
	  		// decrease the enemy hp with BULLET_DAMAGE
	  		enemy.receiveDamage(BULLET_DAMAGE, this.scene);
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
    	return map[i][j] === 0;
	}

	private placeTurret(pointer: Phaser.Input.Pointer, turrets: Phaser.GameObjects.Group): void {
    	const i = Math.floor(pointer.y/64);
    	const j = Math.floor(pointer.x/64);
    	if(this.canPlaceTurret(i, j) && this.money >= 125) {
			this.money -= 125
        	const turret = turrets.get();
        	if (turret)
        	{
            	turret.setActive(true);
            	turret.setVisible(true);
            	turret.place(i, j);
        	}   
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