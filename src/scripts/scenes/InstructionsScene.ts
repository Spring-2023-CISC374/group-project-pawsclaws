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
        var content = //Paws and Claws is a simple and easy to learn tower defense game. 

// 
`
Gameplay:

1. Buy your first character by selecting it from the menu and placing it on the map.
2. Press the "Start" button to begin the game.
3. Balloons will spawn in waves, with more balloons spawning as the waves increase.
4. Place additional characters on the map by selecting them from the menu and placing them strategically to stop the balloons.
5. Characters have different abilities and prices, so choose wisely.
6. Earn money by popping balloons. Use this money to buy more characters or upgrade existing ones.
7. If a balloon reaches the end of its path, you lose a life. You start with a limited number of lives, so be careful!
8. If you lose all your lives, the game is over.

Upgrades:

1. Click on a character to see its upgrade options.
2. Upgrades improve the character's abilities and make them more effective against balloons.
3. Upgrades cost money, so make sure to save up before purchasing them.

Tips:

1. Experiment with different character combinations to find the most effective defense.
2. Don't forget to upgrade your characters for maximum effectiveness.
3. Keep an eye on your lives and don't let too many balloons slip by.

Good luck defending your territory!`;

        var instructionsBox = this.createTextBox(this, 40, 40, {
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 590,
        })
        .start(content, 50);

        //close button, right now just a big red x
        var closeBtn = this.add.text(600, 40 + 10, "X")
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
                    left: 10,
                    right: 10,
                    top: 10,
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
    
            fontSize: '15px',
            wrap: {
                mode: 'word',
                width: wrapWidth
            },
            maxLines: 100
        })
    }
    
}