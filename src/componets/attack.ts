import { CollisionGroup } from "../scenes/GameScene";
import { CanDie, Enemy } from "./GameObject";
import Scene = Phaser.Scene
import Sprite = Phaser.Physics.Matter.Sprite;
import Bodies = Phaser.Physics.Matter.Matter.Bodies;
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