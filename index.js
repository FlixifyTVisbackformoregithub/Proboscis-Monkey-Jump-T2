let isJumping = false;
let isDead = false; // State for character's death
let treeMoving = null;
let score = 0; 
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

document.getElementById('go-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('cover-container').style.display = 'none'; 
    document.getElementById('game-container').style.display = 'block'; 
    document.getElementById('score').innerText = `Score: ${score}`; 
    document.getElementById('high-score').innerText = `High Score: ${highScore}`; 

    // Allow jumping on mouse click or press space key
    document.addEventListener('keydown', onJump);
    document.addEventListener('click', onJump);

    // Start the tree movement every 2 seconds
    treeMoving = setInterval(createTree, 2000); 
}

function onJump(event) {
    if ((event.code === 'Space' || event.type === 'click') && !isJumping && !isDead) {
        jump();
    }
}

function jump() {
    isJumping = true; 
    const monkey = document.getElementById('character');

    monkey.style.bottom = '250px'; // Jump up
    setTimeout(() => {
        monkey.style.bottom = '100px'; // Back down
        isJumping = false; 
    }, 500); // Duration of the jump
}

function createTree() {
    const tree = document.createElement('div'); // Create new tree element
    tree.id = 'tree'; // Set ID for tree
    document.getElementById('game-area').appendChild(tree); // Append to game area

    // Initial position of the new tree
    let treePosition = Math.random() * 300 + 500; 
    tree.style.right = `${treePosition}px`; 

    // Move tree left across the screen
    const moveTreeInterval = setInterval(() => {
        let currentRight = parseInt(tree.style.right);
        
        if (currentRight < 300 && currentRight > 0) {
            score += 1; 
            document.getElementById('score').innerText = `Score: ${score}`; 
        }

        if (currentRight < -100) {
            clearInterval(moveTreeInterval);
            document.getElementById('game-area').removeChild(tree); // Remove tree after moving out of view
        } else {
            currentRight -= 5; // Move the tree left
            tree.style.right = `${currentRight}px`;
        }

        // Collision detection
        if (isCollision(tree) && !isDead) {
            die();
        }
    }, 20);
}

function die() {
    isDead = true; 
    const monkey = document.getElementById('character');
    monkey.classList.add('dead'); 
    showBloodSplatter(); 

    setTimeout(() => {
        if (score > highScore) {
            highScore = score; 
            localStorage.setItem('highScore', highScore); 
        }
        alert(`Oops, you killed your Proboscis Monkey! YOU KILLED IT!!!\nFINAL SCORE: ${score}\nHIGH SCORE: ${highScore}\nRESTART! DO BETTER NEXT TIME!!!`);
        clearInterval(treeMoving); 
        location.reload(); 
    }, 1000); 
}

function showBloodSplatter() {
    const bloodSplatter = document.createElement('div');
    bloodSplatter.classList.add('blood-splatter');
    document.body.appendChild(bloodSplatter);
}

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
