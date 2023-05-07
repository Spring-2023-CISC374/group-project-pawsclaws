import { Enemy } from './enemy'
import { CollisionGroup, default as HelloWorldScene } from '../scenes/mainScene';

const DELAY_BETWEEN_SHOTS = 1000; //in milliseconds
const map: number[][] = [
	[0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, -1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0],
	[0, -1, 0, 0, 0, 0, -1, 0, -1, 0, 0],
	[0, -1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
	[0, -1, 0, -1, 0, 0, 0, -1, 0, 0, 0, 0],
	[0, -1, -1, -1, 0, 0, 0, -1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];

export class Turret extends Phaser.GameObjects.Image {
	private nextTic = 0;
	private enemies: Phaser.GameObjects.Group;
	private projectiles: Phaser.GameObjects.Group;

	// for the edit menu
	isFire: boolean;
	isIce: boolean;

	projectile_texture!: string;

	constructor(scene: HelloWorldScene) {
		super(scene, 0, 0, 'unitsprites');
		var enemymaybe = scene.enemies
		var projectilesmaybe = scene.projectiles
		
		this.enemies = enemymaybe;
		this.projectiles = projectilesmaybe;
		this.isFire = false;
		this.isIce = false;
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
			this.addProjectile(this.x, this.y, angle, this.projectile_texture);
			this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
		  }
	}

	update(time: number, delta: number): void {
		  if (time > this.nextTic) {
			this.fire();
			this.nextTic = time + DELAY_BETWEEN_SHOTS;
		  }
	}

	setClassTypes(classType: string){
		this.isFire = false;
		this.isIce = false;
		switch(classType){
			case "Fire":
				this.isFire = true;
				break;
			case "Ice":
				this.isIce = true;
				break;
			default:
				break;
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
	private addProjectile(x: number, y: number, angle: number, projectile_texture: string): void {
    	const projectile = this.projectiles.get();
		projectile.setTexture('projectile', projectile_texture).setDepth(1)
    	if (projectile)
    	{
        	projectile.fire(x, y, angle, this.isFire, this.isIce, projectile_texture);
    	}
	}
}