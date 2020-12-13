import {game, offsetX, height, isMobile, gameWidth} from '../Config';

class FreeSpins extends Phaser.Scene {

    constructor() {
        super('FreeSpins');

        this.unlocksArray = [];

        this.allow = true;
        this.isPressSpinToStartClicked = false;
        this.allowNextSpin = true;
        this.isEndOfTheGame = false;
        this.freeSpinStart = false;

        this.tileWidth = 250;
        this.tileHeight = 138;

        this.array = Array.from({length: 18}, (_, index) => 60 + (250 * index));

        this.fireballNames = {
            '50x': 60,
            '75x': 810,
            '100x': 1060,
            '125x': 2060,
            '250x': 2560,
            '625x': 3810,
            'mini': 4310
        };

        this.spinsRemaining = 4;
        this.destroyedGlasses = 0;
    }

    create() {
        this.freeSpinStart = true;
        game.scene.keys['Panel'].updateButtonsFrames();

        this.cameras.main.setViewport(0, isMobile ? -15 : 0, gameWidth, height);
        this.time.delayedCall(game.scene.keys['Musics'].playSound('alarm').duration * 1000 - 150, this.createBigFireball, [], this);

        // нужна для наложения поверх основной рамки, для перекрытия выходящих за рамки фаерболлов
        this.frameWithoutShadowWithLines = this.add.image(offsetX, 857, 'frameWithoutShadowWithLines')
            .setScale(0.54)
            .setOrigin(0.5, 1)
            .setDepth(280)
            .setAlpha(0);

        // нужна для наложения поверх основной рамки, для перекрытия элементов
        this.frameWithoutShadowAndLines = this.add.image(offsetX, 857, 'frameWithoutShadowAndLines')
            .setScale(0.54)
            .setOrigin(0.5, 1)
            .setDepth(350)
            .setAlpha(0);
        this.secondFrame = this.add.sprite(offsetX, 857, 'secondFrame', 0)
            .setScale(0.54)
            .setOrigin(0.5, 1)
            .setDepth(100)
            .setAlpha(0);

        this.freeSpinText = this.add.image(offsetX, isMobile ? height - 138 : height - 134, 'freeSpinText').setScale(0.5).setAlpha(0);
        this.featureComplete = this.add.image(offsetX, 175, 'featureComplete').setDepth(600).setAlpha(0);
    }

    update() {
        if (this.isPressSpinToStartClicked) {
            this.getUnlockCells().forEach(cell => {
                if (cell.getData('isStart')) cell.tilePositionY -= 50;
            });

            !this.isEndOfTheGame && this.allowStart()
        }
    }

    hideElems(alpha) {
        game.scene.keys['MainWindow'].changeTitlesVisibility(alpha);
        game.scene.keys['Panel'].changeTextVisibility(alpha);
        game.scene.keys['Slots'].destroyCells();
        game.scene.keys['Slots'].hideFrame(0);
        this.secondFrame.setAlpha(1);
    }

    createMask(x, y) {
        const shape = this.make.graphics();

        shape.beginPath();
        shape.fillRect(x, y, 250, 74);

        return shape.createGeometryMask();
    }

    // создание огромного фаерболла, с этой анимации начинаются фриспины
    createBigFireball() {
        const bigFire = this.add.sprite(offsetX, -830, 'bigFire').setScale(1.5).setOrigin(0.5, 0).setDepth(500).play('bigFire');

        // создаём разовые ивенты, т.к. обычная функция повторилась бы в апдейте несколько раз
        this.events.once('runFrameAnim', () => this.runFrameAnim());
        this.events.once('hideElems', () => this.hideElems(0));

        this.tweens.add({
            targets: bigFire,
            y: height + 400,
            ease: 'linear',
            duration: game.scene.keys['Musics'].playSound('bigFire').duration * 1000 + 1500,
            onUpdateScope: this,
            onCompleteScope: this,

            onUpdate() {
                bigFire.y > 30 && game.scene.keys['MainWindow'].logo.setAlpha(0);
                bigFire.y > 150 && this.events.emit('hideElems');
                bigFire.y > 500 && this.events.emit('runFrameAnim');
            },
            onComplete() {
                bigFire.destroy();
                this.freeSpinText.setAlpha(1);
            }
        });
    }

    // анимация рамки
    runFrameAnim() {
        game.scene.keys['Musics'].playSound('createFrame');
        this.secondFrame.anims.play('secondFrame');

        this.secondFrame.once('animationcomplete', () => {
            this.frameWithoutShadowWithLines.setAlpha(1);
            this.frameWithoutShadowAndLines.setAlpha(1);
            this.createCells();
        });
    }

