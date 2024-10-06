let isJumping = false;
let isDead = false; // New state for the character's death
let treeMoving = null;
let score = 0; // Initialize score

document.getElementById('go-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('cover-container').style.display = 'none'; // Hide the cover
    document.getElementById('game-container').style.display = 'block'; // Show the game

    // Start the jumping action on key press
    document.addEventListener('keydown', function(event) {
        // Only allow jumping with space key and only if not jumping or dead
        if (event.code === 'Space' && !isJumping && !isDead) {
            jump();
        }
    });

    // Start the tree movement and score increment
    treeMoving = setInterval(createTree, 2000); // Move trees every 2 seconds
}

function jump() {
    isJumping = true; // Set jumping state
    const monkey = document.getElementById('character');

    // Initial upward jump
    monkey.style.bottom = '250px'; // Adjust jump height

    // Return to original position after some time
    setTimeout(() => {
        monkey.style.bottom = '100px'; // Reset to original position
        isJumping = false; // Allow for a new jump
    }, 500); // Increased duration to allow character to stay in the air a bit longer
}

function createTree() {
    const tree = document.getElementById('tree');

    // Randomize the tree's position
    let treePosition = Math.random() * 300 + 500; // Random position off the right side
    tree.style.right = `${treePosition}px`; // Set new position for the next tree

    // Move tree left across the screen
    const moveTreeInterval = setInterval(() => {
        let currentRight = parseInt(tree.style.right);

        // Increment score
        if (currentRight < 300 && currentRight > 0) {
            score += 1; // Increment score
            document.getElementById('score').innerText = `Score: ${score}`; // Update score display
        }

        if (currentRight < -100) {
            clearInterval(moveTreeInterval); // Stop when the tree is out of view
        } else {
            currentRight -= 2; // Move the tree left
            tree.style.right = `${currentRight}px`;
        }

        // Collision detection
        if (isCollision(tree) && !isDead) {
            die(); // Call the death function on collision
        }
    }, 20);
}

// Function to handle death
function die() {
    isDead = true; // Set death state
    const monkey = document.getElementById('character');
    monkey.classList.add('dead'); // Add 'dead' class for animation
    showDeathSplatter(); // Show splatter effect

    setTimeout(() => {
        alert(`Oops, you killed your Proboscis Monkey! YOU KILLED IT!!! RESTART! DO BETTER NEXT TIME!!!`);
        clearInterval(treeMoving); // Stop moving trees
        location.reload(); // Reload the page to restart
    }, 500); // Wait for the death animation before alerting
}

// Function to create splatter effect
function showDeathSplatter() {
    const splatterContainer = document.createElement('div');
    splatterContainer.id = 'screen-splatter';

    for (let i = 0; i < 20; i++) { // Create multiple splatter dots
        const splatter = document.createElement('div');
        splatter.classList.add('splatter');
        const size = Math.random() * 50 + 10; // Size between 10px and 60px
        splatter.style.width = `${size}px`;
        splatter.style.height = `${size}px`;
        splatter.style.top = `${Math.random() * window.innerHeight}px`; // Random vertical position
        splatter.style.left = `${Math.random() * window.innerWidth}px`; // Random horizontal position
        splatterContainer.appendChild(splatter);
    }

    document.body.appendChild(splatterContainer);
    splatterContainer.style.display = 'block'; // Show splatter
}

// Function to check collision
function isCollision(tree) {
    const monkey = document.getElementById('character');
    const monkeyRect = monkey.getBoundingClientRect();
    const treeRect = tree.getBoundingClientRect();

    return !(
        monkeyRect.right < treeRect.left ||
        monkeyRect.left > treeRect.right ||
        monkeyRect.bottom < treeRect.top ||
        monkeyRect.top > treeRect.bottom
    );
}
