import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { TabPages, Sizer, } from 'phaser3-rex-plugins/templates/ui/ui-components'
import Drag from 'phaser3-rex-plugins/plugins/drag.js';
import eventsCenter from "../../EventsCenter";
import InputText from 'phaser3-rex-plugins/plugins/inputtext.js';
import { Rectangle } from "phaser3-rex-plugins/plugins/gameobjects/shape/shapes/geoms";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class PageScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    tabPages!: TabPages;

    editMenuSizer!: Sizer;
    buyMenuSizer!: Sizer;
    upgradeMenuSizer!: Sizer;
    
    numberOfUnits = 0;
    maxNumOfUnits = 5;
    placedTowers: any;

    constructor ()
    {
        super({ key: 'PageScene', active: false });
    }

    init()
    {
        this.numberOfUnits = 0;
    }

    preload ()
    {
       this.load.html("UnitEditor", "assets/html/UnitEditor.html")
       this.load.image('buff', '/assets/buff_doge.png')
       this.load.image('cowboy', '/assets/cowboy_cat.png')
    }

    create ()
    {
        this.tabPages = this.rexUI.add.tabPages({
            x: 1028, y: 359,
            width: 500, height: 720,
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
        
            tabs: {
                space: { item: 3 }
            },
        
            align: {
                tabs: 'center'
            },
        
            space: { left: 5, right: 5, top: 5, bottom: 5, item: 10 }
        
        })

        this.CreateSizers();

        this.tabPages
            .addPage({
                key: 'Edit',
                tab: this.CreateLabel(this, 'Edit'),
                page: this.CreateScrollablePanel(this, this.editMenuSizer)
            })
            .addPage({
                key: 'Buy',
                tab: this.CreateLabel(this, 'Buy'),
                page: this.CreateScrollablePanel(this, this.buyMenuSizer)
            })
            .addPage({
                key: 'Upgrade',
                tab: this.CreateLabel(this, 'Upgrade'),
                page: this.CreateScrollablePanel(this, this.upgradeMenuSizer)
            })
            .layout()
            .swapFirstPage()

        this.AddBuyMenuChild();
        this.AddUpgradeMenuChild();
        this.placedTowers = this.physics.add.group({ runChildUpdate: true });

        eventsCenter.on("tower-placed-successfully", (turret: any, texture: any) => {
            console.log("in event for edit menu")
            console.log(turret)
            this.AddEditMenuChild(this, turret, texture)
            this.placedTowers.add(turret)
        })
    }

    update () 
    {
        // while(this.numberOfUnits < this.maxNumOfUnits){
        //     this.AddEditMenuChild(this);
        // }
    }
    
    // Currently being called at the end of the create function (keep if you want the content to be static)
    AddBuyMenuChild() {
        var text = this.CreateLabel(this, 'cost: 125')
        var text2 = this.CreateLabel(this, 'cost: 150')
        var cowboy = this.add.image(0,0, 'cowboy').setScale(0.1)
        var buff = this.add.image(0,0, 'buff').setScale(0.1)
        var background_cowboy = this.add.image(cowboy.x,cowboy.y, 'cowboy').setScale(0.1).setVisible(false)
        var background_buff = this.add.image(buff.x,buff.y, 'buff').setScale(0.1).setVisible(false)
        var draggable_cowboy = new Drag(cowboy)
        var draggable_buff = new Drag(buff)
        cowboy.setInteractive()
        buff.setInteractive()

        // Cowboy Cat Unit
        cowboy.on('dragstart', (pointer: any) => {
            // make the background cowboy appear
            background_cowboy.x = cowboy.x
            background_cowboy.y = cowboy.y
            background_cowboy.setVisible(true)

            // make the draggable cowboy smaller so its easier to place
            cowboy.setScale(0.04)
            // set the draggable cowboy x and y to wherever the mouse is
            cowboy.x = pointer.x
            cowboy.y = pointer.y 
        })
        // updates the cowboys x and y when being dragged
        cowboy.on('drag', (pointer: any) => {
            cowboy.x = pointer.x
            cowboy.y = pointer.y 
        })
        cowboy.on('dragend', (pointer: any) => {
            // set the scale of the cowboy back to 0.1 for the shop
            // set the cowboy x and y to the background cowboy x and y
            cowboy.setScale(0.1)
            cowboy.x = background_cowboy.x
            cowboy.y = background_cowboy.y

            // make the background cowboy disappear
            background_cowboy.setVisible(false)

            var cowboy_text = "cowboy"
            eventsCenter.emit("tower-place?", cowboy_text)
        })
        this.buyMenuSizer.add(text).layout();
        this.buyMenuSizer.add(cowboy).layout();

        // Buff Doge Unit
        buff.on('dragstart', (pointer: any) => {
            // make the background cowboy appear
            background_buff.x = buff.x
            background_buff.y = buff.y
            background_buff.setVisible(true)

            // make the draggable buff smaller so its easier to place
            buff.setScale(0.04)
            // set the draggable buff x and y to wherever the mouse is
            buff.x = pointer.x
            buff.y = pointer.y 
        })
        // updates the buffs x and y when being dragged
        buff.on('drag', (pointer: any) => {
            buff.x = pointer.x
            buff.y = pointer.y 
        })
        buff.on('dragend', (pointer: any) => {
            // set the scale of the buff back to 0.1 for the shop
            // set the buff x and y to the background buff x and y
            buff.setScale(0.1)
            buff.x = background_buff.x
            buff.y = background_buff.y

            // make the background buff disappear
            background_buff.setVisible(false)

            var buff_text = "buff"
            eventsCenter.emit("tower-place?", buff_text)
        })
        this.buyMenuSizer.add(text2).layout();
        this.buyMenuSizer.add(buff).layout();
    }



    AddUpgradeMenuChild(){
        var fireClassLabel = this.CreateLabel(this, 'Fire Class:')
        var burnDurationSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var burnDurationLabel = this.add.text(0,0,'BURN DURATION: 2 sec').setFontSize(20);
        burnDurationSizer.add(burnDurationLabel);
        burnDurationSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        burnDurationSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));

        var burnDamageSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var burnDamageLabel = this.add.text(0,0,'BURN DAMAGE: 10 dmg/sec').setFontSize(20);
        burnDamageSizer.add(burnDamageLabel);
        burnDamageSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        burnDamageSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));

        var iceClassLabel = this.CreateLabel(this, 'Ice Class:')
        var frozenDurationSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var frozenDurationLabel = this.add.text(0,0,'FROZEN DURATION: 2 sec').setFontSize(20);
        frozenDurationSizer.add(frozenDurationLabel);
        frozenDurationSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        frozenDurationSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));

        var lightningClassLabel = this.CreateLabel(this, 'Lightning Class:')
        var lightningAdditionTargetsSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var additionalTargetLabel = this.add.text(0,0,'ADDITIONAL TARGETS: 1').setFontSize(20);
        lightningAdditionTargetsSizer.add(additionalTargetLabel);
        lightningAdditionTargetsSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        lightningAdditionTargetsSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));

        var lightningDamageSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var lightningDamageLabel = this.add.text(0,0,'SHOCK DAMAGE: 10 dmg').setFontSize(20);
        lightningDamageSizer.add(lightningDamageLabel);
        lightningDamageSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        lightningDamageSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));

        var acidClassLabel = this.CreateLabel(this, 'Acid Class:')
        var puddleDurationSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var puddleDurationLabel = this.add.text(0,0,'PUDDLE DURATION: 2 sec').setFontSize(20);
        puddleDurationSizer.add(puddleDurationLabel);
        puddleDurationSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        puddleDurationSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));

        var acidDamageSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x',
        }).layout();
        var acidDamageLabel = this.add.text(0,0,'ACID DAMAGE: 10 dmg/sec').setFontSize(20);
        acidDamageSizer.add(acidDamageLabel);
        acidDamageSizer.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '+').setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
        })).layout;
        acidDamageSizer.add(this.add.text(0,0,'20 gp').setFontSize(20));
    
        this.upgradeMenuSizer.add(fireClassLabel, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(burnDurationSizer, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(burnDamageSizer, {
            align: "left"
        }).layout();

        this.upgradeMenuSizer.add(iceClassLabel, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(frozenDurationSizer, {
            align: "left"
        }).layout();

        this.upgradeMenuSizer.add(lightningClassLabel, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(lightningAdditionTargetsSizer, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(lightningDamageSizer, {
            align: "left"
        }).layout();

        this.upgradeMenuSizer.add(acidClassLabel, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(puddleDurationSizer, {
            align: "left"
        }).layout();
        this.upgradeMenuSizer.add(acidDamageSizer, {
            align: "left"
        }).layout();
    }

    AddEditMenuChild(scene: any, turret: any, texture: string){
        var name: string;
        var horizontal: string;
        var vertical: string;
        var size: string;
        var classType: string;
        var unitNumber: integer;
        var unitType: string;
        
        //Get unit number
        this.numberOfUnits++;
        unitNumber = this.numberOfUnits;

        //
        unitType = texture;

        var title = this.CreateLabel(this,"Unit #" + unitNumber + ": (" + unitType + ")");
        title.setMinWidth(400);
        var child = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 10 }
            
        });
        var nameLabel = this.add.text(0,0,'Name:').setFontSize(20);
        var nameField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(3, COLOR_LIGHT),
            text: this.rexUI.add.BBCodeText(0, 0,'', { fixedWidth: 300, fixedHeight: 18, halign: 'left' }),
            space: { top: 5, bottom: 5, left: 5, right: 5, }
        })
            .setInteractive()
            .on('pointerdown', function () {
                var config = {
                    onTextChanged: function(textObject: any, text: any) {
                        name = text;
                        textObject.text = text;
                        console.log(name);
                        title.text = "Unit #" + unitNumber + ": " + name.substring(0,8) + " (" + unitType + ")";
                        title.layout();
                        editor.layout();
                    }
                }
                scene.rexUI.edit(nameField.getElement('text'), config);
            });
            

        // var inputText = new InputText(this, 100, 100, 300, 100, {
        //     type: 'number',
        //     text: turret.x as string,
        //     fontSize: '40px'

        // })
        // .on('textchange', () => {
        //     var newCord = Math.floor((inputText.text as unknown as number) / 64)
        //     if(newCord < 10 && newCord >= 0) {
        //         turret.x = newCord * 64 + 64 / 2
        //         turret.x = inputText.text as unknown as number
        //         console.log(newCord)
        //         console.log(turret.x)
        //     }
        // })
        // var isFocused = inputText.isFocused
        // this.add.existing(inputText);
        // var printText = this.add.text(400, 200, '', {
        //     fontSize: '12px',
        //     fixedWidth: 100,
        //     fixedHeight: 100,
        // }).setOrigin(0.5);
        // scene.add.rexInputText
        // this.scene.add.rexInputText()
        // var inputText = scene.add.rexInputText(400, 400, 10, 10, {
        //     id: 'myNumberInput',
        //     type: 'number',
        //     text: '0',
        //     fontSize: '12px',
        // })
        // .resize(100, 100)
        // .setOrigin(0.5)
        // .on('textchange', function (inputText: any) {
        //     printText.text = inputText.text;
        // })

        
        // HORIZONTAL PLACEMENT UI
        var horizLabel = this.add.text(0,0,'Horizontal Position:').setFontSize(20);
        var horizField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(3, COLOR_LIGHT),
            text: this.rexUI.add.BBCodeText(0, 0, '', { fixedWidth: 300, fixedHeight: 18, halign: 'left' }),
            space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, },
        })
        .setInteractive().setText(turret.x)
        .on('pointerdown', function () {
            var config = {
                onTextChanged: function(textObject: any, text: any) {
                    var newCord = Math.floor((text as unknown as number) / 64)
                    if(newCord < 10 && newCord >= 0) {
                        turret.x = newCord * 64 + 64 / 2
                        console.log(newCord)
                        console.log(turret.x)
                        textObject.text = text;
                    }
                    textObject.text = turret.x
                }
            }
            scene.rexUI.edit(horizField.getElement('text'), config);
        });
        
        // VERTICAL PLACEMENT UI
        var vertLabel = this.add.text(0,0,'Vertical Position:').setFontSize(20);
        var vertField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(3, COLOR_LIGHT),
            text: this.rexUI.add.BBCodeText(0, 0, '', { fixedWidth: 300, fixedHeight: 18, halign: 'left' }),
            space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
        })
        .setInteractive()
        .on('pointerdown', function () {
            var config = {
                onTextChanged: function(textObject: any, text: any) {
                    vertical = text;
                    textObject.text = text;
                    console.log(vertical);
                }
            }
            scene.rexUI.edit(vertField.getElement('text'),config);
        });
        
        // // SIZE UI
        // var sizeLabel = this.add.text(0,0,'Size:').setFontSize(20);
        // var sizeField = this.rexUI.add.buttons({
        //     x: 400, y: 400,
        //     orientation: 'x',
        //     buttons: [
        //         this.createButton(this, 'Small').setOrigin(0.5, 1),
        //         this.createButton(this, 'Medium').setOrigin(0.5, 1),
        //         this.createButton(this, 'Large').setOrigin(0.5, 1),
        //     ],

        //     space: {
        //         left: 10, right: 10, top: 10, bottom: 10,
        //         item: 6
        //     }
        // })
        // .setOrigin(0.5, 1)
        // .layout()

        // sizeField
        //     .on('button.click', function (button, index, pointer, event) {
        //         button.scaleYoyo(500, 1.2);
        //         size = button.text;
        //         sizeLabel.text = 'Size: ' + size;
        //         console.log(size);
        //     })

        // CLASS TYPE UI
        var classLabel = this.add.text(0,0,'Class Type: (5 gp to Unlock)').setFontSize(20);
        var classField = this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
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

        classField
            .on('button.click', function (button: any, index: any, pointer: any, event: any) {
                button.scaleYoyo(500, 1.2);
                classType = button.text;
                classLabel.text = 'Class: ' + classType;
                turret.setClassTypes(classType)
                console.log(classType);
            })
        
        // ADDING ALL COMPONENTS TO FOLDER SIZER
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
        // child.add(sizeLabel, {
        //     align: "left"
        // });
        // child.add(sizeField, {
        //     align: "left"
        // })
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
        this.tabPages.layout();
    }

    CreateLabel(scene: any, text: any) {
        return scene.rexUI.add.label({
        width: 40, height: 40,
        
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 5, COLOR_LIGHT),
        text: scene.add.text(0, 0, text, { fontSize: 20 }),
        
        space: { left: 10, right: 10, top: 10, bottom: 10 }
        })
    }

    // Function used often to create a button. Scene is always set to 'this' and 
    // text is set to what you want written on the button
    createButton(scene: any, text: any) {
        return scene.rexUI.add.label({
            width: 60,
            height: 30,
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

    // Function to create Scrollable Panel, needs a child sizer (basically just a container) to hold anything that
    // will be added. Function below is a basic setting of an empty sizer. Scene is alway set to 'this'. 
    // To add to child sizer after the fact, just have it as a variable and perform a .add().layout().
    CreateScrollablePanel(scene: any, childSizer: any) {
        
        return scene.rexUI.add.scrollablePanel({
            x: 400,
            y: 300,
            height: 300,

            scrollMode: 'y',

            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: childSizer,

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
            }
        })
        .layout();
    }

    // Used to set global sizer variables to a default empty sizer. Called in create method to due so.
    CreateSizers(){
        this.editMenuSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y',
        })
        .layout();

        this.buyMenuSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        })
        .layout();

        this.upgradeMenuSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        })
        .layout();
    }
}