import { moveCharacter } from './moveCharacter.js';
import { handleKeyPress } from './handleKeyPress.js';
import { handleKeyRelease } from './handleKeyRelease.js';
import { drawSprite } from './drawSprite.js';
import { animate } from './animate.js';
import { boundary } from './boundaries/boundaries.js';

// Initialize the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Disable image smoothing to preserve pixel art quality
ctx.imageSmoothingEnabled = false;

// Character object definition
const character = {
    x: boundary.x + boundary.width / 2 - 16, // Start character in the middle of the boundary
    y: boundary.y + boundary.height / 2 - 16,
    width: 32, // Original sprite width in pixels
    height: 32, // Original sprite height in pixels
    frameX: 0, // Starting frame
    speed: 5, // Character movement speed in pixels per frame
    direction: 'down',
    facingRight: true, // Tracks current facing direction
};

// Initialize keys object to track key states
const keys = {};

// Load sprite sheet and start animation
const spriteSheet = new Image();
spriteSheet.src = 'assets/walkingfull.png';
spriteSheet.onload = function () {
    animate(canvas, ctx, character, spriteSheet, keys);
};

// Set up event listeners with the keys object
window.addEventListener('keydown', handleKeyPress(keys));
window.addEventListener('keyup', handleKeyRelease(keys));
