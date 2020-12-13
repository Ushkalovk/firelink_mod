import {Button} from "../../Button";
import {game} from "../../Config";

class DenomButton extends Button {
    constructor(scene, x, y, texture, scale, index) {
        super(scene, x, y, texture, scale);

        this.on('pointerup', () => {
            game.scene.keys['Denom'].refreshDenomButtons(index);
            game.scene.keys['Panel'].updateValues();
            game.scene.keys['Panel'].togglePanelVisibility(true);
            game.scene.keys['MainWindow'].toggleTitlesVisibility(true);
            game.scene.keys['Slots'].togglePageVisibility(true);
            this.setFrame(0);
        });

        this.on('pointerdown', () => this.setFrame(1));
        this.on('pointerout', () => this.setFrame(0));
    }
}

export {DenomButton};
