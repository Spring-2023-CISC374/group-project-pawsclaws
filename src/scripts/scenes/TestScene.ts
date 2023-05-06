import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ScrollablePanel } from 'phaser3-rex-plugins/templates/ui/ui-components'
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class TestScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    panel!: ScrollablePanel;

    constructor ()
    {
        super({ key: 'TestScene', active: true });
    }

    create() {
        this.panel = this.rexUI.add.scrollablePanel({
            x: 400, y: 300,
            width: 600,

            scrollMode: 1,

            panel: {
                child: this.CreatePanel(this),
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },
        })
            .layout()     
    }

    update() { 
        // this.panel
        //     .getElement('panel')
        //     .add(
        //         this.CreatePaper(this,
        //             'GGGG',
        //             this.rexUI.add.roundRectangle(0, 0, 200, 400, 20, COLOR_PRIMARY))
        //     )
        // this.panel.layout()
    }

    CreatePanel (scene: any) {
        var panel = scene.rexUI.add.sizer({
            orientation: 'x',
            space: { item: 50, top: 20, bottom: 20 }
        })
        
        //Adding of Default Values for the Menu (Probably Don't Need)
        var contentList = ['AAAA', 'BBBB', 'CCCC', 'DDDDD', 'EEEEE', 'FFFFF'];
        for (var i = 0, cnt = contentList.length; i < cnt; i++) {
            panel
                .add(
                    this.CreatePaper(scene,
                        contentList[i],
                        scene.rexUI.add.roundRectangle(0, 0, 200, 400, 20, COLOR_PRIMARY))
                )
        }
    
        return panel;
    }

    CreatePaper(scene: any, content: any, background: any) {
        return scene.rexUI.add.label({
            orientation: 'y',
            width: background.displayWidth,
            height: background.displayHeight,
    
            background: background,
            text: scene.add.text(0, 0, content),
    
            align: 'center'
        })
    }
}





