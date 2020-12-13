import {offsetX, game, isMobile, height} from "../../Config";
import {imagesOptions} from "./imagesOptions";

class FreeGames extends Phaser.Scene {
    constructor() {
        super('FreeGames');

        this.currentSpin = 0;
        this.spinsQuantity = 10;
        this.isFreeGamesStart = false;
    }

    create() {
        this.container = this.add.container(offsetX, isMobile ? -15 : 0).setAlpha(0);

        Object.entries(imagesOptions).forEach(option => {
            this[option[0]] = this.add.sprite(
                option[1].x || 0,
                option[1].y,
                option[0]
            )
                .setOrigin(0.5, 0)
                .setScale(option[1].scale.x, option[1].scale.y);

            this.container.add(this[option[0]]);
        });
    }

    start() {
        this.increaseSceneOpacity();
        this.createConfetti();
    }

    increaseSceneOpacity() {
        this.tweens.add({
            targets: this.container,
            ease: 'linear',
            alpha: 1,
            delay: 2000,
            duration: 1000,
            onCompleteScope: this,
            onComplete() {
                this.switchFreeGamesAnim();
                this['freeGamesText'].play('freeGamesText');
                this['freeGamesMoneyDisplay'].play('freeGamesMoneyDisplay');
                game.scene.keys['OverlayWindow'].createFreeGamesFrame();
            }
        })
    }

    createConfetti() {
        this.confetti = this.add.sprite(offsetX, height, 'confetti').setOrigin(0.5, 1).play('confetti');
    }

    finish() {
        game.scene.keys['Panel'].updateButtonsFrames('autoPlay', false);

        this.time.delayedCall(
            game.scene.keys['Musics'].playSound('freeGamesEnd').duration * 1000,
            () => {
                this.currentSpin = 0;
                game.scene.keys['OverlayWindow'].fade(this, true);
            },
            [],
            this
        );
    }

    isTheLastSpin() {
        this.currentSpin === this.spinsQuantity && this.finish();
    }

    increaseCurrentSpin() {
        this['numbers'].setFrame(++this.currentSpin);
    }

    togglePageVisibility(value) {
        this.scene[value ? 'wake' : 'sleep']();
        this.scene.setVisible(value);
        this.isFreeGamesStart = value;

        if (!value) {
            this.container.setAlpha(0);
            game.scene.keys['Slots'].freeGamesFrame.setAlpha(0)
        }

        game.scene.keys['Panel'].updateButtonsFrames();
    }

    moveToFreeGames() {
        this.start();
        game.scene.keys['Slots'].createBars(true);
        const frame = game.scene.keys['Slots'].createFrameAfterBigWin();

        this.time.delayedCall(
            500,
            () => {
                game.scene.keys['OverlayWindow'].createYouWon();

                this.tweens.add({
                    targets: frame,
                    y: height,
                    ease: 'linear',
                    delay: 200,
                    duration: 400,
                    onComplete() {
                        frame.destroy()
                    }
                });
            },
            [],
            this
        );

        this.bgSound = game.scene.keys['Musics'].playSound('freeGamesBg');
        game.scene.keys['Musics'].playSound('wind');
        game.scene.keys['Slots'].hideFrame(0);
        game.scene.keys['Slots'].destroyCells();
        game.scene.keys['MainWindow'].toggleTitlesVisibility(false);
        game.scene.keys['MainWindow'].zoom(1.5, 2000);
    }

    runSlots() {
        game.scene.keys['OverlayWindow'].frameAnim.destroy();
        game.scene.keys['OverlayWindow'].pressToStart.destroy();
        game.scene.keys['Slots'].freeGamesFrame.setAlpha(1);
        game.scene.keys['Panel'].buttonsClicked.autoPlay = true;
        console.log(this.bgSound);
        this.bgSound.stop();
    }

    switchFreeGamesAnim() {
        game.scene.keys['Musics'].playSound('wind2');

        this.tweens.add({
            targets: game.scene.keys['OverlayWindow'].youWon,
            ease: 'linear',
            scaleX: 0,
            duration: 150,
            onComplete() {
                game.scene.keys['OverlayWindow'].youWon.destroy();
                game.scene.keys['OverlayWindow'].createPressToStart();
            }
        })
    }
}

export {FreeGames};
