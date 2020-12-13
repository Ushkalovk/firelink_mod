import {offsetX, height, game, gameWidth, isMobile} from "../Config";

class OverlayWindow extends Phaser.Scene {

    constructor() {
        super('OverlayWindow');

        this.isAnimStart = false;
        this.secondAnimStart = false;
        this.isMenuOpen = false;
    }

    create() {
        this.style = {
            padding: {
                x: 10,
                y: 10
            },
            fontSize: '14px',
            fontFamily: 'Arial',
            color: 'white',
            align: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        };

        this.buttonsName = ['монеты', 'фри спины', 'freeGames (локация)',
            'A', 'bell', 'food', 'guitar', 'J', 'K', 'nine', 'Q', 'skull', 'ten'];

        const graphics = this.add.graphics().fillStyle(0xA19898, 0.85).fillRect(0, 0, gameWidth, height).setAlpha(0);
        const animBtn = this.add.text(250, 20, 'окно анимаций', this.style).setOrigin(0).setInteractive({cursor: 'pointer'});

        const buttonsArray = this.buttonsName.map((item, index) => {
            return this.add.text(250, 80 + (40 * index), item, this.style).setOrigin(0).setInteractive({cursor: 'pointer'}).setAlpha(0);
        });

        buttonsArray[0].on('pointerdown', () => {
            if (!this.isAnimStart && !this.secondAnimStart) {
                menuClose();
                this.createCoins();
            }
        });

        buttonsArray[1].on('pointerdown', () => {
            if (!this.isAnimStart && !this.secondAnimStart) {
                menuClose();
                this.scene.launch('FreeSpins');
            }
        });

        buttonsArray[2].on('pointerdown', () => {
            if (!this.isAnimStart && !this.secondAnimStart) {
                game.scene.keys['Panel'].updateButtonsFrames('spin', !game.scene.keys['Panel'].buttonsClicked.spin);
                game.scene.keys['Slots'].allowStart('picture');
                menuClose();
            }
        });

        buttonsArray.slice(3).forEach(btn => {
            btn.on('pointerdown', () => {
                if (!this.isAnimStart) {
                    game.scene.keys['Panel'].updateButtonsFrames('spin', !game.scene.keys['Panel'].buttonsClicked.spin);
                    game.scene.keys['Slots'].allowStart(btn.text);
                    menuClose();
                }
            })
        });

        animBtn.on('pointerdown', function () {
            if (this.isMenuOpen) {
                menuClose()
            } else {
                this.setText('закрыть');
                graphics.setAlpha(1);
                buttonsArray.forEach(i => i.setAlpha(1))
            }

            this.isMenuOpen = !this.isMenuOpen;
        });

        const self = this;

        function menuClose() {
            animBtn.setText('окно анимаций');
            graphics.setAlpha(0);
            buttonsArray.forEach(i => i.setAlpha(0));
            self.isMenuOpen = false;
        }
    }

    update() {
        if (this.bigWin && this.bigWin.anims && this.bigWin.anims.getProgress() > 0.9) {
            this.events.emit('bigWin')
        }
    }

    createCoins() {
        this.isAnimStart = true;
        const brill = this.add.sprite(offsetX, height, 'brill').setScale(0.6).setOrigin(0.5, 1).play('brill');

        brill.on('animationcomplete', () => {
            brill.destroy();
            this.isAnimStart = false;
        });
    }

    createBigWin(allow = true) {
        const frame = game.scene.keys['Slots'].createFrameAfterBigWin();

        this.events.once('bigWin', () => {
            this.tweens.add({
                targets: frame,
                alpha: 0,
                ease: 'linear',
                duration: 270,
                onCompleteScope: this,
                onComplete() {
                    frame.destroy();
                    this.createCoins();
                },
            })
        });

        game.scene.keys['Musics'].playSound('fireworks');

        this.bigWin = this.add.sprite(offsetX, isMobile ? 605 : 620, 'bigWin').setScale(0.5).play('bigWin');

        const callback = () => {
            this.bigWin.destroy();
            this.isAnimStart = false;

            !allow && this.createCoins();
        };

        this.bigWin.on('animationcomplete', () => this.time.delayedCall(500, callback, [], this));
    }

    fade(link, isFreeGames) {
        this.cameras.main.once('camerafadeoutcomplete', camera => {
            this.isAnimStart = false;
            this.secondAnimStart = false;
            game.scene.keys['MainWindow'].refreshScene();
            game.scene.keys['Slots'].hideFrame(1);
            game.scene.keys['Slots'].updateCells();

            if (isFreeGames) {
                game.scene.keys['FreeGames'].togglePageVisibility(false)
            } else {
                link.scene.stop();
                this.createBigWin(true);
                game.scene.keys['Panel'].goodLuck.setAlpha(1);
            }

            game.scene.keys['Panel'].updateButtonsFrames();

            camera.fadeIn(1000, 255, 255, 255);
        }, this);

        this.cameras.main.fadeOut(1000, 255, 255, 255);
    }

    createPressToStart() {
        this.pressToStart = this.add.sprite(offsetX, isMobile ? 452 : 467, 'pressToStart')
            .setOrigin(0.5, 0)
            .setScale(0, 0.98)
            .play('pressToStart');

        this.tweens.add({
            targets: this.pressToStart,
            ease: 'linear',
            scaleX: 0.98,
            duration: 150,
            onCompleteScope: this,
            onComplete() {
                game.scene.keys['FreeGames'].confetti.destroy();
                game.scene.keys['Slots'].updateCells();

                this.input.once('pointerdown', () => game.scene.keys['FreeGames'].runSlots());
            }
        })
    }

    createFreeGamesFrame() {
        this.frameAnim = this.add.sprite(offsetX, isMobile ? 450 : 465, 'freeGamesFrame')
            .setOrigin(0.5, 0)
            .setScale(0.54)
            .play('freeGamesFrame');
    }

    createYouWon() {
        this.youWon = this.add.sprite(offsetX, isMobile ? 205 : 220, 'youWon').setOrigin(0.5, 0).setDepth(200).play('youWon');
    }
}

export {OverlayWindow};
