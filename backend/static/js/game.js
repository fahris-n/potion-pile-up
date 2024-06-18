// Constants
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

const SPAWN_BOUNDARY_LEFT = 10;
const SPAWN_BOUNDARY_RIGHT = 590;

const PLAYER_BOUNDARY_LEFT = 0;
const PLAYER_BOUNDARY_RIGHT = 530;

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

// Make sure player sprite stays within canvas boundaries
function playerBounds() {
    if (xPlayer > PLAYER_BOUNDARY_RIGHT) {
        xPlayer = PLAYER_BOUNDARY_RIGHT;
    }

    if (xPlayer < PLAYER_BOUNDARY_LEFT) {
        xPlayer = PLAYER_BOUNDARY_LEFT;
    }
};

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
        this.x = Math.floor(Math.random() * (SPAWN_BOUNDARY_RIGHT - SPAWN_BOUNDARY_LEFT) + SPAWN_BOUNDARY_LEFT);
        this.y = -30;
        this.width = 24;
        this.height = 32;
        this.spriteX = Math.floor(Math.random() * potionSpriteSheetCols);
        this.spriteY = Math.floor(Math.random() * potionSpriteSheetRows);
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
            this.reset();
        }
    }
}

function initPotions() {
    for (let i = 0; i < maxPotions; i++) {
        potions.push(new Potion());
    }
}

// Initialize game score and game lives
let gameScore = 10;
let gameLives = 3;


// Game animation loop
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Show score and lives in top right
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + gameScore, 10, 25);
    ctx.fillText("Lives: " + gameLives, 10, 50);

    // Update player position velocities for left and right
    xPlayer += vxr;
    xPlayer += vxl;

    // Update and draw character sprite
    let position = Math.floor(gameFrame/staggerFrames) % playerSpriteAnimations[playerState].loc.length;
    let frameX = playerSpriteWidth * position;
    let frameY = playerSpriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerImage, frameX, frameY, playerSpriteWidth, playerSpriteHeight, xPlayer, yPlayer, 86, 86)
    playerHitbox = {x: xPlayer + 6, y: yPlayer + 6, width: 75, height: 86};

    // Update and draw potions
    potions.forEach((potion) => {
        potion.update();
        potion.draw();
        potionHitbox = {x: potion.x, y: potion.y, width: potion.width, height: potion.height};

        // Collision detection
        if (playerHitbox.x > potionHitbox.x + potionHitbox.width || 
            playerHitbox.x + playerHitbox.width < potionHitbox.x || 
            playerHitbox.y > potionHitbox.y + potionHitbox.height || 
            playerHitbox.y + playerHitbox.height < potionHitbox.y
        ){
        if (potion.y >= CANVAS_HEIGHT) {
            gameLives --;
            potion.reset();
            console.log("Potion missed: Lost a life");
            console.log(gameLives);
        }
        } else {
            potion.reset();
            console.log("Collision detected: Score updated");
            gameScore ++;
            console.log(gameScore);
        };

    // This current way of increasing potion fall speed to increase difficulty is clunky and stupid, but it works
    // EDIT: gameLives wont update with this block of code included. Figure out why
        if (gameScore >= 10) {
            potion.speed = 3.5;
        }
        if (gameScore >= 25) {
            potion.speed = 5;
        }
        if (gameScore >= 50) {
            potion.speed = 5.5;
        }
});
    playerBounds();
    gameFrame++;
    requestAnimationFrame(animate);
};

//TODO
// [X] Fix these "phantom potions"
// [X] Add collision detection
// [X] Get potion to reset when collision detected 
// [X] Add potion caught tracker and potion dropped tracker
// [ ] Change potion fall speed based on potion caught tracker
// [X] Fix potions spawning on the far edges, making it hard to see them
// [X] Tighten potion spread 
// [X] Make is so that user cant move player sprite out of bounds of canvas
// [ ] Add GAME OVER functionality