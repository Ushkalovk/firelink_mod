import {Button} from "../../../Button";
import {game} from "../../../Config";

class PreviousPage extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'previousPage', scale, frame);

        this.on('pointerup', () => {
            game.scene.keys['Rules'].changeCurrentPage(false);
        })
    }
}

class ReturnToGame extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'returnToGame', scale, frame);

        this.on('pointerup', () => {
            game.scene.keys['Rules'].togglePageVisibility(false);
            game.scene.keys['MainWindow'].hideJackPotsImages(true);
            game.scene.keys['MainWindow'].changeTitlesVisibility(1);
            game.scene.keys['Panel'].togglePanelVisibility(true);
            game.scene.keys['Slots'].togglePageVisibility(true);
        })
    }
}

class NextPage extends Button {
    constructor(scene, x, y, scale, frame = 0) {
        super(scene, x, y, 'nextPage', scale, frame);

        this.on('pointerup', () => {
            game.scene.keys['Rules'].changeCurrentPage(true);
        })
    }
}

const classes = {PreviousPage, ReturnToGame, NextPage};

export {classes}
