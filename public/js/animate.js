import { drawSprite } from './drawSprite.js';
import { moveCharacter } from './moveCharacter.js';
import { drawBoundary } from './collision.js';

export function animate(canvas, ctx, character, spriteSheet, keys) {
    // Clear the canvas before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the boundary and collision objects
    drawBoundary(ctx);

    // Move the character based on input
    moveCharacter(character, keys);

    // Define frame sequences for character animations
    const frameSequence = {
        right: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
        up: [11, 12], 
        down: [13, 14]
    };
    
    // Select the frame sequence based on character direction
    const sequence = frameSequence[character.direction];
    const frameIndex = Math.floor(Date.now() / 100) % sequence.length;

    // Update the character's frame for animation
    if (character.moving) {
        character.frameX = sequence[frameIndex];
    } else {
        character.frameX = 0;
    }

    // Draw the character sprite with the updated frame
    drawSprite(ctx, spriteSheet, character.frameX, character.x, character.y, !character.facingRight);

    // Continue the animation loop
    requestAnimationFrame(() => animate(canvas, ctx, character, spriteSheet, keys));
}
