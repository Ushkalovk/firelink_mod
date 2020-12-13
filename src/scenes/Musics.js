class Musics extends Phaser.Scene {

    constructor() {
        super('Musics');

        this.playSound;
    }

    preload() {
        this.load.audioSprite('soundsprite', '../sounds/soundsprite.json',['../sounds/soundsprite.ogg', '../sounds/soundsprite.mp3'], {instaces: 6});
    }


    create() {

        this.playSound = (name) =>{
            let sound = this.sound.addAudioSprite('soundsprite', name);
            sound.play(name);
            return sound;
        }
    }

    setVolume(frame) {
        let value;

        if (frame === 0) {
            value = 0
        } else if (frame === 1) {
            value = 1;
        } else if (frame === 2) {
            value = 0.66;
        } else {
            value = 0.33;
        }

        this.scene.scene.sound.setVolume(value);
    }
}

export {Musics};
