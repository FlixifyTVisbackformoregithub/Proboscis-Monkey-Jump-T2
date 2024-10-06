let isJumping = false;
let isDead = false; // New state for the character's death
let treeMoving = null;
let score = 0; // Initialize score
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // Retrieve high score

document.getElementById('go-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('cover-container').style.display = 'none'; // Hide the cover
    document.getElementById('game-container').style.display = 'block'; // Show the game
    document.getElementById('score').innerText = `Score: ${score}`; // Initial score display
    document.getElementById('high-score').innerText = `High Score: ${highScore}`; // Display high score

    // Allow jumping on mouse click or press space key
    document.addEventListener('keydown', onJump);
    document.addEventListener('click', onJump);

    // Start the tree movement and score increment
    treeMoving = setInterval(createTree, 2000); // Move trees every 2 seconds
}

function onJump(event) {
    if ((event.code === 'Space' || event.type === 'click') && !isJumping && !isDead) {
        jump();
    }
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
    }, 500); // Duration of the jump
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
    showBloodSplatter(); // Show blood splatter effect

    setTimeout(() => {
        if (score > highScore) {
            highScore = score; // Update high score
            localStorage.setItem('highScore', highScore); // Save high score to local storage
        }
        alert(`Oops, you killed your Proboscis Monkey! YOU KILLED IT!!!\nFINAL SCORE: ${score}\nHIGH SCORE: ${highScore}\nRESTART! DO BETTER NEXT TIME!!!`);
        clearInterval(treeMoving); // Stop moving trees
        location.reload(); // Reload the page to restart
    }, 1000); // Wait for the death animation before alerting 
}

// Function to create blood splatter effect
function showBloodSplatter() {
    const bloodSplatter = document.createElement('div');
    bloodSplatter.classList.add('blood-splatter');

    document.body.appendChild(bloodSplatter);
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
