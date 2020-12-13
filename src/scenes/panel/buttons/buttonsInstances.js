import {Button} from "../../../Button";
import {game} from "../../../Config";

class AutoPlayButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'autoPlayBtn', scale, 0);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].updateButtonsFrames('autoPlay', !game.scene.keys['Panel'].buttonsClicked.autoPlay);
                game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);
            }
        })
    }
}

class SpinButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'spinBtn', scale, 0);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                if (game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Slots'].isStopClicked) {
                    game.scene.keys['Slots'].allowStart();
                    game.scene.keys['Slots'].isStopClicked = true;
                }

                if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Slots'].endSpinTimer) {
                    game.scene.keys['Slots'].allowStart();
                    game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);
                    game.scene.keys['Panel'].updateButtonsFrames('spin', true);
                }
            }
        })
    }
}

class DecreaseButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'decreaseBtn', scale, 0);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].setBet(false);
            }
        })
    }
}

class IncreaseButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'increaseBtn', scale, 0);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].setBet(true);
            }
        })
    }
}

class InfoButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'infoBtn', scale, 0);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(!game.scene.keys['Panel'].buttonsClicked.info);
                game.scene.keys['Musics'].playSound(game.scene.keys['Panel'].buttonsClicked.info ? 'openSettings' : 'closeSettings');
            }
        })
    }
}

class DenomButtons extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'denomButtons', scale, 0);

        this.on('pointerup', () => {
            if (!game.scene.keys['Panel'].buttonsClicked.spin && !game.scene.keys['Panel'].buttonsClicked.autoPlay && !game.scene.keys['FreeSpins'].freeSpinStart && !game.scene.keys['FreeGames'].isFreeGamesStart) {
                game.scene.keys['MainWindow'].toggleTitlesVisibility(false);
                game.scene.keys['Denom'].togglePageVisibility(true);
                game.scene.keys['Slots'].togglePageVisibility(false);
                scene.togglePanelVisibility(false);
            }
        })
    }
}

class VolumeButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'volumeBtn', scale, 0);

        this.on('pointerup', () => {
            game.scene.keys['Panel'].updateVolumeFrame();
            game.scene.keys['Musics'].setVolume(game.scene.keys['Panel'].buttonsClicked.volumeFrame);
        })
    }
}

class GameRulesButton extends Button {
    constructor(scene, x, y, scale) {
        super(scene, x, y, 'gameRules', scale, 0);

        this.on('pointerup', () => {
            scene.togglePanelVisibility(false);
            game.scene.keys['Slots'].togglePageVisibility(false);
            game.scene.keys['Rules'].togglePageVisibility(true);

            game.scene.keys['Panel'].toggleVolumeAndRulesContainerVisibility(false);

            game.scene.keys['MainWindow'].hideJackPotsImages(false);
            game.scene.keys['MainWindow'].changeTitlesVisibility(0);
        })
    }
}

const classes = {
    AutoPlayButton,
    SpinButton,
    DecreaseButton,
    IncreaseButton,
    InfoButton,
    DenomButtons,
    VolumeButton,
    GameRulesButton
};

export {classes};
