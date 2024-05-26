// Canvas setup
const canvas = document.getElementById('background-login-canvas');
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Image setup
const potionSpritesheet = new Image();
potionSpritesheet.src = 'static/media/potions.png';

const spriteWidth = 16;
const spriteHeight = 24;

const spriteSheetCols = 16;
const spriteSheetRows = 10;

// Initialize x and y positions in spritesheet
let spriteSheetX = 0;
let spriteSheetY = 0;

// Initialize x (random) and y position on canvas
let x = Math.random() * CANVAS_WIDTH;
let y = 0;

// Function to animate the sprite
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(
        potionSpritesheet, 
        spriteSheetX * spriteWidth, 
        spriteSheetY * spriteHeight, 
        spriteWidth, 
        spriteHeight, 
        x, 
        y, 
        spriteWidth,
        spriteHeight
    );
    y+=1.5;
    // Reset sprite position at random x if it reaches bottom of screen. A different sprite skin will also be randomly chosen
    if (y > CANVAS_HEIGHT) {
        y = 0;
        x = Math.random() * CANVAS_WIDTH;
        spriteSheetX = Math.floor(Math.random() * spriteSheetCols);
        spriteSheetY = Math.floor(Math.random() * spriteSheetRows); 
    }
    requestAnimationFrame(animate);
}
animate();