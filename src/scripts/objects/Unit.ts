import Phaser from 'phaser'
//Creating default class for our 'Units' with set values and methods
//Based off CodeWarrior

export class Unit extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y:number, config: UnitConfig){
        super(scene,x,y,config.imageKey)
    }
}

export type UnitConfig = {
    name: string,
    attackSpeed: number,
    attackDamage: number,
    imageKey: string,
    xPos: number,
    yPos: number,
}