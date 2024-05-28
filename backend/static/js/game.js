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

// Initialize position and velocity variables for player
let xPlayer = 250;
let yPlayer = 715;
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

// Function to create character sprite animations
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
            this.y = -30;
            this.x = Math.random() * CANVAS_WIDTH;
            this.spriteX = Math.floor(Math.random() * spriteSheetCols);
            this.spriteY = Math.floor(Math.random() * spriteSheetRows);
        }
    }
}

// Array to store multiple potions
let potions = [];
// Interval between potions in frames
const potionInterval = 1000;

function addPotion() {
    potions.push(new Potion());
}

// Game animation loop
function animate() {
    xPlayer += vxr;
    xPlayer += vxl;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Add new potions at intervals
    if (gameFrame % potionInterval === 0) {
        addPotion();
    }

    // Update and draw each potion
    potions.forEach((potion) => {
        potion.update();
        potion.draw();
    });

    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, xPlayer, yPlayer, 86, 86)

    gameFrame++;
    requestAnimationFrame(animate);
};

// Start game animation
animate();

//TODO
// Tighten potion spread 
// Add potion caught tracker and potion dropped tracker
// Change potion fall speed based on potion caught tracker
