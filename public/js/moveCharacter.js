import { constrainCharacter } from './collision.js';

export function moveCharacter(character, keys) {
    let moving = false;

    // Store the character's current position before moving
    character.prevX = character.x;
    character.prevY = character.y;

    if (keys['ArrowLeft'] && keys['ArrowUp']) {
        character.x -= character.speed;
        character.y -= character.speed;
        character.direction = 'left';
        character.facingRight = false;
        moving = true;
    } else if (keys['ArrowLeft'] && keys['ArrowDown']) {
        character.x -= character.speed;
        character.y += character.speed;
        character.direction = 'left';
        character.facingRight = false;
        moving = true;
    } else if (keys['ArrowRight'] && keys['ArrowUp']) {
        character.x += character.speed;
        character.y -= character.speed;
        character.direction = 'right';
        character.facingRight = true;
        moving = true;
    } else if (keys['ArrowRight'] && keys['ArrowDown']) {
        character.x += character.speed;
        character.y += character.speed;
        character.direction = 'right';
        character.facingRight = true;
        moving = true;
    } else if (keys['ArrowLeft']) {
        character.x -= character.speed;
        character.direction = 'left';
        character.facingRight = false;
        moving = true;
    } else if (keys['ArrowRight']) {
        character.x += character.speed;
        character.direction = 'right';
        character.facingRight = true;
        moving = true;
    } else if (keys['ArrowUp']) {
        character.y -= character.speed;
        character.direction = 'up';
        moving = true;
    } else if (keys['ArrowDown']) {
        character.y += character.speed;
        character.direction = 'down';
        moving = true;
    }

    // Constrain character within the boundary and check for collisions
    constrainCharacter(character);

    character.moving = moving;
}
