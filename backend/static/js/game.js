// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const playerSpriteWidth = 32;
const playerSpriteHeight = 32;

const staggerFrames = 12;

const potionWidth = 16;
const potionHeight = 24;
const potionSpriteSheetCols = 10;
const potionSpriteSheetRows = 16;
const maxPotions = 1
const potionInterval = 100;

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Player setup
const playerImage = new Image();
playerImage.src = 'static/media/wizard_shuffle_sheet.png'
let playerState = "moveLeft";
let xPlayer = 250;
let yPlayer = 715;
let vxr = 0;
let vxl = 0;
let gameFrame = 0;
const playerSpriteAnimations = [];
const playerAnimationStates = [
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
function createPlayerSpriteAnimations(){
    playerAnimationStates.forEach((state, index) => {
        let frames = {
            loc: [],
        };
        for (let i = 0; i < state.frames; i++) {
            let positionX = i * playerSpriteWidth;
            let positionY = index * playerSpriteHeight;
            frames.loc.push({x: positionX, y: positionY});
        }
        playerSpriteAnimations[state.name] = frames;
    });
}
// Initialize sprite animations
createPlayerSpriteAnimations();

// Event listeners for keyboard input for player control
function setupEventListeners(){
    addEventListener("keydown", function(e){
        if (e.code == "KeyD"){
            vxr = 2.5;
            playerState = "moveRight";
        }
        if (e.code == "KeyA"){
            vxl = -2.5;
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
let potions = [];

// Ensure images are loaded before animating
let imagesLoaded = 0;
potionSpritesheet.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        initPotions();
        animate();
    }
};
playerImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        initPotions();
        animate();
    }
};

// Potion class to manage individual potions
class Potion {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * CANVAS_WIDTH;
        this.y = -30;
        this.width = 24;
        this.height = 32;
        this.spriteX = Math.floor(Math.random() * potionSpriteSheetCols);
        this.spriteY = Math.floor(Math.random() * potionSpriteSheetRows);
        this.speed = 2;
    }

    draw() {
        // Draw debug rectangle
        // ctx.strokeStyle = 'red';
        // this.potionHitbox = ctx.strokeRect(this.x, this.y, this.width, this.height);

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
            this.reset();
        }
    }
}

function initPotions() {
    for (let i = 0; i < maxPotions; i++) {
        potions.push(new Potion());
    }
}

// Game animation loop
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Update player position
    xPlayer += vxr;
    xPlayer += vxl;

    // Update and draw potions
    potions.forEach((potion) => {
        potion.update();
        potion.draw();
        potionHitbox = {x: potion.x, y: potion.y, width: potion.width, height: potion.height};
    });

    // Update and draw character sprite
    let position = Math.floor(gameFrame/staggerFrames) % playerSpriteAnimations[playerState].loc.length;
    let frameX = playerSpriteWidth * position;
    let frameY = playerSpriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerImage, frameX, frameY, playerSpriteWidth, playerSpriteHeight, xPlayer, yPlayer, 86, 86)
    playerHitbox = {x: xPlayer + 6, y: yPlayer + 6, width: 75, height: 86};

    // Collision detection
    if (playerHitbox.x > potionHitbox.x + potionHitbox.width || 
        playerHitbox.x + playerHitbox.width < potionHitbox.x || 
        playerHitbox.y > potionHitbox.y + potionHitbox.height || 
        playerHitbox.y + playerHitbox.height < potionHitbox.y
    ){

    } else {
        console.log("Collision detected");
    };

    gameFrame++;
    requestAnimationFrame(animate);
};

//TODO
// Fix these "phantom potions" - DONE
// Tighten potion spread 
// Add potion caught tracker and potion dropped tracker
// Change potion fall speed based on potion caught tracker
