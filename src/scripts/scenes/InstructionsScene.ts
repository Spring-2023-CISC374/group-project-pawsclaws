import Phaser from "phaser";
import PopUp from 'phaser3-rex-plugins/plugins/popup.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class InstructionsScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;

    
    constructor ()
    {
    super("InstructionsScene");
    }

    preload ()
    {
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    }

    create ()
    {
        // first iteration of the instructions menu, looks decent
        var content = `Paws and Claws is a simple and easy to learn tower defense game. 

To get started, select a unit to buy in the shop to the right.

There are many different types of units to buy all with different stats.

Once bought, the unit is now placed on the map.

Now, click the "Edit" menu to the right and look for the unit and select it.

From here, you can change its position, size, and eventually class type.

Now that the unit is where you want it, its time to start.

The objective of the game is to not let the balloons reach the end of the the path.

As you progress, each wave will be more challenging than the previous.
This includes more balloons, different types of balloons, and more.

Select "Start Next Wave" and the first wave will begin.

Good luck!
`;

        var instructionsBox = this.createTextBox(this, 40, 200, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 200,
        })
        .start(content, 50);

        // close button, right now just a big red x
        var closeBtn = this.add.text(630, 200, "X")
        closeBtn.setStyle({fill: "#FF0000", fontSize: '50px'})
        closeBtn.setInteractive()

        closeBtn.on('pointerdown',  () => {
			console.log("clicked button")
            this.scene.sleep("InstructionsScene")
        }
        )
        

        
    }

    update () 
    {
        
    }

    createTextBox(scene, x, y, config) {
        var wrapWidth = Phaser.Utils.Objects.GetValue(config, 'wrapWidth', 0)
        var fixedWidth = Phaser.Utils.Objects.GetValue(config, 'fixedWidth', 0)
        var fixedHeight = Phaser.Utils.Objects.GetValue(config, 'fixedHeight', 0)
        
        var textBox = scene.rexUI.add.textBox({
                x: x,
                y: y,
    
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                    .setStrokeStyle(2, COLOR_LIGHT),
    
                icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),
    
                //text: this.getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
                text: this.getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),
    
                action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
    
                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                    icon: 10,
                    text: 10,
                }
            })
            .setOrigin(0)
            .layout();
    
        textBox
            .setInteractive()
            .on('pointerdown', function () {
                var icon = this.getElement('action').setVisible(false);
                this.resetChildVisibleState(icon);
                if (this.isTyping) {
                    this.stop(true);
                } else {
                    this.typeNextPage();
                }
            }, textBox)
            .on('pageend', function () {
                if (this.isLastPage) {
                    return;
                }
    
                var icon = this.getElement('action').setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30', // '+=100'
                    ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false
                });
            }, textBox)
        //.on('type', function () {
        //})
    
        return textBox;
    }
    
    getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight) {
        return scene.add.text(0, 0, '', {
                fontSize: '20px',
                wordWrap: {
                    width: wrapWidth
                },
                maxLines: 3
            })
            .setFixedSize(fixedWidth, fixedHeight);
    }
    
    getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight) {
        return scene.rexUI.add.BBCodeText(0, 0, '', {
            fixedWidth: fixedWidth,
            fixedHeight: fixedHeight,
    
            fontSize: '20px',
            wrap: {
                mode: 'word',
                width: wrapWidth
            },
            maxLines: 9
        })
    }
    
}