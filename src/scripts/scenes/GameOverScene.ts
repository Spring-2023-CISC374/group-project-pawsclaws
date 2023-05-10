import Phaser from "phaser";
import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import eventsCenter from "../../EventsCenter";

const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class GameOverScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    gameOverSizer!: Sizer;
    bestRound!: number;
    currRound!: number;

    init(data: any)
    {
        this.currRound = data.currRound
        this.bestRound = data.bestRound
    }
    
    constructor ()
    {
    super("GameOverScene");
    }

    preload ()
    {
        this.load.image("gameover", '/assets/gameover.png')
        this.load.image("reset", '/assets/reset.png')
    }

    create ()
    {

        this.gameOverSizer = this.rexUI.add.sizer(385, 300, 700, 430, {
            orientation: 'y',
            space:{top: 40}
        }).layout();
        this.gameOverSizer.addBackground(this.rexUI.add.roundRectangle(375, 300, 300, 300, 10, COLOR_LIGHT, 0.85).setStrokeStyle(5, COLOR_DARK)).layout()

        var gameOverText = this.add.image(0,0, "gameover").setScale(0.4)
        this.gameOverSizer.add(gameOverText, {align:'center-top'}).layout();


        var gridSizer = this.rexUI.add.gridSizer({
            column: 2,
            row: 1,

            columnProportions: 1,
        }).layout();
        var gridSizer2 = this.rexUI.add.gridSizer({
            column: 2,
            row: 1,

            columnProportions: 1,
        }).layout();

        var highestRound = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        highestRound.add(this.CreateLabel(this, 'Highest Round',25));

        var currentRound = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        currentRound.add(this.CreateLabel(this, 'Current Round',25));

        var highestRoundNum = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        highestRoundNum.add(this.CreateLabel(this, this.bestRound, 50));

        var currentRoundNum = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        currentRoundNum.add(this.CreateLabel(this, this.currRound, 50));

        gridSizer.add(highestRound, 0,0, 'center', {bottom: 5, right:20}).layout()
        gridSizer.add(currentRound, 1,0, 'center', {bottom: 5, left: 20}).layout()
        gridSizer2.add(highestRoundNum, 0,0, 'center', {left:200}).layout()
        gridSizer2.add(currentRoundNum, 1,0, 'center', {left:100}).layout()


        //gridSizer.add()
        this.gameOverSizer.add(gridSizer, {
            padding: {top:40, bottom: 20, left:20, right:20},
            align: "center-center"
        })
        this.gameOverSizer.add(gridSizer2, {
            padding: {bottom: 10, left:20, right:20},
            align: "center-center"
        })

        var resetButton = this.add.image(0,0, "reset").setScale(0.5)
        resetButton.setInteractive().on('pointerdown',  () => {
            eventsCenter.emit("Restart")
            //this.scene.sleep("InstructionsScene")
        }
        )

        this.gameOverSizer.add(resetButton, {
            padding: {top: 20}
        }).layout()
    }

    update () 
    {
        
    }

    CreateLabel(scene: any, text: any, fontSize: any) {
        return scene.rexUI.add.label({
        width: 40, height: 40,
        
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_LIGHT),
        text: scene.add.text(0, 0, text, { fontSize: fontSize }),
        
        space: { left: 10, right: 10, top: 10, bottom: 10 }
        })
    }
    
}