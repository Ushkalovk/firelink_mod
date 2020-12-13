class Text extends Phaser.Scene {
    constructor() {
        super('Text')
    }

    formatBetText(bet) {
        return `${bet}`.split(/(?=(?:\d{3})+(?!\d))/).join(',');
    }

    setFont({link, x, y, text, font, color, size, originX = 0.5}) {
        return new Promise(resolve => {
            WebFont.load({
                custom: {
                    families: ['Swis721', 'impact', 'Oswald-Bold']
                },
                active() {
                    const textElem = link.add.text(x, y, text, {
                        fontFamily: font,
                        fontSize: size,
                        color
                    }).setOrigin(originX, 1);

                    resolve(textElem)
                }
            });
        });
    };
}

export {Text};
