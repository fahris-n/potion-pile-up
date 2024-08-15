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
const speedIncrementInterval = 5000;

let potionFallSpeed = 2;

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

// Setting player animation states
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
        this.speed = potionFallSpeed;
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
    }
}

function initPotions() {
    for (let i = 0; i < maxPotions; i++) {
        potions.push(new Potion());
    }
}

// Initialize game score and game lives
let gameScore = 0;
let gameLives = 3;
let lastSpeedIncrementTime = Date.now();

// Game animation loop
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    //var gameOver = false;

    // Show score and lives in top right
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + gameScore, 10, 25);
    ctx.fillText("Lives: " + gameLives, 10, 50);

    // Update player position velocities for left and right
    xPlayer += vxr;
    xPlayer += vxl;

    // Update and draw character sprite
	// These 'magic numbers' being added to the player hitbox are just to tune the hitbox, they aren't special besides that
    let position = Math.floor(gameFrame/staggerFrames) % playerSpriteAnimations[playerState].loc.length;
    let frameX = playerSpriteWidth * position;
    let frameY = playerSpriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerImage, frameX, frameY, playerSpriteWidth, playerSpriteHeight, xPlayer, yPlayer, 86, 86)
    let playerHitbox = {x: xPlayer + 6, y: yPlayer + 6, width: 75, height: 86};

    // Debug: Draw player hitbox
    ctx.strokeStyle = 'red';
    ctx.strokeRect(playerHitbox.x, playerHitbox.y, playerHitbox.width, playerHitbox.height);

    // Update and draw potions
    potions.forEach((potion) => {
        potion.update();
        potion.draw();
        let potionHitbox = {x: potion.x, y: potion.y, width: potion.width, height: potion.height};

        // Debug: Draw potion hitbox
        ctx.strokeStyle = 'blue';
        ctx.strokeRect(potionHitbox.x, potionHitbox.y, potionHitbox.width, potionHitbox.height);

        // Collision detection with less efficient method
        if (playerHitbox.x < potionHitbox.x + potionHitbox.width && 
            playerHitbox.x + playerHitbox.width > potionHitbox.x && 
            playerHitbox.y < potionHitbox.y + potionHitbox.height && 
            playerHitbox.y + playerHitbox.height > potionHitbox.y
        ){
            potion.reset();
            gameScore ++;
            console.log("Collision detected: Score updated");
            console.log("Score: " + gameScore);
        } else if (potion.y >= CANVAS_HEIGHT) {
            potion.reset();
            gameLives --;
            console.log("Potion missed: Lost a life");
            console.log("Lives: " + gameLives);
        };
    });

    // Increment on potion fall speed based on elapsed time
    if (Date.now() - lastSpeedIncrementTime >= speedIncrementInterval) {
        potionFallSpeed += 0.3;
        lastSpeedIncrementTime = Date.now();
        console.log("Potion speed increased: " + potionFallSpeed);
    }

    if (gameLives < 0) {
		gameOver();
		return; 
    }
	// Call playerBounds to make sure user cant move their sprite off screen
    playerBounds();
	// Increment on gameFrame to do something with the animations, I forget but I think its something to do with the scaling of the animation speed
    gameFrame++;
	// Animate frame by frame to run game 	
	requestAnimationFrame(animate);
};

// Game over function
function gameOver() {
	isGameOver = true;

	// Send score data to flask app using fetch API  
	fetch('/recieved_score', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({score: gameScore })
	})
	.then(response => response.json())
	.then(data => {
		// Handle the JSON data
		console.log('Data sent successfully to Flask server: ', data);
	})
		// Handle any errors that occured during the fetch 
	.catch((error) => {
		console.error('Error:', error);
	});

	// Draw transparent red rectangle over frozen game in game over state
	ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	console.log("Game Over"); 
	console.log("Total Score:", gameScore);

	// Display ' Game Over ' message
	ctx.font = '24px arial';
	ctx.fillStyle = 'white';
	ctx.fillText("Game Over! Press <Enter> to replay", 110, 400);

	// Add eventlistener for the user to hit the enter key at game over screen. Reload the window to reset that game and variables back to their default  
    document.addEventListener("keydown", function(e){
        if (e.code == "Enter"){
			window.location.reload();
        }
	});
};

//TODO
//CHAGNE BACK TO MORE EFFICIENT METHOD FOR THE HITBOX, I DONT THINK THE MORE EFFICIENT METHOD WAS THE REASON FOR THE LIFE TRACKING BUG, SO GO BACK TO IT 
// [X] Fix these "phantom potions"
// [X] Add collision detection
// [X] Get potion to reset when collision detected 
// [X] Add potion caught tracker and potion dropped tracker
// [X] Change potion fall speed based on elapsed time
// [X] Fix potions spawning on the far edges, making it hard to see them
// [X] Tighten potion spread 
// [X] Make is so that user cant move player sprite out of bounds of canvas
// [X] Add GAME OVER functionality
// [X] Make some sort of game over screen that appears, then have the user hit enter to play again
// 		[X] When gameOver = true, place a red color film over the game
// 		[X] Have the user hit enter or something to reload that game from a default setting 
// [ ] Track high scores and send new high scores to database for specific user. Pretty sure we use AJAX for this
// [ ] Make audio better, ie making music stop when the game is over and play a game over noise, have music
// 	   start back up when game is replayed
