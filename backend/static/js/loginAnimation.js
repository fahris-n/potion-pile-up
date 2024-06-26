// Canvas setup
const canvas = document.getElementById('background-login-canvas');
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Potion setup
const potionSpritesheet = new Image();
potionSpritesheet.src = 'static/media/potions.png';

const potionWidth = 16;
const potionHeight = 24;

const spriteSheetCols = 16;
const spriteSheetRows = 10;

// Potion class to manage individual potions
class Potion {
    constructor() {
        this.x = Math.random() * CANVAS_WIDTH;
        this.y = -30;
        this.width = 24;
        this.height = 32;
        this.spriteX = Math.floor(Math.random() * spriteSheetCols);
        this.spriteY = Math.floor(Math.random() * spriteSheetRows);;
        this.speed = 2;
    }

    draw() {
        ctx.drawImage(
            potionSpritesheet,
            this.spriteX * potionWidth,
            this.spriteY * potionHeight,
            potionWidth,
            potionHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update() {
        this.y += this.speed;
        if (this.y > CANVAS_HEIGHT) {
            this.y = -10;
            this.x = Math.random() * CANVAS_WIDTH;
            this.spriteX = Math.floor(Math.random() * spriteSheetCols);
            this.spriteY = Math.floor(Math.random() * spriteSheetRows);
        }
    }
}

// Array to store multiple potions
let potions = [];
// Interval between potions in frames
const maxPotions = 1;

function addPotion() {
    potions.push(new Potion());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (potions.length < maxPotions) {
        addPotion();
    }

    // Update and draw each potion
    potions.forEach((potion) => {
        potion.update();
        potion.draw();
    });

    requestAnimationFrame(animate);
};
// Start animation
animate();