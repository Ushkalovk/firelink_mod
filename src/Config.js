import {CANVAS, Scale} from 'phaser';
import {Slots} from "./scenes/slots/Slots";
import {FreeSpins} from "./scenes/FreeSpins";
import {Panel} from "./scenes/panel/Panel";
import {Musics} from "./scenes/Musics";
import {Denom} from "./scenes/denom/Denom";
import {Rules} from "./scenes/rules/Rules";
import {OverlayWindow} from "./scenes/OverlayWindow";
import {MainWindow} from "./scenes/MainWindow";
import {Text} from "./scenes/Text";
import {Loader} from "./scenes/Loader";
import {FreeGames} from "./scenes/freeGames/freeGames";

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
export const height = 940;
export const gameWidth = 1920;
export const offsetX = gameWidth / 2;
export const symbols = ['A', 'bell', 'guitar', 'J', 'food', 'K', 'nine', 'Q', 'skull', 'ten', 'picture'];
export const fireBalls = ['50x', '75x', '100x', '125x', '250x', '625x', 'mini'];

const config = {
    type: CANVAS,
    parent: 'slots',
    scale: {
        mode: Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Scale.CENTER_BOTH,
        width: gameWidth,
        height: height,
    },
    audio: {
        disableWebAudio: false
    },
    dom: {
        createContainer: false
    },
    scene: [Loader, Musics, MainWindow, FreeGames, Slots, FreeSpins, Panel, OverlayWindow, Denom, Rules, Text]
};

export const game = new Phaser.Game(config);
