// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 800;

// Player setup
const playerImage = new Image();
playerImage.src = 'static/media/wizard_shuffle_sheet.png'

const spriteWidth = 32;
const spriteHeight = 32;
let playerState = "moveLeft";

let gameFrame = 0;
const staggerFrames = 12;

// Initialize position and velocity variables
let x = 250;
let y = 715;
let vxr = 0;
let vxl = 0;

const spriteAnimations = [];
const animationStates = [
    {
        name: 'moveLeft',
        frames: 3,
    },
    {
        name: 'moveRight',
        frames: 3,
    }
];

// Function to create sprite animations
function createSpriteAnimations(){
    animationStates.forEach((state, index) => {
        let frames = {
            loc: [],
        }
        for (let i = 0; i < state.frames; i++) {
            let positionX = i * spriteWidth;
            let positionY = index * spriteHeight;
            frames.loc.push({x: positionX, y: positionY});
        }
        spriteAnimations[state.name] = frames;
    });
}

// Initialize sprite animations
createSpriteAnimations();

// Event listeners for keyboard input
function setupEventListeners(){
    addEventListener("keydown", function(e){
        if (e.code == "KeyD"){
            vxr = 2;
            playerState = "moveRight";
        }
        if (e.code == "KeyA"){
            vxl = -2;
            playerState = "moveLeft";
        }
    });

    addEventListener("keyup", function(e){
        if (e.code == "KeyD") vxr = 0;
        if (e.code == "KeyA") vxl = 0;
    });
}

// Initialize event listeners
setupEventListeners();

// Animation loop
function animate() {
    x += vxr;
    x += vxl;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, x, y, 86, 86)

    gameFrame++;
    requestAnimationFrame(animate);
};

// Start animation
animate();