import { drawSprite } from './drawSprite.js';
import { moveCharacter } from './moveCharacter.js';
import { handleKeyPress } from './handleKeyPress.js';
import { handleKeyRelease } from './handleKeyRelease.js';
import { animate } from './animate.js';
import { boundary } from './boundaries.js'; // Corrected path to the boundary file

const socket = io();
console.log('Connecting to server...');
socket.on('connect', () => {
    console.log('Connected to server with ID:', socket.id);
});

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false; // Disable image smoothing to preserve pixel art quality

let players = {};
let collision = {};

// Define the local character object
const character = {
    x: boundary.x + boundary.width / 2 - 16,
    y: boundary.y + boundary.height / 2 - 16,
    width: 32,
    height: 32,
    frameX: 0,
    speed: 5,
    direction: 'down',
    facingRight: true,
};

// Initialize keys object to track key states
const keys = {};

// Load the sprite sheet for character animations
const spriteSheet = new Image();
spriteSheet.src = 'assets/walkingfull.png'; // Update this path to your sprite sheet

// Ensure the sprite sheet is loaded before starting the animation
spriteSheet.onload = () => {
    console.log('Sprite sheet loaded successfully');
    animate(canvas, ctx, character, spriteSheet, keys); // Start the animation loop
};

spriteSheet.onerror = () => {
    console.error('Failed to load sprite sheet. Check the path and file.');
};

// Socket event listeners to handle server communication
socket.on('currentPlayers', (serverPlayers) => {
    console.log('Received current players:', serverPlayers); // Debugging log
    players = serverPlayers;
    drawGameState();
});

socket.on('currentBoundary', (serverBoundary) => {
    console.log('Received boundary:', serverBoundary); // Debugging log
    Object.assign(boundary, serverBoundary);
    drawGameState();
});

socket.on('currentCollision', (serverCollision) => {
    console.log('Received collision:', serverCollision); // Debugging log
    collision = serverCollision;
    drawGameState();
});

socket.on('newPlayer', (player) => {
    console.log('New player connected:', player); // Debugging log
    players[player.id] = player;
    drawGameState();
});

socket.on('playerMoved', (player) => {
    console.log('Player moved:', player); // Debugging log
    players[player.id] = player;
    drawGameState();
});

socket.on('playerDisconnected', (playerId) => {
    console.log('Player disconnected:', playerId); // Debugging log
    delete players[playerId];
    drawGameState();
});

// Function to draw the entire game state
function drawGameState() {
    console.log('Drawing game state:', players); // Debugging log
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the boundary
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(boundary.x, boundary.y, boundary.width, boundary.height);

    // Draw the collision object
    if (collision.image && collision.image.complete) {
        ctx.drawImage(collision.image, collision.x, collision.y, collision.width, collision.height);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(collision.x, collision.y, collision.width, collision.height);
    }

    // Draw all players with their animations
    Object.values(players).forEach((player) => {
        if (player && player.width && player.height) { // Ensure player object is valid
            console.log('Drawing player:', player); // Debugging log
            drawSprite(ctx, spriteSheet, player.frameX, player.frameY, player.x, player.y, player.width, player.height);
        } else {
            console.warn('Invalid player data:', player); // Warning log for invalid player data
        }
    });
}

// Set up event listeners for keyboard inputs
window.addEventListener('keydown', handleKeyPress(keys));
window.addEventListener('keyup', handleKeyRelease(keys));

// Emit movement data to the server
document.addEventListener('keydown', (event) => {
    let dx = 0;
    let dy = 0;
    let direction = '';

    if (event.key === 'ArrowLeft') {
        dx = -5;
        direction = 'left';
    } else if (event.key === 'ArrowRight') {
        dx = 5;
        direction = 'right';
    } else if (event.key === 'ArrowUp') {
        dy = -5;
        direction = 'up';
    } else if (event.key === 'ArrowDown') {
        dy = 5;
        direction = 'down';
    }

    if (dx !== 0 || dy !== 0) {
        console.log('Emitting player movement:', { dx, dy, direction }); // Debugging log
        socket.emit('playerMovement', { dx, dy, direction });
    }
});
