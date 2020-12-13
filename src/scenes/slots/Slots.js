import {offsetX, game, gameWidth, height, symbols, fireBalls, isMobile} from '../../Config';

class Slots extends Phaser.Scene {

    constructor() {
        super('Slots');

        this.cellPos = [
            [offsetX - 220, -35, ''],
            [offsetX - 220, 35, ''],
            [offsetX - 220, 110, ''],
            [offsetX - 220, 180, ''],
            [offsetX - 220, 255, ''],

            [offsetX - 115, -35, ''],
            [offsetX - 115, 35, ''],
            [offsetX - 115, 110, ''],
            [offsetX - 115, 180, ''],
            [offsetX - 115, 255, ''],

            [offsetX, -35, ''],
            [offsetX, 35, ''],
            [offsetX, 110, ''],
            [offsetX, 180, ''],
            [offsetX, 255, ''],

            [offsetX + 115, -35, ''],
            [offsetX + 115, 35, ''],
            [offsetX + 115, 110, ''],
            [offsetX + 115, 180, ''],
            [offsetX + 115, 255, ''],

            [offsetX + 220, -35, ''],
            [offsetX + 220, 35, ''],
            [offsetX + 220, 110, ''],
            [offsetX + 220, 180, ''],
            [offsetX + 220, 255, ''],
        ];

        this.allow = true;
        this.dropPicture = [];
        this.endSpinTimer = null;
        this.isStopClicked = false;

        this.cellBars = Array.from({length: 5}, () => {
            return {
                cells: [],
                bar: null,
                isStart: false,
                isAnimStart: false
            };
        });

        this.elems = [...symbols, ...fireBalls];
    }

    create() {
        this.elemsCam = this.cameras.add(0, isMobile ? -17 : 0, gameWidth, height);
        this.cameras.main.setViewport(0, isMobile ? 466 : 483, gameWidth, 300);

        this.frameWithoutShadow = this.add.image(offsetX, 461, 'frameWithoutShadow').setOrigin(0.5, 0).setScale(0.54).setDepth(500);
        this.frame = this.add.image(offsetX, -22, 'frame').setOrigin(0.5, 0).setScale(0.54);
        this.freeGamesFrame = this.add.image(offsetX, 465, 'frameWithoutBg').setOrigin(0.5, 0).setScale(0.54).setAlpha(0);

        this.cameras.main.ignore(this.frameWithoutShadow);
        this.elemsCam.ignore(this.frame);

        this.updateCells();
        this.createBars(false);
    }

    update() {
        this.allow && this.moveSprites();
        game.scene.keys['Panel'].buttonsClicked && game.scene.keys['Panel'].buttonsClicked.autoPlay && this.allowStart();
    }

    togglePageVisibility(value) {
        this.scene.setVisible(value);
    }

    createBars(isFreeGames) {
        this.cellBars.forEach((i, index) => {
            i.bar = this.add.tileSprite(
                offsetX - 220 + (111 * index),
                0,
                250,
                553,
                !isFreeGames ? 'cells' : 'freeGamesBar'
            ).setOrigin(0.5, 0).setScale(0.53).setVisible(false);

            this.elemsCam.ignore(i.bar);
        });
    }

    createFrameAfterBigWin() {
        const frame = this.add.image(offsetX, 464, 'frame').setOrigin(0.5, 0).setScale(0.54).setDepth(400);
        this.cameras.main.ignore(frame);

        return frame;
    }

    hideFrame(alpha) {
        this.frameWithoutShadow.setAlpha(alpha);
        this.frame.setAlpha(alpha);
    }

    randomElemsName() {
        this.cellPos.forEach((i, index) => {
            i[2] = `${
                this.elems[Phaser.Math.Between(
                    0,
                    index % 5 !== 0 ?
                        !game.scene.keys['FreeGames'].isFreeGamesStart ? this.elems.length - 1 : symbols.length - 2
                        : symbols.length - 2
                )]
            }`
        });
    }

    updateCells(isCertainElem) {
        this.randomElemsName();

        this.cells = this.cellPos.map((j, index) => {
            const isFireball = fireBalls.find(i => i === j[2]);
            const cell = this.add.sprite(
                j[0],
                j[1],
                isCertainElem && (index === 9 || index === 14 || index === 19) ?
                    `${isCertainElem}` :
                    j[2]
            ).setScale(0.53).setVisible(false).setDepth(isFireball ? 10 : 5);

            isFireball && !isCertainElem && cell.play(j[2]);
            this.elemsCam.ignore(cell);

            return cell;
        });

        this.cellBars.forEach((i, index) => {
            i.cells.forEach(i => i.destroy());
            i.cells = [...this.cells.slice(index * 5, (index + 1) * 5)];
        });
    }

    destroyCells() {
        this.cellBars.forEach(i => i.cells.forEach(i => i.destroy()));
    }

    allowStart(isCertainElem) {
        this.cellBars.every(i => !i.isStart) ?
            !this.endSpinTimer && this.startSpin(isCertainElem) :
            !game.scene.keys['Panel'].buttonsClicked.autoPlay && !this.isStopClicked && this.endSpin({time: 70});
    }

