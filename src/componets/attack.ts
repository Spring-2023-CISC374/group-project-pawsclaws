const DISTANCE_OF_BULLET_PER_SECOND = 600;
const DISTANCE_OF_PUNCH_PER_SECOND = 300;
const DISTANCE_OF_CHOMP_PER_SECOND = 300;
const DISTANCE_OF_BEER_PER_SECOND = 600;

export class Projectile extends Phaser.GameObjects.Image {
	private incX = 0;
	private incY = 0;
	private lifespan = 0;
	private speed = Phaser.Math.GetSpeed(DISTANCE_OF_BULLET_PER_SECOND, 1);
	private speed1 = Phaser.Math.GetSpeed(DISTANCE_OF_PUNCH_PER_SECOND, 1);
	private speed2 = Phaser.Math.GetSpeed(DISTANCE_OF_CHOMP_PER_SECOND, 1);
	private speed3 = Phaser.Math.GetSpeed(DISTANCE_OF_BEER_PER_SECOND, 1);
	private dx = 0;
	private dy = 0;
	gotbullet: boolean;
	gotbeer: boolean;
	gotpunch: boolean;
	isFire: boolean;
	isIce: boolean;

	constructor(scene: Phaser.Scene) {
		  super(scene, 0, 0, 'sprites', 'projectile');
		  this.isFire = false;
		  this.isIce = false;
		  this.gotpunch = false;
		  this.gotbeer = false;
		  this.gotbullet = false;
	}

	fire(x: number, y: number, angle: number, isFire: boolean, isIce: boolean): void {
		  this.setActive(true);
		  this.setVisible(true);
		  // Bullets fire from the middle of the screen to the given x/y
		  this.setPosition(x, y);
		  this.isFire = isFire;
		  this.isIce = isIce;
		  // we don't need to rotate the bullets as they are round
		  // this.setRotation(angle);

		  this.dx = Math.cos(angle);
		  this.dy = Math.sin(angle);

		  this.lifespan = 1000;
		}

	update(time: number, delta: number): void {
		  this.lifespan -= delta;

		  // If cases will be needed
		  this.x += this.dx * (this.speed * delta);
		  this.y += this.dy * (this.speed * delta);

		  if (this.lifespan <= 0) {
			this.setActive(false);
			this.setVisible(false);
		  }
	}
}