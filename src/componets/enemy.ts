import { CollisionGroup, default as HelloWorldScene } from '../scenes/mainScene';

const PURPLE_SPEED = 1 / 7500;
const GREEN_SPEED = 1 / 8500;
const BLUE_SPEED = 1 / 10000;
const RED_SPEED = 1 / 12000;

export class Enemy extends Phaser.GameObjects.Image {
	onFire = false;
	frozen = false;
	frozenTimer = 0;
	fireTimer = 0;
	frozenMax = 40;
	fireMax = 200;
	gotblue: boolean;
	gotgreen: boolean;
	gotpurple: boolean;
	follower = { t: 0, vec: new Phaser.Math.Vector2() };
	hp = 0;
	path: Phaser.Curves.Path;
	timeOnPath = 0;
	gameScene: Phaser.Scene;

	constructor(scene: HelloWorldScene) {
		var scenePath = scene.path
		super(scene, 0, 0, 'sprites', 'enemy');
		this.path = scenePath
		this.fireTimer = 0;
		this.gameScene = scene;
		this.gotblue = false;
		this.gotgreen = false;
		this.gotpurple = false;
	}

	startOnPath() {
		this.follower.t = 0;
		this.hp = 200;
		this.timeOnPath = 0;
		
		this.path.getPoint(this.follower.t, this.follower.vec);

		this.setPosition(this.follower.vec.x, this.follower.vec.y);
	}

	getHp(){
		return this.hp;
	}

	receiveDamage(damage: number, gameScene: any, fireShot: boolean, iceShot: boolean) {
		//console.log(damage)
		//console.log(this.hp)
		this.hp -= damage;
		//console.log(this.hp)

		if(fireShot && this.onFire == false){
			this.onFire = true;
		}

		if(iceShot && this.frozen == false){
			this.frozen = true;
		}

		
		if(this.hp > 100){ //green
			if(!this.gotpurple){
				this.gotpurple = true;
				gameScene.money += 2;
			}
		}
		else if(this.hp > 50){ //blue
			if(!this.gotgreen){
				this.gotgreen = true;
				gameScene.money += 2;
			}
		}
		else{ //red
			if(!this.gotblue){
				this.gotblue = true;
				gameScene.money += 2;
			}
		}

		
		
		// if hp drops below 0 we deactivate this enemy
		if (this.hp <= 0) {
			this.setActive(false);
			this.setVisible(false);
			this.destroy();
			gameScene.money += 5;
			
		}
	}

	update(time: number, delta: number) {
		if (this.frozen == false){
			if(this.hp > 150){ //purple
				this.follower.t += PURPLE_SPEED * delta;
			}
			else if(this.hp > 100){ //green
				this.follower.t += GREEN_SPEED * delta;
			}
			else if(this.hp > 50){ //blue
				this.follower.t += BLUE_SPEED * delta;
			}
			else{ //red
				this.follower.t += RED_SPEED * delta;
			}
		}
		else if (this.frozenTimer >= this.frozenMax){
			this.frozen = false;
			this.frozenTimer = 0;
			this.clearTint();
		}
		else if(this.frozen == true){
			this.frozenTimer++;
			this.setTint(Phaser.Display.Color.GetColor(130, 160, 230));
		}

		if(this.onFire == true && this.fireTimer % 25 < 5 && this.fireTimer < this.fireMax){
			this.fireTimer++;
			this.receiveDamage(2,this.gameScene,false,false)
			console.log(this.hp);
			this.setTintFill(Phaser.Display.Color.GetColor(255, 165, 0))
		}
		else if (this.fireTimer >= this.fireMax){
			this.onFire = false;
			this.fireTimer = 0;
			console.log("done");
			this.clearTint();
		}
		else if(this.onFire == true){
			this.fireTimer++;
			this.clearTint();
		}

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