    playSound(index) {
        this.fireballSoundPlay(this.cellBars[index]);

        game.scene.keys['FreeGames'].isFreeGamesStart ?
            this.bellSoundPlay(this.cellBars[index]) :
            this.picSoundPlay(this.cellBars[index], index);

        game.scene.keys['Musics'].playSound('lineStop');
    }

    endSpin({isCertainElem = false, time}) {
        const quantityStartBars = this.cellBars.filter(bar => bar.isStart).length - 1;
        this.spinTimeOut.remove();
        this.endSpinTimer && this.endSpinTimer.remove();
        let index = (this.cellBars.length - 1) - quantityStartBars;

        const stopBar = () => {
            this.cellBars[index].isStart = false;

            if (index === this.cellBars.length - 1) {
                this.events.emit('increaseSpinClick');
                game.scene.keys['Panel'].updateButtonsFrames('spin', false);

                isCertainElem && this.animItems({
                    array: this.sortImagesByYOffset(isCertainElem),
                    isCertainElem,
                });

                game.scene.keys['Panel'].changeGoodLuckTitle(true, 200);
                this.time.delayedCall(500, () => this.endSpinTimer = null, [], this);

                game.scene.keys['FreeGames'].isFreeGamesStart && game.scene.keys['FreeGames'].isTheLastSpin();
            }

            !this.cellBars[index].isAnimStart && this.animMoveCells(index);

            index++;
        };

        this.endSpinTimer = this.time.addEvent({
            delay: time,
            callback: stopBar,
            repeat: quantityStartBars,
            startAt: 0
        });
    }

    startSpin(isCertainElem) {
        game.scene.keys['FreeGames'].isFreeGamesStart && game.scene.keys['FreeGames'].increaseCurrentSpin();
        game.scene.keys['Panel'].goodLuckAnim();
        this.events.once('increaseSpinClick', () => game.scene.keys['MainWindow'].increaseCountSpinClick());

        this.dropPicture.length = 0;
        this.isStopClicked = false;
        this.updateCells(isCertainElem);

        this.cellBars.forEach(i => i.isStart = true);

        this.spinTimeOut = this.time.delayedCall(1000, this.endSpin, [{isCertainElem, time: 300}], this);
    }

    getAllCells() {
        return this.cellBars.reduce((array, item) => [...array, ...item.cells], [])
    }

    sortImagesByYOffset(isCertainElem) {
        return this.getAllCells().filter(img => img.texture.key === `${isCertainElem}`);
    }

    animItems({array, isCertainElem}) {
        array.forEach(i => i.play(isCertainElem));
    }

    fireballSoundPlay(bar) {
        const hasFireball = (key) => !!fireBalls.find(name => `${name}` === key);
        const isFireball = bar.cells.some(item => hasFireball(item.texture.key) === true);

        isFireball && game.scene.keys['Musics'].playSound('fireShow');
    }

    bellSoundPlay(bar) {
        const bell = bar.cells.some(item => item.texture.key === 'bell');

        bell && game.scene.keys['Musics'].playSound('bell');
    }

    picSoundPlay(bar, index) {
        const picture = bar.cells.find(item => item.texture.key === 'picture');

        const addAndPlay = () => {
            this.dropPicture.push(picture);
            picture.play('picture');
        };

        if (picture) {
            if (index === 1 && !this.dropPicture.length) {
                addAndPlay();
                game.scene.keys['Musics'].playSound('pic1');
            } else if (index === 2 && this.dropPicture.length === 1) {
                addAndPlay();
                this.endSpinTimer.paused = true;

                this.time.delayedCall(
                    game.scene.keys['Musics'].playSound('pic2').duration * 1000,
                    () => this.endSpinTimer.paused = false,
                    [],
                    this
                );
            } else if (index === 3 && this.dropPicture.length === 2) {
                addAndPlay();
                this.time.delayedCall(1000, this.createFreeGamesElems, [], this);

                game.scene.keys['Panel'].updateButtonsFrames('autoPlay', false);
                game.scene.keys['FreeGames'].togglePageVisibility(true);
                game.scene.keys['Musics'].playSound('pic3');
            }
        }
    }

    createFreeGamesElems() {
        const freeGames = this.dropPicture.map(i => {
            const elem = this.add.sprite(i.x, i.y - 3, 'freeGames')
                .setScale(0.53)
                .setDepth(200)
                .play('freeGames');

            this.elemsCam.ignore(elem);

            return elem;
        });

        freeGames[freeGames.length - 1].on('animationcomplete', () => {
            freeGames.forEach(i => i.destroy());
            game.scene.keys['FreeGames'].moveToFreeGames();
        });
    }

    animMoveCells(index) {
        this.cellBars[index].isAnimStart = true;

        this.tweens.add({
            targets: this.cellBars[index].cells,
            y: '+=35',
            ease: 'linear',
            duration: 150,
            yoyo: true,
            onStartScope: this,
            onCompleteScope: this,

            onStart() {
                this.playSound(index);
            },
            onComplete() {
                this.cellBars[index].isAnimStart = false;
            }
        });
    }

    moveSprites() {
        this.cellBars.forEach(item => {
            item.cells.forEach(j => j.setVisible(!item.isStart));
            item.bar.setVisible(item.isStart);
            item.bar.tilePositionY -= item.isStart ? 80 : 0
        });
    }
}

export {Slots};
