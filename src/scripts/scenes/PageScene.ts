import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { TabPages, Sizer, GridSizer} from 'phaser3-rex-plugins/templates/ui/ui-components'
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
       this.load.html("UnitEditor", "assets/html/UnitEditor.html")
       this.load.image('buff', '/assets/buff_doge.png')
       this.load.image('cowboy', '/assets/cowboy_cat.png')
       this.load.image('bigm','/assets/rootbeer_cat.png')
       this.load.image('bulldog','/assets/bulldog.png')
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
        var text = this.add.text(0,0, 'cost: 125')
        var text2 = this.add.text(0,0, 'cost: 150')
        var text3 = this.add.text(0,0, 'cost: 225')
        var text4 = this.add.text(0,0, 'cost: 275')
        var cowboy = this.add.image(0,0, 'cowboy').setScale(0.1)
        var buff = this.add.image(0,0, 'buff').setScale(0.1)
        var bigm = this.add.image(0,0,'bigm').setScale(0.1)
        var bulldog = this.add.image(0,0,'bulldog').setScale(0.1)
        var background_cowboy = this.add.image(cowboy.x,cowboy.y, 'cowboy').setScale(0.1).setVisible(false)
        var background_buff = this.add.image(buff.x,buff.y, 'buff').setScale(0.1).setVisible(false)
        var background_bigm = this.add.image(bigm.x,bigm.y,'bigm').setScale(0.1).setVisible(false)
        var background_bulldog = this.add.image(bulldog.x,bulldog.y,'bulldog').setScale(0.1).setVisible(false)
        var draggable_cowboy = new Drag(cowboy)
        var draggable_buff = new Drag(buff)
        var draggable_bigm = new Drag(bigm)
        var draggable_bulldog = new Drag(bulldog)
        cowboy.setInteractive()
        buff.setInteractive()
        bigm.setInteractive()
        bulldog.setInteractive()

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

          // Big M Unit
          bigm.on('dragstart', (pointer: any) => {
            // make the background Big M appear
            background_bigm.x = bigm.x
            background_bigm.y = bigm.y
            background_bigm.setVisible(true)

            // make the draggable Big M smaller so its easier to place
            bigm.setScale(0.04)
            // set the draggable Big M x and y to wherever the mouse is
            bigm.x = bigm.x
            bigm.y = bigm.y 
        })
        // updates the Big M x and y when being dragged
        bigm.on('drag', (pointer: any) => {
            bigm.x = pointer.x
            bigm.y = pointer.y 
        })
        bigm.on('dragend', (pointer: any) => {
            // set the scale of the Big M back to 0.1 for the shop
            // set the Big M x and y to the background Big M x and y
            bigm.setScale(0.1)
            bigm.x = background_bigm.x
            bigm.y = background_bigm.y

            // make the background Big M disappear
            background_bigm.setVisible(false)

            var bigm_text = "bigm"
            eventsCenter.emit("tower-place?", bigm_text)
        })

        // Bulldog Unit
        bulldog.on('dragstart', (pointer: any) => {
            // make the background cowboy appear
            background_bulldog.x = bulldog.x
            background_bulldog.y = bulldog.y
            background_bulldog.setVisible(true)

            // make the draggable Bulldog smaller so its easier to place
            bulldog.setScale(0.04)
            // set the draggable Bulldog x and y to wherever the mouse is
            bulldog.x = bulldog.x
            bulldog.y = bulldog.y 
        })
        // updates the  Bulldog x and y when being dragged
        bulldog.on('drag', (pointer: any) => {
            bulldog.x = pointer.x
            bulldog.y = pointer.y 
        })
        bulldog.on('dragend', (pointer: any) => {
            // set the scale of the  Bulldog back to 0.1 for the shop
            // set the  Bulldog x and y to the background  Bulldog x and y
            bulldog.setScale(0.1)
            bulldog.x = background_bulldog.x
            bulldog.y = background_bulldog.y

            // make the background  Bulldog disappear
            background_bulldog.setVisible(false)

            var bulldog_text = "bulldog"
            eventsCenter.emit("tower-place?", bulldog_text)
        })

        var cowboy_cat_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        cowboy_cat_title.add(this.CreateLabel(this, 'Cowboy Cat:'));
        cowboy_cat_title.add(this.rexUI.add.buttons({
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
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
            cowboy_cat_card.toggleFace();
        }));

        var cowboy_cat_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        cowboy_cat_buy.add(text).layout();
        cowboy_cat_buy.add(cowboy).layout();

        var cowboy_cat_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        cowboy_cat_info.add(this.add.text(0,0,"\nAttack Speed: 5/10\n\nAttack Damage: 5/10\n\nRange: 6/10").setFontSize(17))

        var cowboy_cat_card = this.rexUI.add.perspectiveCard({
            front: cowboy_cat_buy,
            back: cowboy_cat_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var buff_doge_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        }).setMinWidth(245);
        buff_doge_title.add(this.CreateLabel(this, 'Buff Doge:'));
        buff_doge_title.add(this.rexUI.add.buttons({
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
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.2);
            buff_doge_card.toggleFace();
        }), {align: 'right'});
        var buff_doge_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);;
        buff_doge_buy.add(text2).layout();
        buff_doge_buy.add(buff).layout();

        var buff_doge_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        buff_doge_info.add(this.add.text(0,0,"\nAttack Speed: 5/10 \n\nAttack Damage: 7/10\n\nRange: 3/10").setFontSize(17));

        var buff_doge_card = this.rexUI.add.perspectiveCard({
            front: buff_doge_buy,
            back: buff_doge_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var bigm_cat_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        bigm_cat_title.add(this.CreateLabel(this, 'RootBeer Cat:'));
        bigm_cat_title.add(this.rexUI.add.buttons({
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
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.3);
            bigm_cat_card.toggleFace();
        }));

        var bigm_cat_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        bigm_cat_buy.add(text3).layout();
        bigm_cat_buy.add(bigm).layout();

        var bigm_cat_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        bigm_cat_info.add(this.add.text(0,0,"\nAttack Speed: 3/10\n\nAttack Damage: 8/10\n\nRange: 6/10").setFontSize(17))

        var bigm_cat_card = this.rexUI.add.perspectiveCard({
            front: bigm_cat_buy,
            back: bigm_cat_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        var bulldog_title = this.rexUI.add.sizer({
            width: 200,
            orientation: 'x'
        });
        bulldog_title.add(this.CreateLabel(this, 'Bulldog Spike:'));
        bulldog_title.add(this.rexUI.add.buttons({
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
        .on('button.click', function (button: any, index: any, pointer: any, event: any) {
            button.scaleYoyo(500, 1.4);
            bulldog_card.toggleFace();
        }));

        var bulldog_buy = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        }).setInnerPadding(8);
        bulldog_buy.add(text4).layout();
        bulldog_buy.add(bulldog).layout();

        var bulldog_info = this.rexUI.add.sizer({
            width: 200,
            orientation: 'y'
        });
        bulldog_info.add(this.add.text(0,0,"\nAttack Speed: 7/10\n\nAttack Damage: 8/10\n\nRange: 3/10").setFontSize(17))

        var bulldog_card = this.rexUI.add.perspectiveCard({
            front: bulldog_buy,
            back: bulldog_info,
            orientation: 0,
            snapshotPadding: 3,
        }).addBackground(this.rexUI.add.roundRectangle(0, 0, 10, 10, 10).setStrokeStyle(2, COLOR_LIGHT));

        //this.buyMenuSizer.add(this.CreateLabel(this, 'Cowboy Cat:'), 0, 0, 'left', 0, true).layout();
        this.buyMenuSizer.add(cowboy_cat_title, 0, 0, 'center', 0, true).layout();
        this.buyMenuSizer.add(cowboy_cat_card, 0 , 1, 'center', 0, true).layout();
        this.buyMenuSizer.add(buff_doge_title, 1, 0, 'center', 0, true).layout();
        this.buyMenuSizer.add(buff_doge_card, 1 , 1, 'center', 0, true).layout();
        this.buyMenuSizer.add(bigm_cat_title, 0, 2, 'center', 0, true).layout();
        this.buyMenuSizer.add(bigm_cat_card, 0, 3, 'center', 0, true).layout();
        this.buyMenuSizer.add(bulldog_title, 1, 2, 'center', 0, true).layout();
        this.buyMenuSizer.add(bulldog_card, 1, 3, 'center', 0, true).layout();
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
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
                this.createButton(this, '+', 14).setOrigin(0.5, 1),
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
        title.setMinWidth(420);
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
            row: 5,

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