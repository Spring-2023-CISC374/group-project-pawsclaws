import Phaser from "phaser";

export class Controller extends Phaser.Scene {
    private text: Phaser.GameObjects.Text;

    constructor ()
    {
        super({ key: 'BaseScene', active: true });
    }

    create () 
    {
        this.text = this.add.text(10, 10, '', {color:'#00ff00'});
    }

    update ()
    {
        var pointer = this.input.activePointer;
        this.text.setText([
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'isDown: ' + pointer.leftButtonDown(),
            'rightButtonDown: ' + pointer.rightButtonDown()
        ])
        //Bring Scene A to top
        if(pointer.worldX > 100 && pointer.worldX < 200 && pointer.worldY > 100 && pointer.worldY < 200 && pointer.leftButtonDown() == true){
            this.scene.bringToTop(this.scene.get('SceneA'));
        }
        //Bring Scene B to top
        if(pointer.worldX > 200 && pointer.worldX < 300 && pointer.worldY > 100 && pointer.worldY < 200 && pointer.leftButtonDown() == true){
            this.scene.bringToTop(this.scene.get('SceneB'));
        }
        //Bring Scene C to top
        if(pointer.worldX > 300 && pointer.worldX < 400 && pointer.worldY > 100 && pointer.worldY < 200 && pointer.leftButtonDown() == true){
            this.scene.bringToTop(this.scene.get('SceneC'));
        }
    }
    
}

export class SceneA extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneA', active: true });
    }

    create ()
    {
        let graphics = this.add.graphics();

        graphics.fillStyle(0xff3300, 1);

        graphics.fillRect(100, 200, 600, 300);
        graphics.fillRect(100, 100, 100, 100);

        this.add.text(120, 110, 'A', { font: '96px Courier', color: '#000000' });
    }
}

export class SceneB extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneB', active: true });
    }

    create ()
    {
        let graphics = this.add.graphics();

        graphics.fillStyle(0xff9933, 1);

        graphics.fillRect(100, 200, 600, 300);
        graphics.fillRect(200, 100, 100, 100);

        this.add.text(220, 110, 'B', { font: '96px Courier', color: '#000000' });
    }
}

export class SceneC extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneC', active: true });
    }

    create ()
    {
        let graphics = this.add.graphics();

        graphics.fillStyle(0xffcc33, 1);

        graphics.fillRect(100, 200, 600, 300);
        graphics.fillRect(300, 100, 100, 100);

        this.add.text(320, 110, 'C', { font: '96px Courier', color: '#000000' });
    }
}
