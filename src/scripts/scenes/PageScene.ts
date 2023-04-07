import Phaser, { Scene } from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ScrollablePanel, TabPages } from 'phaser3-rex-plugins/templates/ui/ui-components'
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class PageScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    tabPages!: TabPages; 

    constructor ()
    {
        super({ key: 'PageScene', active: true });
    }

    create ()
    {
        this.tabPages = this.rexUI.add.tabPages({
            x: 400, y: 300,
            width: 500, height: 400,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
        
            tabs: {
                space: { item: 3 }
            },
            pages: {
                fadeIn: 300
            },
        
            align: {
                tabs: 'center'
            },
        
            space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }
        
        })
            .on('tab.focus', function (tab, key) {
                tab.getElement('background').setStrokeStyle(2, COLOR_LIGHT);
            })
            .on('tab.blur', function (tab, key) {
                tab.getElement('background').setStrokeStyle();
            })
        
        this.tabPages
            .addPage({
                key: 'Edit',
                tab: this.CreateLabel(this, 'Edit'),
                page: this.CreatePage(this, 'Edit')
            })
            .addPage({
                key: 'Buy',
                tab: this.CreateLabel(this, 'Buy'),
                page: this.CreatePage(this, 'Buy')
            })
            .addPage({
                key: 'Upgrade',
                tab: this.CreateLabel(this, 'Upgrade'),
                page: this.CreatePage(this, 'Upgrade')
            })
            .layout()
            .swapFirstPage()
        
        // Remove page testing
        // tabPages.removePage('page2', true).layout();
    }

    CreateLabel(scene, text) {
        return scene.rexUI.add.label({
        width: 40, height: 40,
        
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
        text: scene.add.text(0, 0, text, { fontSize: 24 }),
        
        space: { left: 10, right: 10, top: 10, bottom: 10 }
        })
    }

    content = `Phaser is a fast, free, and fun open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. Games can be compiled to iOS, Android and native apps by using 3rd party tools. You can use JavaScript or TypeScript for development.`;
    CreatePage(scene, text) {
        return scene.rexUI.add.textArea({
            text: scene.rexUI.add.BBCodeText(0, 0, '', { fontSize: 24 }),
            slider: {
                track: scene.rexUI.add.roundRectangle(0, 0, 20, 0, 10, COLOR_PRIMARY),
                thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT)
            },

            content: `\
This is ${text}
....
${this.content}
....
[color=green]${this.content}[/color]
....
[color=cadetblue]${this.content}[/color]
....
[color=yellow]${this.content}[/color]\
`
        })
    }

    // CreatePanel(scene) {
    //     return scene.rexUI.add.
    // }
}