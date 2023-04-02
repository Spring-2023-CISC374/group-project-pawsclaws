import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 640,
	height: 512,
	physics: {
	  default: 'arcade'
	},
	scene: {
	  key: 'main',
	  preload,
	  create,
	  update
	}
};

  
const game = new Phaser.Game(config);
  
let path: Phaser.Curves.Path;
let turrets: Phaser.GameObjects.Group;
let enemies: Phaser.GameObjects.Group;
let bullets: Phaser.GameObjects.Group;
let nextEnemy: number;
  
const ENEMY_SPEED = 1 / 10000;
  
const BULLET_DAMAGE = 50;
  
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
  
function preload(this: Phaser.Scene) {
	this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
	this.load.image('bullet', 'assets/bullet.png');
}
  
class Enemy extends Phaser.GameObjects.Image {
	follower = { t: 0, vec: new Phaser.Math.Vector2() };
	hp = 0;
  
	constructor(scene: Phaser.Scene) {
	  super(scene, 0, 0, 'sprites', 'enemy');
	}
  
	startOnPath() {
	  this.follower.t = 0;
	  this.hp = 100;
  
	  path.getPoint(this.follower.t, this.follower.vec);
  
	  this.setPosition(this.follower.vec.x, this.follower.vec.y);
	}
  
	receiveDamage(damage: number) {
	  this.hp -= damage;
  
	  // if hp drops below 0 we deactivate this enemy
	  if (this.hp <= 0) {
		this.setActive(false);
		this.setVisible(false);
	  }
	}
  
	update(time: number, delta: number) {
	  this.follower.t += ENEMY_SPEED * delta;
	  path.getPoint(this.follower.t, this.follower.vec);
  
	  this.setPosition(this.follower.vec.x, this.follower.vec.y);
  
	  if (this.follower.t >= 1) {
		this.setActive(false);
		this.setVisible(false);
	  }
	}
}
  
function getEnemy(x: number, y: number, distance: number) {
	const enemyUnits = enemies.getChildren();
	for (let i = 0; i < enemyUnits.length; i++) {
	  const enemy = enemyUnits[i] as Enemy;
	  if (enemy.active && Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) < distance) {
		return enemy;
	  }
	}
	return false;
}

class Turret extends Phaser.GameObjects.Image {
	private nextTic = 0;
  
	constructor(scene: Phaser.Scene) {
	  super(scene, 0, 0, 'sprites', 'turret');
	}
  
	place(i: number, j: number): void {
	  this.y = i * 64 + 64 / 2;
	  this.x = j * 64 + 64 / 2;
	  map[i][j] = 1;
	}
  
	fire(): void {
	  const enemy = getEnemy(this.x, this.y, 200);
	  if (enemy) {
		const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
		addBullet(this.x, this.y, angle);
		this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
	  }
	}
  
	update(time: number, delta: number): void {
	  if (time > this.nextTic) {
		this.fire();
		this.nextTic = time + 1000;
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
  
function create(this: Phaser.Scene)  {
	const graphics = this.add.graphics();
	drawLines(graphics);
	path = this.add.path(96, -32);
	path.lineTo(96, 164);
	path.lineTo(480, 164);
	path.lineTo(480, 544);
  
	graphics.lineStyle(2, 0xffffff, 1);
	path.draw(graphics);
  
	enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
  
	turrets = this.add.group({ classType: Turret, runChildUpdate: true });
  
	bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  
	nextEnemy = 0;
  
	this.physics.add.overlap(enemies, bullets, damageEnemy);
  
	this.input.on('pointerdown', placeTurret);
}
  
function damageEnemy(enemy: Enemy, bullet: Bullet): void {
	// only if both enemy and bullet are alive
	if (enemy.active === true && bullet.active === true) {
	  // we remove the bullet right away
	  bullet.setActive(false);
	  bullet.setVisible(false);
  
	  // decrease the enemy hp with BULLET_DAMAGE
	  enemy.receiveDamage(BULLET_DAMAGE);
	}
}

function drawLines(graphics: Phaser.GameObjects.Graphics): void {
    graphics.lineStyle(1, 0x0000ff, 0.8);
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

function update(this: Phaser.Scene, time: number, delta: number): void {  

    if (time > nextEnemy)
    {
        const enemy = enemies.get();
        if (enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath();

            nextEnemy = time + 2000;
        }       
    }
}

function canPlaceTurret(i: number, j: number): boolean {
    return map[i][j] === 0;
}

function placeTurret(pointer: Phaser.Input.Pointer): void {
    const i = Math.floor(pointer.y/64);
    const j = Math.floor(pointer.x/64);
    if(canPlaceTurret(i, j)) {
        const turret = turrets.get();
        if (turret)
        {
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
        }   
    }
}

function addBullet(x: number, y: number, angle: number): void {
    const bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y, angle);
    }
}
  

  


export default game//new Phaser.Game(config)

// import Phaser from 'phaser'

// import HelloWorldScene from './HelloWorldScene'

// const config: Phaser.Types.Core.GameConfig = {
// 	type: Phaser.AUTO,
// 	parent: 'content',
// 	width: 640,
// 	height: 512,
// 	physics: {
// 		default: 'arcade'
// 	},
// 	scene: [HelloWorldScene]
// }

// export default new Phaser.Game(config)