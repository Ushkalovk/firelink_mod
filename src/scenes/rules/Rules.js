import {height} from "../../Config";
import {offsetX} from '../../Config';
import {classes} from "./buttons/buttonInstances";
import {buttonsOptions} from "./buttons/buttonsOptions";
import {imagesOptions} from "./imagesOptions";

class Rules extends Phaser.Scene {
    constructor() {
        super('Rules');

        this.currentPage = 0;
    }

    create() {
        const {page, buttonsBg} = imagesOptions;

        // Создаём картинки правил
        this.pageImages = Array.from({length: 4}, (_, index) => {
            return this.add.image(page.x, page.y, `page_${index + 1}`)
                .setScale(page.scale)
                .setVisible(!index);
        });


        // Создаём фон
        const bg = this.add.image(buttonsBg.x, buttonsBg.y, 'rulesButtonsBg')
            .setOrigin(buttonsBg.origin.x, buttonsBg.origin.y)
            .setScale(buttonsBg.scale);


        // Создаём кнопки
        const buttons = Object.entries(buttonsOptions).map(option => {
            const {x, y, scale} = option[1];

            return this.add.existing(new classes[option[0]](this, x, y, {x: scale, y: scale}));
        });

        this.add.container(offsetX, height, [bg, ...this.pageImages, ...buttons]);

        this.togglePageVisibility(false);
    }

    togglePageVisibility(value) {
        this.scene[value ? 'wake' : 'sleep']();
        this.scene.setVisible(value);
    }

    // меняем текущую картинку
    changeCurrentPage(next) {
        this.pageImages[this.currentPage].setVisible(false);

        if (next) {
            this.currentPage < 3 ? this.currentPage++ : this.currentPage = 0;
        } else {
            this.currentPage > 0 ? this.currentPage-- : this.currentPage = 3;
        }

        this.pageImages[this.currentPage].setVisible(true);
    }
}

export {Rules};
