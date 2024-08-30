const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

let players = {}; // Object to store all connected players

// Define the boundary of the map
const boundary = {
    x: 0,
    y: 0,
    width: 800,
    height: 600
};

// Define the collision object
const collision = {
    x: 200, // Position of the collision object
    y: 200,
    width: 100, // Size of the collision object
    height: 100
};

// Function to check if a player collides with the collision object
function checkCollision(player) {
    return (
        player.x < collision.x + collision.width &&
        player.x + player.width > collision.x &&
        player.y < collision.y + collision.height &&
        player.y + player.height > collision.y
    );
}

// Function to constrain player movement within the boundary and handle collisions
function constrainPlayer(player) {
    // Ensure player stays within the defined boundary
    player.x = Math.max(boundary.x, Math.min(player.x, boundary.x + boundary.width - player.width));
    player.y = Math.max(boundary.y, Math.min(player.y, boundary.y + boundary.height - player.height));

    // Check for collisions and handle them
    if (checkCollision(player)) {
        player.x = player.prevX; // Revert to the previous position if colliding
        player.y = player.prevY;
    } else {
        player.prevX = player.x; // Update previous position if no collision
        player.prevY = player.y;
    }
}

app.use(express.static('public')); // Serve static files from the 'public' folder

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Initialize the player with all properties needed for animation
    players[socket.id] = {
        id: socket.id,
        x: 100, // Initial x position
        y: 100, // Initial y position
        width: 32, // Player width
        height: 32, // Player height
        frameX: 0, // Initial animation frame X
        frameY: 0, // Initial animation frame Y
        direction: 'down', // Initial direction
        speed: 5, // Player speed
        prevX: 100, // Previous x position
        prevY: 100  // Previous y position
    };

    console.log('Current players after connection:', players);

    // Send the current state to the new player
    socket.emit('currentPlayers', players);
    socket.emit('currentBoundary', boundary);
    socket.emit('currentCollision', collision);

    // Notify all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Handle player movement
    socket.on('playerMovement', (movementData) => {
        console.log('Received player movement from', socket.id, ':', movementData);
        const player = players[socket.id];
        if (player) {
            player.x += movementData.dx;
            player.y += movementData.dy;
            player.direction = movementData.direction; // Update player direction

            // Update animation frames based on direction
            if (movementData.direction === 'left' || movementData.direction === 'right') {
                player.frameX = (player.frameX + 1) % 4; // Cycle through frames 0 to 3
                player.frameY = movementData.direction === 'left' ? 1 : 2; // Set frame row for left or right
            } else if (movementData.direction === 'up' || movementData.direction === 'down') {
                player.frameX = (player.frameX + 1) % 4; // Cycle through frames 0 to 3
                player.frameY = movementData.direction === 'up' ? 3 : 0; // Set frame row for up or down
            }

            constrainPlayer(player); // Apply boundary and collision constraints
            console.log('Updated player position and animation:', player);

            // Emit the updated player position and animation to all clients
            io.emit('playerMoved', player);
        }
    });

    // Handle player disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
        console.log('Current players after disconnection:', players);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
