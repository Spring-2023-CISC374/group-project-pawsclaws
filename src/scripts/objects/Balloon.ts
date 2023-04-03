import Phaser from 'phaser'
//Creating default class for our 'Units' with set values and methods
//Based off CodeWarrior

export class Balloon extends Phaser.Physics.Arcade.Sprite{
    constructor(scene: Phaser.Scene, x: number, y:number, config: BalloonConfig){
        super(scene,x,y,config.imageKey)
    }
}

export type BalloonConfig = {
    color: string,
    imageKey: string,
    moveSpeed: number,
    health: number,
    size: number,
    xPos: number,
    yPos: number,
    createsMore: boolean
}