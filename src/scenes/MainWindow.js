import {offsetX, isMobile} from '../Config';

class MainWindow extends Phaser.Scene {

    constructor() {
        super('MainWindow');

        this.countSpinClick = 0;

        this.balance = 1705;
        this.currentBet = 20;
    }

    create() {
        this.add.image(offsetX, 0, 'background').setOrigin(0.5, 0).setScale(1.027, 0.87);
        this.add.image(245, 35, 'roofPart1').setOrigin(0.5, 0).setScale(1.027, 0.87).setDepth(500);
        this.add.image(1767, 65, 'roofPart2').setOrigin(0.5, 0).setScale(1.027, 0.87).setDepth(500);

        this.logo = this.add.sprite(0, 290, 'logo').setScale(0.52).play('logo');

        this.titles = [
            this.add.image(0, 454, 'title').setScale(0.96),
            this.add.image(0, 452, 'title1').setScale(0.7).setAlpha(0),
        ];

        this.olvera = this.add.sprite(0, 437, 'olvera')
            .setScale(0.35)
            .setAlpha(0);

        this.jackpotImages = {
            images: [
                this.add.image(0, 55, 'jackpot1').setScale(0.96).setDepth(20),
                this.add.image(0, 140, 'jackpot2').setScale(0.87).setDepth(20),
                this.add.image(0, 140, 'jackpot3').setScale(0.6).setDepth(20).setAlpha(0),
                this.add.image(0, 140, 'jackpot4').setScale(0.6).setDepth(20).setAlpha(0),
            ],
            currentIndex: 0
        };

        this.staticTitles(0);
        this.makeFireBall();

        this.add.container(offsetX, isMobile ? -15 : 0, [
            ...this.titles, ...this.jackpotImages.images, this.olvera, this.logo
        ]);
    }

    increaseCountSpinClick() {
        if (++this.countSpinClick === 3) {
            this.animJackPot();
            this.countSpinClick = 0;
        }
    }

    hideJackPotsImages(bool) {
        this.jackpotImages.images.forEach(i => i.setVisible(bool))
    }

    animJackPot() {
        this.jackpotImages.images[this.jackpotImages.currentIndex].setScale(0.6).setY(140).setAlpha(0);
        this.jackpotImages.currentIndex !== 3 ? this.jackpotImages.currentIndex++ : this.jackpotImages.currentIndex = 0;

        this.jackpotImages.images[this.jackpotImages.currentIndex].setDepth(200);

        this.tweens.add({
            targets: this.jackpotImages.images[this.jackpotImages.currentIndex],
            scale: 0.96,
            y: 55,
            delay: 150,
            ease: 'linear',
            duration: 800
        });

        const next = this.jackpotImages.images[this.jackpotImages.currentIndex + 1] || this.jackpotImages.images[0];
        next.setDepth(100).setAlpha(0.5);

        this.tweens.add({
            targets: next,
            scale: 0.87,
            alpha: 1,
            delay: 150,
            ease: 'linear',
            duration: 800
        });
    }

    toggleTitlesVisibility(visible) {
        this.titles.forEach(i => i.setVisible(visible));
        this.olvera.setVisible(visible);
    }

    changeTitlesVisibility(value) {
        this.logo.setAlpha(value);
        this.toggleTitlesVisibility(value);
    }

    makeFireBall() {
        this.fireballMove({
            target: this.add.image(offsetX - 150, -100, 'fireBallLeft').setOrigin(0).setScale(0.9),
            x: -80,
            y: 220,
            delay: 2800,
            delayRepeat: 16000,
            duration: 2800
        });

        // Группа слева: маленький и большой

        this.fireballMove({
            target: this.add.image(offsetX - 150, -100, 'fireBallLeft').setOrigin(0).setScale(0.6),
            x: -80,
            y: Phaser.Math.Between(150, 200),
            delay: 15800,
            delayRepeat: 16000,
            duration: 1500
        });

        this.fireballMove({
            target: this.add.image(offsetX - 150, -100, 'fireBallLeft').setOrigin(0).setScale(0.75),
            x: -80,
            y: Phaser.Math.Between(150, 250),
            delay: 16000,
            delayRepeat: 16000,
            duration: 2000
        });

        // Группа справа: маленький и большой

        this.fireballMove({
            target: this.add.image(offsetX + 20, -100, 'fireBallRight').setOrigin(0).setScale(0.6),
            x: window.screen.width + 50,
            y: Phaser.Math.Between(150, 250),
            delay: Phaser.Math.Between(4900, 5200),
            delayRepeat: 18000,
            duration: 1500
        });

        this.fireballMove({
            target: this.add.image(offsetX + 20, -100, 'fireBallRight').setOrigin(0).setScale(0.75),
            x: window.screen.width + 50,
            y: Phaser.Math.Between(150, 250),
            delay: Phaser.Math.Between(4700, 5200),
            delayRepeat: 18000,
            duration: 2000
        });
    }

    fireballMove({target, x, y, delay = 0, delayRepeat = 0, duration}) {
        this.tweens.add({
            targets: target,
            x,
            y,
            ease: 'linear',
            delay: delay,
            repeatDelay: delayRepeat,
            duration: duration,
            repeat: -1,
        });
    }

    zoom(value, duration) {
        this.cameras.main.zoomTo(value, duration);
    }

    refreshScene() {
        this.scene.restart();
    }

    secondTitle() {
        const callback = () => {
            this.olvera.setAlpha(0);
            this.staticTitles(1);
        };

        this.olvera.play('olvera');
        this.olvera.once('animationcomplete', () => this.time.delayedCall(2000, callback, [], this));

        this.tweens.add({
            targets: this.olvera,
            scale: 0.55,
            alpha: 1,
            ease: 'linear',
            duration: 400
        });
    }

    staticTitles(current) {
        const callback = () => {
            this.titles[current].setAlpha(0).setScale(0.7);
            current ? this.staticTitles(0) : this.secondTitle();
        };

        this.tweens.add({
            targets: this.titles[current],
            scale: 0.96,
            alpha: 1,
            ease: 'linear',
            duration: 400,
            onCompleteScope: this,
            onComplete() {
                this.time.delayedCall(3600, callback, [], this);
            }
        });
    }
}

export {MainWindow}


