const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 800;

const playerImage = new Image();
playerImage.src = 'static/media/wizard_shuffle_sheet.png'
const spriteWidth = 32;
const spriteHeight = 32;


function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(playerImage, 0, 0, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight)
    requestAnimationFrame(animate);
};
animate();
