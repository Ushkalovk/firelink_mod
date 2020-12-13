import {game} from "./Config";

class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, scale, frame) {
        super(scene, x, y, texture);

        this.setTexture(texture);
        this.setPosition(x, y);
        this.setOrigin(1);
        this.setDepth(50);
        this.setScale(scale.x, scale.y);
        this.setFrame(frame);
        this.setInteractive({cursor: 'pointer'});

        this.on('pointerup', () => game.scene.keys['Musics'].playSound('click'));
    }
}

export {Button};
