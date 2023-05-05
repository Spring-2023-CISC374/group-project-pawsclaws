import eventsCenter from '../EventsCenter';
import { CollisionGroup, default as HelloWorldScene } from '../scenes/mainScene';

const PURPLE_SPEED = 1 / 7500; //speed to complete at this color is 7.5 seconds
const GREEN_SPEED = 1 / 8500; //speed to complete at this color is 8.5 seconds
const BLUE_SPEED = 1 / 10000; //speed to complete at this color is 10 seconds
const RED_SPEED = 1 / 12000; //speed to complete at this color is 12 seconds
const MONEY_PER_POP = 5; 

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

		// Give Money on move from Purple to Green
		if(this.hp > 100){ 
			if(!this.gotpurple){
				this.gotpurple = true;
				gameScene.money += MONEY_PER_POP;
				eventsCenter.emit("popsound");
			}
		}
		else if(this.hp > 50){ //blue
			if(!this.gotgreen){
				this.gotgreen = true;
				gameScene.money += MONEY_PER_POP;
				eventsCenter.emit("popsound");
			}
		}
		else{ //red
			if(!this.gotblue){
				this.gotblue = true;
				gameScene.money += MONEY_PER_POP;
				eventsCenter.emit("popsound");
			}
		}

		
		
		// if hp drops below 0 we deactivate this enemy
		if (this.hp <= 0) {
			this.setActive(false);
			this.setVisible(false);
			this.destroy();
			gameScene.money += MONEY_PER_POP;
			eventsCenter.emit("popsound");
			
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