    createCells() {
        this.bgSound = game.scene.keys['Musics'].playSound('freeSpinsBg');

        this.spinsRemainingText = this.add.image(offsetX, height - 154, 'spinsRemaining', 0).setDepth(600).setScale(0.9);
        this.sparks();

        this.cells = this.add.group();

        // создаём ячейки
        for (let i = 0; i < 40; i++) {
            const y = this.array[Phaser.Math.Between(0, 17)]; // меняем сдвиг по y
            const cell = this.add.tileSprite(0, 0, this.tileWidth, this.tileHeight, 'secondBar')
                .setScale(0.53)
                .setTilePosition(0, y)
                .setDepth(this.isFireballOffset(y) ? 200 : 20); // над рамкой должны быть только фаерболлы

            cell.setData({isStart: false, isFireball: false});

            this.cells.add(cell);
        }

        // размещаем в пределах рамки
        Phaser.Actions.GridAlign(
            this.cells.getChildren(),
            {
                width: 5,
                height: 8,
                cellWidth: 109,
                cellHeight: 74,
                x: offsetX - 287,
                y: 190
            }
        );

        this.createUnlock();
    }

    // создание оверлеев поверх первых 4 строк
    createUnlock() {
        let numberLock = 4;
        let currentNumber = 4;

        const callback = (currentNumber) => {
            game.scene.keys['Musics'].playSound('block');
            const bg = this.add.image(0, 0, 'moreToUnlock').setScale(0.54);
            const lock = this.add.image(-90, -2, 'locks', numberLock).setOrigin(1, 0.5).setScale(0.47);

            lock.currentFrame = numberLock;

            this.unlocksArray[currentNumber - 1] = this.add.container(offsetX, 443 - (74 * (4 - currentNumber)), [bg, lock]).setDepth(310);
            numberLock += 4;

            // как только создали все 4 оверлея - показываем надпись "press to spin"
            currentNumber === 1 && this.time.delayedCall(300, this.createPressToSpinPicture, [], this);
        };

        this.time.addEvent({
            delay: 300,
            callback() {
                callback(currentNumber--);
            },
            repeat: 3,
            startAt: 0
        });
    }

