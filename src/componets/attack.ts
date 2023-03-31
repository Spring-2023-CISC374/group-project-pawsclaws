import { CollisionGroup } from "../scenes/GameScene";
import { CanDie, Enemy } from "./GameObject";
import Scene = Phaser.Scene
import Sprite = Phaser.Physics.Matter.Sprite;
import Bodies = Phaser.Physics.Matter.Matter.Bodies
import Vector2 = Phaser.Math.Vector2;

export interface Attack extends CanDie {
    attackParams: AttackParams
    destroy: () => void
    getSprite: () => Sprite
    setAngle: (angle: number) => void
    clone: (pos, dir, angle) => Attack
    onCollide: () => void
}

export type AttackParams = {
    scale: { x: number, y: number },
    damage: number,
    frictionAir: number,
    mass: number
}

export default abstract class RegularAttack implements Attack {

    protected scene: Scene
    protected sprite: Sprite
    private collided: boolean

    public attackParams: AttackParams

    constructor(scene, {x, y}, {dirX, dirY}, attackParams) {
        this.scene = scene
        this.attackParams = attackParams
        const {scale: {x: scaleX, y: scaleY}} = attackParams
        const sprite = this.scene.matter.add
            .sprite(x, y, 'small_bullet')
        sprite.setExistingBody(Bodies.rectangle(x, y, sprite.width, sprite.height, {chamfer: {radius: 20}}))
            .setScale(scaleX, scaleY)
            .setVelocity(dirX * 30, -dirY * 30)
            .setMass(attackParams.mass)
            .setFrictionAir(attackParams.frictionAir)
            .setCollisionGroup(CollisionGroup.ATTACK)
        this.sprite = sprite
        this.scene.matterCollision.addOnCollideStart({
            objectA: this.sprite,
            context: this,
            callback: () => {
                this.collided = true
            }
        })
    }

    // TODO: No better way to structure hierarchie?
    clone(pos, dir, angle){
        return {} as any
    }

    getSprite() {
        return this.sprite
    }

    getXY() {
        return {
            x: this.sprite.x,
            y: this.sprite.y
        }
    }

    getVelXY() {
        return {
            velX: (this.sprite.body as MatterJS.Body).velocity.x,
            velY: (this.sprite.body as MatterJS.Body).velocity.y
        }
    }

    setAngle(angle){
        this.sprite.setAngle(angle)
        return this
    }

    isDead() {
        return this.collided
    }

    destroy() {
        this.sprite.destroy()
    }

    update(delta) {
        if(Math.abs((this.sprite.body as MatterJS.Body).velocity.x) <= 0.001 && Math.abs((this.sprite.body as MatterJS.Body).velocity.x) <= 0.001){
            this.collided = true
        }
    }

    onCollide(){

    }
}

