// Canvas setup
const canvas = document.getElementById('background-login-canvas');
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Image setup
const potionSpritesheet = new Image();
potionSpritesheet.src = 'static/media/potions.png';

const spriteWidth = 16;
const spriteHeight = 26;
const spriteCount = 160;

let x = Math.random() * CANVAS_WIDTH;
let y = 0;

// function getRandomPotionIndex() {
//     return Math.floor(Math.random() * spriteCount);
// }

// function animate() {
//     ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

//     let x = Math.random() * CANVAS_WIDTH;

//     for (let i = 0; i < 160; i++) {
//         const potionIndex = getRandomPotionIndex();
//         const potionX = x + i * 20;
//         const potionY = i * 30;

//         ctx.drawImage(
//             potionSpritesheet,
//             potionIndex * spriteWidth,
//             0,
//             spriteWidth,
//             spriteHeight,
//             potionX,
//             potionY,
//             spriteWidth,
//             spriteHeight
//         );
//     }
//     requestAnimationFrame(animate);
// }

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(potionSpritesheet, 0, 0, spriteWidth, spriteHeight, x, y, spriteWidth ,spriteHeight);
    y++;
    if (y > CANVAS_HEIGHT) {
        y = 0;
        x = Math.random() * CANVAS_WIDTH;
    }
    requestAnimationFrame(animate);
}

animate();