    createPressToSpinPicture() {
        game.scene.keys['Panel'].pressToSpin.setVisible(true).setAlpha(0);

        const anim = this.tweens.add({
            targets: game.scene.keys['Panel'].pressToSpin,
            alpha: 1,
            ease: 'linear',
            duration: 350,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => {
            anim.stop();
            game.scene.keys['Panel'].pressToSpin.setVisible(false);
            this.isPressSpinToStartClicked = true;
        })
    }

    // по смещению тайлспрайта определяет остановилось на фаерболле или нет
    isFireballOffset(y) {
        const fireball = Object.entries(this.fireballNames).find(item => item[1] === y);

        return fireball && fireball[0]
    }

    setSpinsRemainingFrame(frame) {
        const quantityFrames = 4;
        const newFrame = !frame ? quantityFrames - --this.spinsRemaining : 0;

        if (frame) {
            this.sparks();
            this.spinsRemaining = 4;
        }

        if (newFrame > 3) {
            this.finishTheGame();

            return;
        }

        this.spinsRemainingText.setFrame(newFrame);
    }

    finishTheGame() {
        const featureCompleteSound = game.scene.keys['Musics'].playSound('featureComplete');

        this.bgSound.stop();
        this.isEndOfTheGame = true;

        this.tweens.add({
            targets: this.featureComplete,
            alpha: 1,
            ease: 'linear',
            duration: featureCompleteSound.duration * 1000 / 10,
            yoyo: true,
            repeat: 6,
            onCompleteScope: this,
            onComplete() {
                this.featureComplete.destroy();
                this.showWinnerElements();
            }
        });
    }

    setLockFrame() {
        const unlocksArray = this.unlocksArray.filter(row => row);

        if (unlocksArray.length) {
            unlocksArray.forEach(container => {
                const frame = --container.list[1].currentFrame;
                frame > 0 ? container.list[1].setFrame(frame) : this.destroyUnlockImages(container)
            });
        }
    }

    destroyUnlockImages(container) {
        this.destroyGlass(container.y);
        container.destroy();
        this.unlocksArray.pop();

        if (++this.destroyedGlasses === 4) {
            this.isEndOfTheGame = true;
        }
    }

    allowStart() {
        this.isEveryStop() && this.startSpin()
    }

    startSpin() {
        if (this.allow && this.allowNextSpin) {
            game.scene.keys['Musics'].playSound('fireLaser');
            this.allow = false;
            this.allowNextSpin = false;
            this.changeStart(true);
            this.events.once('increaseSpinClick', () => game.scene.keys['MainWindow'].increaseCountSpinClick());
            this.setSpinsRemainingFrame(false);

            this.time.delayedCall(2000, this.endSpin, [], this);
        }
    }

    createCellFire(x, y) {
        const cellFire = this.add.sprite(x, y, 'cellFire').setScale(0.36).setDepth(330).play('cellFire');
        cellFire.once('animationcomplete', cellFire.destroy);
    }

    createBlow(x, y) {
        const blow = this.add.sprite(x, y, 'blow').setScale(0.45).setDepth(500).play('blow');
        blow.once('animationcomplete', blow.destroy);
    }

    createBorderFire() {
        const borderFire = this.add.sprite(offsetX - 2, 445, 'borderFire').setScale(0.46).setDepth(400).play('borderFire');
        borderFire.once('animationcomplete', borderFire.destroy);
    }

    sparks() {
        game.scene.keys['Musics'].playSound('spinsRemaining');

        const sparks = this.add.sprite(offsetX, height - 155, 'sparks').setScale(0.57).setDepth(600).play('sparks');
        sparks.once('animationcomplete', sparks.destroy);
    }

    createExp(cell, fireballName) {
        const {x, y, height, scaleY} = cell;

        this.add.sprite(x, y - 7, fireballName)
            .setScale(0.53)
            .setDepth(250)
            .setMask(this.createMask(x - this.tileWidth / 2, y - (height * scaleY) / 2 - 2))
            .play(fireballName);

        const exp = this.add.sprite(x, y, 'exp').setScale(0.42).setDepth(290).play('exp');
        exp.once('animationcomplete', exp.destroy);

        cell.setVisible(false); // прячем тайлспрайт
    }

    destroyGlass(offsetY) {
        const glass = this.add.sprite(offsetX, offsetY, 'glass')
            .setScale(0.65, 0.55)
            .setDepth(600)
            .play('glass');

        glass.once('animationcomplete', () => {
            this.time.delayedCall(
                500,
                () => {
                    glass.destroy();
                    this.allow = true
                },
                [],
                this
            )
        });
    }

    flyingBalls(cell, resolve) {
        const x = [offsetX - 120, offsetX, offsetX + 120][Phaser.Math.Between(0, 2)]; // фаерболы могут лететь только в 3 точки
        const y = 150;

        const ball = this.add.sprite(cell.x, cell.y, cell.getData('fireball'))
            .setScale(0.53)
            .setDepth(500)
            .setAlpha(0);

        const tween = this.tweens.add({
            targets: ball,
            x: x,
            y: y,
            duration: 150,
            delay: 1300,
            onStartScope: this,
            onCompleteScope: this,

            onStart() {
                game.scene.keys['Musics'].playSound('fireBallPush');
                ball.setAlpha(1);
                this.createCellFire(cell.x, cell.y - 2);
                this.createBlow(x, y);
                this.createBorderFire();
            },
            onComplete() {
                ball.destroy();
                tween.stop();
                resolve()
            }
        });
    }

    showWinnerElements() {
        game.scene.keys['MainWindow'].hideJackPotsImages(false);

        const winner = this.add.image(0, isMobile ? 0 : -10, 'winner').setScale(1.2);
        const winnerDisplay = this.add.image(0, 75, 'winnerDisplay').setScale(0.95);
        this.add.container(offsetX, 45, [winner, winnerDisplay]);

        const callback = () => {
            this.freeSpinStart = false;
            game.scene.keys['OverlayWindow'].fade(this, false);
        };

        (async () => {
            for (const cell of this.getFireballs()) {
                await new Promise(resolve => this.flyingBalls(cell, resolve));
            }

            this.time.delayedCall(game.scene.keys['Musics'].playSound('freeSpinsEnd').duration * 1000 + 3000, callback, [], this)
        })();

        this.scaleWithYoyo(winner);
    }

    scaleWithYoyo(target) {
        this.tweens.add({
            targets: target,
            scale: 1.1,
            ease: 'linear',
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    };

    isEveryStop() {
        return this.cells.getChildren().every(cell => !cell.getData('isStart'))
    }

    getFireballs() {
        return this.cells.getChildren().filter(cell => cell.getData('fireball'));
    }

    getUnlockCells() {
        return this.cells.getChildren().filter(cell => !cell.getData('fireball'));
    }

    endSpin() {
        this.changeStart(false);
    }

    toggleCellMovement(cell, value) {
        cell.setData('isStart', value);
        this.tilePos(cell, value);
    }

    tilePos(cell, value) {
        game.scene.keys['Musics'].playSound('lineStop');

        const y = this.array[Phaser.Math.Between(0, 17)];
        cell.setTilePosition(0, y);

        const fireball = this.isFireballOffset(y);

        if (fireball && !value) {
            game.scene.keys['Musics'].playSound('fireDrop');
            cell.setData('fireball', fireball);
            this.createExp(cell, fireball);
            this.setLockFrame();
        } else {
            cell.setDepth(20);
        }
    }

    changeStart(value) {
        const quantityFireballs = this.getFireballs().length;
        const unlockCells = this.getUnlockCells();

        let index = 0;

        const callback = () => {
            this.toggleCellMovement(unlockCells[index], value);

            if (this.isEveryStop()) {
                this.allow = true;
                this.time.delayedCall(350, () => this.allowNextSpin = true, [], this);
                this.events.emit('increaseSpinClick');

                // если количество фаерболлов увеличилось, - увеличиваем spinsRemaining
                this.getFireballs().length - quantityFireballs > 0 && this.setSpinsRemainingFrame(true);

                this.isEndOfTheGame && this.finishTheGame();
            }

            index++;
        };

        value ?
            unlockCells.forEach(cell => this.toggleCellMovement(cell, value)) :
            this.time.addEvent({
                delay: 200,
                callback,
                repeat: unlockCells.length - 1,
                startAt: 0
            });
    }
}

export {FreeSpins};
