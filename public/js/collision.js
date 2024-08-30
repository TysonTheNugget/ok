import { boundary } from './boundaries.js'; // Import the current map boundary

// Load the image for the collision object
const collisionImage = new Image();
collisionImage.src = 'assets/rock.png'; // Path to your chosen image

// Define a single collision object with the image
export const collision = {
    x: boundary.x + 50,   // Initial x position (inside the boundary)
    y: boundary.y + 50,   // Initial y position (inside the boundary)
    width: 100,           // Default width (will be updated after the image loads)
    height: 100,          // Default height (will be updated after the image loads)
    image: collisionImage // Reference to the loaded image
};

// Adjust the size and ensure it stays within the boundary once the image loads
collisionImage.onload = () => {
    collision.width = collisionImage.width;
    collision.height = collisionImage.height;

    // Ensure collision object is always within the boundary
    collision.x = Math.min(
        boundary.x + boundary.width - collision.width,
        Math.max(boundary.x, collision.x)
    );
    collision.y = Math.min(
        boundary.y + boundary.height - collision.height,
        Math.max(boundary.y, collision.y)
    );
};

// Function to draw the boundary rectangle and collision image
export function drawBoundary(ctx) {
    // Draw the boundary rectangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(boundary.x, boundary.y, boundary.width, boundary.height);

    // Draw the collision object using the image
    if (collision.image.complete) { // Check if the image is loaded
        ctx.drawImage(collision.image, collision.x, collision.y, collision.width, collision.height);
    } else {
        // Fallback if the image is not loaded yet
        ctx.fillStyle = 'red';
        ctx.fillRect(collision.x, collision.y, collision.width, collision.height);
    }
}

// Function to check if the character collides with the collision object
export function checkCollision(character) {
    if (
        character.x < collision.x + collision.width &&
        character.x + character.width * 4 > collision.x &&
        character.y < collision.y + collision.height &&
        character.y + character.height * 4 > collision.y
    ) {
        return true; // Collision detected
    }
    return false; // No collision
}

// Function to constrain character movement within the boundary and avoid collisions
export function constrainCharacter(character) {
    // Ensure character stays within the defined boundary
    character.x = Math.max(boundary.x, Math.min(character.x, boundary.x + boundary.width - character.width * 4));
    character.y = Math.max(boundary.y, Math.min(character.y, boundary.y + boundary.height - character.height * 4));

    // Check for collisions and handle them
    if (checkCollision(character)) {
        // If there's a collision, push the character back to the previous position
        character.x = character.prevX;
        character.y = character.prevY;
    } else {
        // If no collision, update the previous position
        character.prevX = character.x;
        character.prevY = character.y;
    }
}
