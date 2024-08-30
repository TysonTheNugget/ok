// Define the boundary object
export const boundary = {
    x: 560,                 // Starting x position
    y: 25,                 // Starting y position
    width: 1600,           // Width of the rectangle (adjust as needed)
    height: 1000           // Height of the rectangle (adjust as needed)
};

// Function to draw the boundary rectangle
export function drawBoundary(ctx) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(boundary.x, boundary.y, boundary.width, boundary.height);
}

// Function to constrain character movement within the boundary
export function constrainCharacter(character) {
    // Ensure character stays within the defined boundary
    character.x = Math.max(boundary.x, Math.min(character.x, boundary.x + boundary.width - character.width * 4));
    character.y = Math.max(boundary.y, Math.min(character.y, boundary.y + boundary.height - character.height * 4));
}
