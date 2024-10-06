let isJumping = false;
let treeMoving = null;
let score = 0; // Initialize score

document.getElementById('go-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('cover-container').style.display = 'none'; // Hide the cover
    document.getElementById('game-container').style.display = 'block'; // Show the game

    // Start the jumping action on key press
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && !isJumping) {
            jump();
        }
    });

    // Start the tree movement and score increment
    treeMoving = setInterval(createTree, 2000); // Move trees every 2 seconds
}

function jump() {
    isJumping = true;
    const monkey = document.getElementById('character');
    
    // Initial upward jump
    monkey.style.bottom = '250px'; // Adjust jump height
    
    // Return to original position after some time
    setTimeout(() => {
        monkey.style.bottom = '100px'; // Reset to original position
        isJumping = false; // Allow for a new jump
    }, 300);
}

function createTree() {
    const tree = document.getElementById('tree');
    
    // Randomize the tree's position
    let treePosition = Math.random() * 300 + 500; // Random position off the right side
    tree.style.right = `${treePosition}px`; // Set new position for the next tree

    // Move tree left across the screen
    const moveTreeInterval = setInterval(() => {
        let currentRight = parseInt(tree.style.right);
        
        // Increment score as tree moves left (every 20 pixels)
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
        if (isCollision(tree)) {
            alert(`Game Over! Your final score is: ${score}`);
            clearInterval(treeMoving); // Stop moving trees
            location.reload(); // Reload the page to restart
        }
    }, 20);
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
