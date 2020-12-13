import {game, offsetX, height} from '../../Config';
import {DenomButton} from "./buttons";

class Denom extends Phaser.Scene {

    constructor() {
        super('Denom');

        this.denomButtons = [
            {
                name: '1c',
                lines: 50,
                percent: 100,
                bets: [50, 100, 150, 250, 500]
            },
            {
                name: '2c',
                lines: 50,
                percent: 50,
                bets: [50, 100, 150, 250, 500]
            },
            {
                name: '5c',
                lines: 20,
                percent: 20,
                bets: [20, 40, 60, 100, 200]
            },
            {
                name: '10c',
                lines: 20,
                percent: 10,
                bets: [20, 40, 60, 100, 200]
            },
            {
                name: '1d',
                lines: 10,
                percent: 1,
                bets: [10, 20, 30, 40, 50]
            }
        ];
    }

    async create() {
        this.olvera = this.add.sprite(offsetX, 420, 'denomOlvera')
            .setScale(0.7)
            .play('denomOlvera');

        this.togglePageVisibility(false);

        this.createButtonsContainer();
        this.createBalanceContainer();
    }

    createButtonsContainer() {
        const buttonsBg = this.add.image(0, 0, 'denomButtonsDisplay').setScale(0.4);

        const buttons = this.denomButtons.map((button, index) => {
            return this.add.existing(
                new DenomButton(
                    this,
                    -185 + 117 * index,
                    40,
                    button.name,
                    {
                        x: 0.41,
                        y: 0.41
                    },
                    index
                )
            );
        });

        const selectDenomText = this.add.image(0, 140, 'selectDenomText').setScale(0.45);

        this.add.container(offsetX, height - 330, [buttonsBg, ...buttons, selectDenomText])
            .setScale(window.screen.width > buttonsBg.displayWidth ? 1 : (buttonsBg.width * this.scale.displayScale.x) / (this.scale.parentSize.width + 100))
    }

    async createBalanceContainer() {
        const balanceValueBg = this.add.image(0, -10, 'balanceText').setOrigin(0, 1).setScale(0.4);

        const balanceContainer = this.add.container(
            window.screen.width > 800 ? offsetX - 380 : -this.scale.canvasBounds.x * this.scale.displayScale.x,
            height,
            [balanceValueBg]
        );

        const balanceValue = await game.scene.keys['Text'].setFont({
            link: this,
            x: 150,
            y: -35,
            text: `$${game.scene.keys['Text'].formatBetText(game.scene.keys['MainWindow'].balance)}.00`,
            font: 'impact',
            size: '28pt',
            color: '#FFFFFF',
        });

        balanceContainer.add(balanceValue);
    }

    togglePageVisibility(value) {
        this.scene[value ? 'wake' : 'sleep']();
        this.scene.setVisible(value);
    }

    refreshDenomButtons(frame) {
        this.togglePageVisibility(false);
        game.scene.keys['Panel'].currentDenom = {...this.denomButtons[frame], frame, currentBet: 0};
    }
}

export {Denom};
