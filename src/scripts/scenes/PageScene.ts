import Phaser, { LEFT } from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { ScrollablePanel, TabPages, Sizer, Tweaker} from 'phaser3-rex-plugins/templates/ui/ui-components'

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class PageScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    tabPages!: TabPages; 
    editMenuSizer!: Sizer;
    numberOfUnits: integer = 0;
    unitName!: String;
    maxNumOfUnits = 5;
    username: string = '';

    constructor ()
    {
        super({ key: 'PageScene', active: true });
    }

    preload ()
    {
       this.load.html("UnitEditor", "assets/html/UnitEditor.html")
    }

    create ()
    {
        this.tabPages = this.rexUI.add.tabPages({
            x: 400, y: 400,
            width: 500, height: 700,
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

        this.CreateEditMenuSizer();
        this.tabPages
            .addPage({
                key: 'Edit',
                tab: this.CreateLabel(this, 'Edit'),
                page: this.CreateScollablePanel(this)
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
    }

    update () 
    {
        while(this.numberOfUnits < this.maxNumOfUnits){
            this.AddEditMenuChild(this);
        }
    }
//___________________________________________________________________________________________________
    // Used to create tab buttons at the top (PULL FROM EXAMPLE) !!!KEEP!!!
    CreateLabel(scene, text) {
        return scene.rexUI.add.label({
        width: 40, height: 40,
        
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
        text: scene.add.text(0, 0, text, { fontSize: 24 }),
        
        space: { left: 10, right: 10, top: 10, bottom: 10 }
        })
    }

    // Used to create default page to use as placeholder (things bug out when child spot is empty)
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

//___________________________________________________________________________________________________
    // Bryan's Function to add sizer define to variable (needed to dynamically add to page)
    CreateEditMenuSizer(){
        this.editMenuSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        })
        .layout()
    }
    
    AddEditMenuChild(scene){
        var name;
        var horizontal;
        var vertical;
        var size;
        var classType;

        this.numberOfUnits++;
        var title = this.CreateLabel(this,"Unit #" + this.numberOfUnits );
        var child = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 5 }
            
        });
        var nameLabel = this.add.text(0,0,'Name:').setFontSize(20);
        var nameField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT),
            text: this.rexUI.add.BBCodeText(0, 0, this.username, { fixedWidth: 300, fixedHeight: 36, halign: 'left' }),
            space: { top: 5, bottom: 5, left: 5, right: 5, }
        })
            .setInteractive()
            .on('pointerdown', function () {
                scene.rexUI.edit(nameField.getElement('text'));
            });
        var horizLabel = this.add.text(0,0,'Horizontal Position:').setFontSize(20);
        var horizField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT),
            text: this.rexUI.add.BBCodeText(0, 0, this.username, { fixedWidth: 300, fixedHeight: 36, halign: 'left' }),
            space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
        })
            .setInteractive()
            .on('pointerdown', function () {
                scene.rexUI.edit(horizField.getElement('text'));
            });
        var vertLabel = this.add.text(0,0,'Vertical Position:').setFontSize(20);
        var vertField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT),
            text: this.rexUI.add.BBCodeText(0, 0, this.username, { fixedWidth: 300, fixedHeight: 36, halign: 'left' }),
            space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
        })
            .setInteractive()
            .on('pointerdown', function () {
                scene.rexUI.edit(vertField.getElement('text'));
            });
        var classOptions = [
            { text: 'Fire', value: 'fire' },
            { text: 'Ice', value: 'ice' },
            { text: 'Poison', value: 'poison' },
            { text: 'Lightning', value: 'lightning' },
        ]
        var classLabel = this.add.text(0,0,'Class Type: (5 gp to Unlock)').setFontSize(20);
        var sizeLabel = this.add.text(0,0,'Size:').setFontSize(20);
        
        var sizeField = this.rexUI.add.buttons({
            x: 400, y: 400,

            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_PRIMARY),
            buttons: [
                this.createButton(this, 'Small').setOrigin(0.5, 1),
                this.createButton(this, 'Medium').setOrigin(0.5, 1),
                this.createButton(this, 'Large').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }

        })
            .setOrigin(0.5, 1)
            .layout()

        sizeField.getElement('buttons').forEach(function (button) {
            button.popUp(1000, undefined, 'Back');
        })

        sizeField
            .on('button.click', function (button, index, pointer, event) {
                button.scaleYoyo(500, 1.2);
            })

        var classField = this.rexUI.add.buttons({
            x: 400, y: 400,

            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_PRIMARY),
            buttons: [
                this.createButton(this, 'Fire').setOrigin(0.5, 1),
                this.createButton(this, 'Ice').setOrigin(0.5, 1),
                this.createButton(this, 'Poison').setOrigin(0.5, 1),
                this.createButton(this, 'Lightning').setOrigin(0.5, 1)
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }

        })
            .setOrigin(0.5, 1)
            .layout()

        classField.getElement('buttons').forEach(function (button) {
            button.popUp(1000, undefined, 'Back');
        })

        classField
            .on('button.click', function (button, index, pointer, event) {
                button.scaleYoyo(500, 1.2);
            })

        child.add(nameLabel, {
            align: "left"
        });
        child.add(nameField, {
            align: "left"
        });
        child.add(horizLabel, {
            align: "left"
        });
        child.add(horizField, {
            align: "left"
        });
        child.add(vertLabel, {
            align: "left"
        });
        child.add(vertField, {
            align: "left"
        });
        child.add(sizeLabel, {
            align: "left"
        });
        child.add(sizeField, {
            align: "left"
        })
        child.add(classLabel, {
            align: "left"
        });
        child.add(classField, {
            align: "left"
        })
        

        var background = this.rexUI.add.roundRectangle(0, 0, 0, 0, 0).setStrokeStyle(2, COLOR_LIGHT);
        var editor = this.rexUI.add.folder({
            background: background,

            title: title,
            child: child,
    
            transition: {
                // duration: 200,
            },
    
            expand: {
                title: false,
                child: true,
            },
    
            space: {
                left: 10, right: 10, top: 10, bottom: 10, item: 3
            },
        }).collapse(0);
        editor.setMinWidth(430)
        this.editMenuSizer.add(editor).layout();
    }

    createButton(scene, text) {
        return scene.rexUI.add.label({
            width: 60,
            height: 60,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
            text: scene.add.text(0, 0, text, {
                fontSize: 18
            }),
            align: 'center',
            space: {
                left: 10,
                right: 10,
            }
        });
    }

    CreateScollablePanel(scene) {
        return scene.rexUI.add.scrollablePanel({
            x: 400,
            y: 300,
            height: 300,

            scrollMode: 'y',

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: this.editMenuSizer,

                mask: {
                    padding: 1,
                },
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
            },

            scroller: {
                // pointerOutRelease: false,
            },

            mouseWheelScroller: {
                focus: false,
                speed: 2
            },

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
                // slider: { left: 30, right: 30 },
            }
        })
        .layout();
    }
}