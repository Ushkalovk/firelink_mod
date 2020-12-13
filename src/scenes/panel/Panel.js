import {offsetX, height, game, isMobile} from "../../Config";
import {classes} from "./buttons/buttonsInstances";
import {buttonsOptions} from "./buttons/buttonsOptions";
import {textOptions} from "./textOptions";
import {imagesOptions} from "./imagesOptions";

class Panel extends Phaser.Scene {

    constructor() {
        super('Panel');

        this.currentDenom = {
            frame: 0,
            lines: 50,
            percent: 100,
            bets: [50, 100, 150, 250, 500],
            currentBet: 0
        };

        this.buttonsClicked = {
            spin: false,
            autoPlay: false,
            info: false,
            volumeFrame: 1
        };
    }

    async create() {
        const device = isMobile ? 'mobile' : 'desktop';
        const panel = this.add.container(offsetX, height - 10);

        // Создаём картинки

        Object.entries(imagesOptions).map(option => {
            const {x, y, scale} = option[1][device];
            const {origin, visible} = option[1];

            this[option[0]] = this.add.image(x, y, option[0])
                .setOrigin(origin.x, origin.y)
                .setScale(scale)
                .setVisible(visible !== false);

            panel.add(this[option[0]]);
        });

        // Создаём кнопки

        Object.entries(buttonsOptions[device]).forEach(option => {
            const name = option[0][0].toLowerCase() + option[0].slice(1);
            const {x, y, scale} = option[1];

            this[name] = this.add.existing(
                new classes[option[0]](
                    this, x, y, {x: scale, y: scale}
                )
            );

            panel.add(this[name]);
        });

        this['autoPlayButton'].setVisible(!isMobile);
        this['volumeButton'].setFrame(this.buttonsClicked.volumeFrame);

        this.volumeAndRulesContainer = this.add.container(
            isMobile ? -230 : -430,
            isMobile ? -143 : -112,
            [this['buttonBg'], this['gameRulesButton'], this['volumeButton']]
        ).setVisible(false).setDepth(100);

        panel.add(this.volumeAndRulesContainer);

        // Создаём текст

        for (const option of Object.entries(textOptions)) {
            const {font, text, color, originX, visible} = option[1];
            const {x, y, size} = option[1][device];

            this[option[0]] = await game.scene.keys['Text'].setFont({
                link: this, x, y, size, font, text, color, originX
            });

            this[option[0]].setVisible(visible !== false);

            panel.add(this[option[0]]);
        }

        this.updateValues(); // Обновляем текст, т.к. изначально он равен пустой строке
    }

    updateButtonsFrames(button, value) {
        if (button) {
            this.buttonsClicked[button] = value;
        }

        this['spinButton'].setFrame(this.buttonsClicked.spin ? 1 : this.buttonsClicked.autoPlay ? 2 : 0);
        this['autoPlayButton'].setFrame(this.buttonsClicked.autoPlay ? 1 : this.buttonsClicked.spin ? 3 : 0);
        this.setFrame(
            this.buttonsClicked.spin ||
            this.buttonsClicked.autoPlay ||
            game.scene.keys['FreeSpins'].freeSpinStart ||
            game.scene.keys['FreeGames'].isFreeGamesStart ? 1 : 0
        );

        if (game.scene.keys['FreeSpins'].freeSpinStart || game.scene.keys['FreeGames'].isFreeGamesStart) {
            this['spinButton'].setFrame(2);
            this['autoPlayButton'].setFrame(2);
        }
    }

    updateVolumeFrame() {
        this.buttonsClicked.volumeFrame < 3 ? this.buttonsClicked.volumeFrame++ : this.buttonsClicked.volumeFrame = 0;
        this['volumeButton'].setFrame(this.buttonsClicked.volumeFrame);
    }

    setFrame(frame) {
        this['infoButton'].setFrame(frame);
        this['decreaseButton'].setFrame(frame);
        this['increaseButton'].setFrame(frame);
    }

    togglePanelVisibility(value) {
        this.scene[value ? 'wake' : 'sleep']();
        this.scene.setVisible(value);
    }

    goodLuckAnim() {
        this.goodLuck.setScale(0);

        this.tweens.add({
            targets: this['goodLuck'],
            scale: isMobile ? 0.46 : 0.57,
            ease: 'linear',
            duration: 300
        });

        this.changeGoodLuckTitle(false, 0);
    }

    toggleVolumeAndRulesContainerVisibility(value) {
        this.buttonsClicked.info = value;
        game.scene.keys['Panel'].volumeAndRulesContainer.setVisible(this.buttonsClicked.info);
    }

    changeGoodLuckTitle(visible, duration) {
        this['goodLuckText'].setVisible(!visible);

        this.time.delayedCall(duration, () => this['gameOverText'].setVisible(visible), [], this);
    }

    updateValues() {
        this['denomButtons'].setFrame(this.currentDenom.frame);
        this.linesInPlay.setText(`${this.currentDenom.lines}`);
        this.balanceValue.setText(`$${game.scene.keys['Text'].formatBetText(game.scene.keys['MainWindow'].balance)}.00`);
        this.denomBalanceValue.setText(`${game.scene.keys['MainWindow'].balance * this.currentDenom.percent}`);
        this.winAnim.setText(`$${game.scene.keys['Text'].formatBetText(game.scene.keys['MainWindow'].winAnim)}`);

        this.updateBet();
    }

    updateBet() {
        this.currentBet.setText(`$${game.scene.keys['Text'].formatBetText(this.currentDenom.bets[this.currentDenom.currentBet] / this.currentDenom.percent)}`);
        this.currentBetDenom.setText(`${game.scene.keys['Text'].formatBetText(this.currentDenom.bets[this.currentDenom.currentBet])}`);
    }

    changeTextVisibility(alpha) {
        this.goodLuck.setAlpha(alpha);
        this.goodLuckText.setAlpha(alpha);
        !alpha && this['gameOverText'].setAlpha(alpha);
    }

    setBet(increase) {
        if (this.currentDenom.currentBet < this.currentDenom.bets.length - 1 && increase) {
            this.currentDenom.currentBet++;
        }

        if (this.currentDenom.currentBet > 0 && !increase) {
            this.currentDenom.currentBet--;
        }

        this.updateBet();
    }
}

export {Panel};

