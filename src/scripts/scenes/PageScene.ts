import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { TabPages, Sizer, GridSizer, BBCodeText} from 'phaser3-rex-plugins/templates/ui/ui-components'
import Drag from 'phaser3-rex-plugins/plugins/drag.js';
import eventsCenter from "../../EventsCenter";
import buff_doge from '/assets/buff_doge.png';
import cowboy_cat from '/assets/cowboy_cat.png';
import rootbeer_cat from '/assets/rootbeer_cat.png';
import bulldog from '/assets/bulldog.png';
import doguari from '/assets/dogurai.png';
import reaper_cat from '/assets/reaper_cat.png';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class PageScene extends Phaser.Scene {
    rexUI!: RexUIPlugin;
    tabPages!: TabPages;

    editMenuSizer!: Sizer;
    buyMenuSizer!: GridSizer;
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
       this.load.image('buffs', buff_doge)
       this.load.image('cowboys', cowboy_cat)
       this.load.image('bigms', rootbeer_cat)
       this.load.image('bulldogs', bulldog)
       this.load.image('dogurais', doguari)
       this.load.image('reapers', reaper_cat)
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
        
        }).setMinWidth(520);

        this.CreateSizers();

        this.tabPages
            .addPage({
                key: 'Buy',
                tab: this.CreateLabel(this, 'Buy'),
                page: this.CreateScrollablePanel(this, this.buyMenuSizer)
            })
            .addPage({
                key: 'Edit',
                tab: this.CreateLabel(this, 'Edit'),
                page: this.CreateScrollablePanel(this, this.editMenuSizer)
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
        var text = this.add.text(0,0, 'cost: 150')
        var text2 = this.add.text(0,0, 'cost: 175')
        var text3 = this.add.text(0,0, 'cost: 225')
        var text4 = this.add.text(0,0, 'cost: 275')
        var text5 = this.add.text(0,0, 'cost: 350')
        var text6 = this.add.text(0,0, 'cost: 375')
        var cowboys = this.add.image(0,0, 'cowboys').setScale(0.1)
        var buffs = this.add.image(0,0, 'buffs').setScale(0.1)
        var bigms = this.add.image(0,0,'bigms').setScale(0.1)
        var bulldogs = this.add.image(0,0,'bulldogs').setScale(0.1)
        var reapers = this.add.image(0,0,'reapers').setScale(0.1)
        var dogurais = this.add.image(0,0,'dogurais').setScale(0.1)
        var background_cowboys = this.add.image(cowboys.x,cowboys.y, 'cowboys').setScale(0.1).setVisible(false)
        var background_buffs = this.add.image(buffs.x,buffs.y, 'buffs').setScale(0.1).setVisible(false)
        var background_bigms = this.add.image(bigms.x,bigms.y,'bigms').setScale(0.1).setVisible(false)
        var background_bulldogs = this.add.image(bulldogs.x,bulldogs.y,'bulldogs').setScale(0.1).setVisible(false)
        var background_reapers = this.add.image(reapers.x,reapers.y,'reapers').setScale(0.1).setVisible(false)
        var background_dogurais = this.add.image(dogurais.x,dogurais.y,'dogurais').setScale(0.1).setVisible(false)
        new Drag(cowboys)
        new Drag(buffs)
        new Drag(bigms)
        new Drag(bulldogs)
        new Drag(reapers)
        new Drag(dogurais)
        cowboys.setInteractive()
        buffs.setInteractive()
        bigms.setInteractive()
        bulldogs.setInteractive()
        reapers.setInteractive()
        dogurais.setInteractive()

        // Long Range
        // var range_circle1 = this.add.circle(0, 0, 200, 0xff0000, 0.2).setVisible(false).setDepth(-1)
        // Meduim Range
        var range_circle2 = this.add.circle(0, 0, 200, 0xff0000, 0.2).setVisible(false).setDepth(-1)
        // Short Range
        var range_circle3 = this.add.circle(0, 0, 150, 0xff0000, 0.2).setVisible(false).setDepth(-1)

        // cowboys Cat Unit
        cowboys.on('dragstart', (pointer: any) => {
            range_circle2.x = pointer.x
            range_circle2.y = pointer.y
            range_circle2.setVisible(true)
            // make the background cowboys appear
            background_cowboys.x = cowboys.x
            background_cowboys.y = cowboys.y
            background_cowboys.setVisible(true)

            // make the draggable cowboys smaller so its easier to place
            cowboys.setScale(0.04).setDepth(1)
            // set the draggable cowboys x and y to wherever the mouse is
            cowboys.x = pointer.x
            cowboys.y = pointer.y 
        })
        // updates the cowboyss x and y when being dragged
        cowboys.on('drag', (pointer: any) => {
            range_circle2.x = pointer.x
            range_circle2.y = pointer.y
            eventsCenter.emit("canplace", pointer)
            eventsCenter.on("returnplace", (bool: any) => {
                if(!bool){
                    range_circle2.setFillStyle(0xff0000, 0.2)
                }
                else{
                    range_circle2.setFillStyle(0xDCDCDC, 0.2)
                }
            })

            cowboys.x = pointer.x
            cowboys.y = pointer.y 
        })
        cowboys.on('dragend', () => {
            range_circle2.setVisible(false)

            // set the scale of the cowboys back to 0.1 for the shop
            // set the cowboys x and y to the background cowboys x and y
            cowboys.setScale(0.1).setDepth(0)
            cowboys.x = background_cowboys.x
            cowboys.y = background_cowboys.y

            // make the background cowboys disappear
            background_cowboys.setVisible(false)
            
            //"cowboys"
            eventsCenter.emit("tower-place?", "cowboys", "bigbill")
        })

        // buffs Doge Unit
        buffs.on('dragstart', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            range_circle3.setVisible(true)

            // make the background cowboys appear
            background_buffs.x = buffs.x
            background_buffs.y = buffs.y
            background_buffs.setVisible(true)

            // make the draggable buffs smaller so its easier to place
            buffs.setScale(0.04).setDepth(1)
            // set the draggable buffs x and y to wherever the mouse is
            buffs.x = pointer.x
            buffs.y = pointer.y 
        })
        // updates the buffss x and y when being dragged
        buffs.on('drag', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            eventsCenter.emit("canplace", pointer)
            eventsCenter.on("returnplace", (bool: any) => {
                if(!bool){
                    range_circle3.setFillStyle(0xff0000, 0.2)
                }
                else{
                    range_circle3.setFillStyle(0xDCDCDC, 0.2)
                }
            })

            buffs.x = pointer.x
            buffs.y = pointer.y 
        })
        buffs.on('dragend', () => {
            range_circle3.setVisible(false)

            // set the scale of the buffs back to 0.1 for the shop
            // set the buffs x and y to the background buffs x and y
            buffs.setScale(0.1).setDepth(0)
            buffs.x = background_buffs.x
            buffs.y = background_buffs.y

            // make the background buffs disappear
            background_buffs.setVisible(false)

            //"buffs"
            eventsCenter.emit("tower-place?", "buffs", "fists")
        })

          // Big M Unit
          bigms.on('dragstart', (pointer: any) => {
            range_circle2.x = pointer.x
            range_circle2.y = pointer.y
            range_circle2.setVisible(true)

            // make the background Big M appear
            background_bigms.x = bigms.x
            background_bigms.y = bigms.y
            background_bigms.setVisible(true)

            // make the draggable Big M smaller so its easier to place
            bigms.setScale(0.04)
            // set the draggable Big M x and y to wherever the mouse is
            bigms.x = bigms.x
            bigms.y = bigms.y 
        })
        // updates the Big M x and y when being dragged
        bigms.on('drag', (pointer: any) => {
            range_circle2.x = pointer.x
            range_circle2.y = pointer.y
            eventsCenter.emit("canplace", pointer)
            eventsCenter.on("returnplace", (bool: any) => {
                if(!bool){
                    range_circle2.setFillStyle(0xff0000, 0.2)
                }
                else{
                    range_circle2.setFillStyle(0xDCDCDC, 0.2)
                }
            })

            bigms.x = pointer.x
            bigms.y = pointer.y 
        })
        bigms.on('dragend', () => {
            range_circle2.setVisible(false)

            // set the scale of the Big M back to 0.1 for the shop
            // set the Big M x and y to the background Big M x and y
            bigms.setScale(0.1)
            bigms.x = background_bigms.x
            bigms.y = background_bigms.y

            // make the background Big M disappear
            background_bigms.setVisible(false)

            var bigms_text = "bigms"
            eventsCenter.emit("tower-place?", bigms_text, "rootbeers")
        })

        // bulldogs Unit
        bulldogs.on('dragstart', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            range_circle3.setVisible(true)

            // make the background cowboys appear
            background_bulldogs.x = bulldogs.x
            background_bulldogs.y = bulldogs.y
            background_bulldogs.setVisible(true)

            // make the draggable bulldogs smaller so its easier to place
            bulldogs.setScale(0.04)
            // set the draggable bulldogs x and y to wherever the mouse is
            bulldogs.x = bulldogs.x
            bulldogs.y = bulldogs.y 
        })
        // updates the  bulldogs x and y when being dragged
        bulldogs.on('drag', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            eventsCenter.emit("canplace", pointer)
            eventsCenter.on("returnplace", (bool: any) => {
                if(!bool){
                    range_circle3.setFillStyle(0xff0000, 0.2)
                }
                else{
                    range_circle3.setFillStyle(0xDCDCDC, 0.2)
                }
            })

            bulldogs.x = pointer.x
            bulldogs.y = pointer.y 
        })
        bulldogs.on('dragend', () => {
            range_circle3.setVisible(false)

            // set the scale of the  bulldogs back to 0.1 for the shop
            // set the  bulldogs x and y to the background  bulldogs x and y
            bulldogs.setScale(0.1)
            bulldogs.x = background_bulldogs.x
            bulldogs.y = background_bulldogs.y

            // make the background  bulldogs disappear
            background_bulldogs.setVisible(false)

            var bulldogs_text = "bulldogs"
            eventsCenter.emit("tower-place?", bulldogs_text, "chomp")
        })

        reapers.on('dragstart', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            range_circle3.setVisible(true)

            // make the background cowboys appear
            background_reapers.x = reapers.x
            background_reapers.y = reapers.y
            background_reapers.setVisible(true)

            // make the draggable buffs smaller so its easier to place
            reapers.setScale(0.04).setDepth(1)
            // set the draggable buffs x and y to wherever the mouse is
            reapers.x = pointer.x
            reapers.y = pointer.y 
        })
        // updates the buffss x and y when being dragged
        reapers.on('drag', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            eventsCenter.emit("canplace", pointer)
            eventsCenter.on("returnplace", (bool: any) => {
                if(!bool){
                    range_circle3.setFillStyle(0xff0000, 0.2)
                }
                else{
                    range_circle3.setFillStyle(0xDCDCDC, 0.2)
                }
            })

            reapers.x = pointer.x
            reapers.y = pointer.y 
        })
        reapers.on('dragend', () => {
            range_circle3.setVisible(false)

            // set the scale of the buffs back to 0.1 for the shop
            // set the buffs x and y to the background buffs x and y
            reapers.setScale(0.1).setDepth(0)
            reapers.x = background_reapers.x
            reapers.y = background_reapers.y

            // make the background buffs disappear
            background_reapers.setVisible(false)

            //"still needs a attack"
            eventsCenter.emit("tower-place?", "reapers", "slash")
        })

        dogurais.on('dragstart', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            range_circle3.setVisible(true)

            // make the background cowboys appear
            background_dogurais.x = dogurais.x
            background_dogurais.y = dogurais.y
            background_dogurais.setVisible(true)

            // make the draggable buffs smaller so its easier to place
            dogurais.setScale(0.04).setDepth(1)
            // set the draggable buffs x and y to wherever the mouse is
            dogurais.x = pointer.x
            dogurais.y = pointer.y 
        })
        // updates the buffss x and y when being dragged
        dogurais.on('drag', (pointer: any) => {
            range_circle3.x = pointer.x
            range_circle3.y = pointer.y
            eventsCenter.emit("canplace", pointer)
            eventsCenter.on("returnplace", (bool: any) => {
                if(!bool){
                    range_circle3.setFillStyle(0xff0000, 0.2)
                }
                else{
                    range_circle3.setFillStyle(0xDCDCDC, 0.2)
                }
            })

            dogurais.x = pointer.x
            dogurais.y = pointer.y 
        })
        dogurais.on('dragend', () => {
            range_circle3.setVisible(false)

            // set the scale of the buffs back to 0.1 for the shop
            // set the buffs x and y to the background buffs x and y
            dogurais.setScale(0.1).setDepth(0)
            dogurais.x = background_dogurais.x
            dogurais.y = background_dogurais.y

            // make the background buffs disappear
            background_dogurais.setVisible(false)

            //"still needs a attack"
            eventsCenter.emit("tower-place?", "dogurais", "slash")
        })


        var cowboys_cat_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        cowboys_cat_title.add(this.CreateLabel(this, 'Cowboy Cat:'));
        cowboys_cat_title.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '↻', 22).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
            button.scaleYoyo(500, 1.2);
            cowboys_cat_card.toggleFace();
        }));

        var cowboys_cat_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        cowboys_cat_buy.add(text).layout();
        cowboys_cat_buy.add(cowboys).layout();

        var cowboys_cat_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        cowboys_cat_info.add(this.add.text(0,0,"\nAttack Speed: 5/10\n\nAttack Damage: 5/10\n\nRange: 6/10").setFontSize(17))

        var cowboys_cat_card = this.rexUI.add.perspectiveCard({
            front: cowboys_cat_buy,
            back: cowboys_cat_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var buffs_doge_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        }).setMinWidth(245);
        buffs_doge_title.add(this.CreateLabel(this, 'Buff Doge:'));
        buffs_doge_title.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '↻', 22).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
            button.scaleYoyo(500, 1.2);
            buffs_doge_card.toggleFace();
        }), {align: 'right'});
        var buffs_doge_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);;
        buffs_doge_buy.add(text2).layout();
        buffs_doge_buy.add(buffs).layout();

        var buffs_doge_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        buffs_doge_info.add(this.add.text(0,0,"\nAttack Speed: 5/10 \n\nAttack Damage: 7/10\n\nRange: 3/10").setFontSize(17));

        var buffs_doge_card = this.rexUI.add.perspectiveCard({
            front: buffs_doge_buy,
            back: buffs_doge_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var bigms_cat_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        bigms_cat_title.add(this.CreateLabel(this, 'RootBeer Cat:'));
        bigms_cat_title.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '↻', 22).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
            button.scaleYoyo(500, 1.3);
            bigms_cat_card.toggleFace();
        }));

        var bigms_cat_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        bigms_cat_buy.add(text3).layout();
        bigms_cat_buy.add(bigms).layout();

        var bigms_cat_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        bigms_cat_info.add(this.add.text(0,0,"\nAttack Speed: 3/10\n\nAttack Damage: 8/10\n\nRange: 6/10").setFontSize(17))

        var bigms_cat_card = this.rexUI.add.perspectiveCard({
            front: bigms_cat_buy,
            back: bigms_cat_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var bulldogs_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        bulldogs_title.add(this.CreateLabel(this, 'Bulldog Spike:'));
        bulldogs_title.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '↻', 22).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
            button.scaleYoyo(500, 1.4);
            bulldogs_card.toggleFace();
        }));

        var bulldogs_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        bulldogs_buy.add(text4).layout();
        bulldogs_buy.add(bulldogs).layout();

        var bulldogs_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        bulldogs_info.add(this.add.text(0,0,"\nAttack Speed: 7/10\n\nAttack Damage: 8/10\n\nRange: 3/10").setFontSize(17))

        var bulldogs_card = this.rexUI.add.perspectiveCard({
            front: bulldogs_buy,
            back: bulldogs_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var reapers_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        reapers_title.add(this.CreateLabel(this, 'Grim Reaper:'));
        reapers_title.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '↻', 22).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
            button.scaleYoyo(500, 1.5);
            reapers_card.toggleFace();
        }));

        var reapers_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        reapers_buy.add(text5).layout();
        reapers_buy.add(reapers).layout();

        var reapers_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        reapers_info.add(this.add.text(0,0,"\nAttack Speed: 8/10\n\nAttack Damage: 8/10\n\nRange: 4/10").setFontSize(17))

        var reapers_card = this.rexUI.add.perspectiveCard({
            front: reapers_buy,
            back: reapers_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var dogurais_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        dogurais_title.add(this.CreateLabel(this, 'dogurais:'));
        dogurais_title.add(this.rexUI.add.buttons({
            x: 400, y: 400,
            orientation: 'x',
            buttons: [
                this.createButton(this, '↻', 22).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
            button.scaleYoyo(500, 1.6);
            dogurais_card.toggleFace();
        }));

        var dogurais_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        dogurais_buy.add(text6).layout();
        dogurais_buy.add(dogurais).layout();

        var dogurais_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        dogurais_info.add(this.add.text(0,0,"\nAttack Speed: 8/10\n\nAttack Damage: 8/10\n\nRange: 4/10").setFontSize(17))

        var dogurais_card = this.rexUI.add.perspectiveCard({
            front: dogurais_buy,
            back: dogurais_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));
        

        //this.buyMenuSizer.add(this.CreateLabel(this, 'cowboys Cat:'), 0, 0, 'left', 0, true).layout();
        this.buyMenuSizer.add(cowboys_cat_title, 0, 0, 'center', 0, true).layout();
        this.buyMenuSizer.add(cowboys_cat_card, 0 , 1, 'center', 0, true).layout();
        this.buyMenuSizer.add(buffs_doge_title, 1, 0, 'center', 0, true).layout();
        this.buyMenuSizer.add(buffs_doge_card, 1 , 1, 'center', 0, true).layout();
        this.buyMenuSizer.add(bigms_cat_title, 0, 2, 'center', 0, true).layout();
        this.buyMenuSizer.add(bigms_cat_card, 0, 3, 'center', 0, true).layout();
        this.buyMenuSizer.add(bulldogs_title, 1, 2, 'center', 0, true).layout();
        this.buyMenuSizer.add(bulldogs_card, 1, 3, 'center', 0, true).layout();
        this.buyMenuSizer.add(reapers_title, 0, 4, 'center', 0, true).layout();
        this.buyMenuSizer.add(reapers_card, 0, 5, 'center', 0, true).layout();
        this.buyMenuSizer.add(dogurais_title, 1, 4, 'center', 0, true).layout();
        this.buyMenuSizer.add(dogurais_card, 1, 5, 'center', 0, true).layout();
        this.buyMenuSizer.layout();
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()
        .on('button.click', function (button: any) {
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
        var classType: string;
        var unitNumber: integer;
        var unitType: string;
        
        //Get unit number
        this.numberOfUnits++;
        unitNumber = this.numberOfUnits;

        //
        unitType = texture;

        var title = this.CreateLabel(this,"Unit #" + unitNumber + ": (" + unitType + ")");
        title.setMinWidth(420);
        var child = this.rexUI.add.sizer({
            orientation: 'y',
            space: { item: 10 }
            
        });
        var nameLabel = this.add.text(0,0,'Name:').setFontSize(20);
        var nameField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(3, COLOR_LIGHT),
            text: new BBCodeText(this, 0, 0,'', { fixedWidth: 300, fixedHeight: 18 }),
            space: { top: 5, bottom: 5, left: 5, right: 5, }
        })
            .setInteractive()
            .on('pointerdown', function () {
                var config = {
                    onTextChanged: function(textObject: any, text: any) {
                        name = text;
                        textObject.text = text;
                        title.text = "Unit #" + unitNumber + ": " + name.substring(0,8) + " (" + unitType + ")";
                        turret.name(textObject.text);
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
            text: new BBCodeText(this, 0, 0,'', { fixedWidth: 300, fixedHeight: 18 }),
            space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, },
        })
        .setInteractive().setText((Math.ceil(turret.x / 64)).toString())
        .on('pointerdown', function () {
            var config = {
                onTextChanged: function(textObject: any, text: any) {
                    var newCord = Math.floor((text as unknown as number)-1)
                    if(newCord < 12 && newCord >= 0) {
                        eventsCenter.emit("changeHorizontally", [turret, newCord])
                    }
                    textObject.text = Math.ceil(turret.x / 64)
                }
            }
            scene.rexUI.edit(horizField.getElement('text'), config);
        });
        
        // VERTICAL PLACEMENT UI
        var vertLabel = this.add.text(0,0,'Vertical Position:').setFontSize(20);
        var vertField = this.rexUI.add.label({
            orientation: 'x',
            background: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(3, COLOR_LIGHT),
            text: new BBCodeText(this, 0, 0,'', { fixedWidth: 300, fixedHeight: 18 }),
            space: { top: 5, bottom: 5, left: 5, right: 5, icon: 10, }
        })
        .setInteractive().setText((Math.ceil(turret.y / 64)).toString())
        .on('pointerdown', function () {
            var config = {
                onTextChanged: function(textObject: any, text: any) {
                    if(isNaN(text)){ // If not a number
                        if(text.substring(0,6) == 'Above ')
                        {   
                            //var setAboveUnitName = text.substring(7);
                            textObject.text = text;
                        }
                        else if(text.substring(0,6) == 'Below ')
                        {
                            //var setBelowUnitName = text.substring(7);
                            textObject.text = text;
                        }
                        else{
                            textObject.text = Math.ceil(turret.y / 64);
                        }
                    }
                    else {
                        var newCord = Math.floor((text as unknown as number)-1)
                        if(newCord < 8 && newCord >= 0) {
                            eventsCenter.emit("changeVertically", [turret, newCord])
                        }
                        textObject.text = Math.ceil(turret.y / 64);
                    }
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
                this.createButton(this, 'Fire', 20).setOrigin(0.5, 1),
                this.createButton(this, 'Ice', 20).setOrigin(0.5, 1),
                this.createButton(this, 'Poison', 20).setOrigin(0.5, 1),
                this.createButton(this, 'Lightning', 20).setOrigin(0.5, 1)
            ],
            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 6
            }
        })
        .setOrigin(0.5, 1)
        .layout()

        classField
            .on('button.click', function (button: any) {
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
    createButton(scene: any, text: any, fontSize: any) {
        return scene.rexUI.add.label({
            width: 25,
            height: 25,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
            text: scene.add.text(0, 0, text, {
                fontSize: fontSize
            }),
            align: 'center',
            space: {
                left: 10,
                right: 10,
            }
        }).setInnerPadding(5);
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

        this.buyMenuSizer = this.rexUI.add.gridSizer({
            column: 2,
            row: 10,

            columnProportions: 1,
        })
        .layout();

        this.upgradeMenuSizer = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        })
        .layout();
    }
}