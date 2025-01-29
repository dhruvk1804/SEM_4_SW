const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
const aliensRemoved = new Set();
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;

// Grid setup
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

const alienInvaders = {
    basic: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ],
    fast: [
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]
};

function draw() {
    alienInvaders.basic.forEach((index, i) => {
        squares[index]?.classList[aliensRemoved.has(`basic-${i}`) ? 'remove' : 'add']("invader");
    });
    alienInvaders.fast.forEach((index, i) => {
        squares[index]?.classList[aliensRemoved.has(`fast-${i}`) ? 'remove' : 'add']("fast-invader");
    });
}

draw();
squares[currentShooterIndex].classList.add("shooter");

function remove() {
    squares.forEach(square => {
        square.classList.remove("invader", "fast-invader");
    });
}

function moveShooter(e) {
    const oldIndex = currentShooterIndex;
    switch (e.key) {
        case "ArrowLeft":
            if (oldIndex % width !== 0) currentShooterIndex--;
            break;
        case "ArrowRight":
            if (oldIndex % width < width - 1) currentShooterIndex++;
            break;
    }
    squares[oldIndex].classList.remove("shooter");
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    remove();
    
    // Boundary checks
    const basicLeft = alienInvaders.basic[0] % width === 0;
    const basicRight = alienInvaders.basic[alienInvaders.basic.length - 1] % width === width - 1;
    
    if ((isGoingRight && basicRight) || (!isGoingRight && basicLeft)) {
        direction *= -1;
        isGoingRight = !isGoingRight;
        alienInvaders.basic = alienInvaders.basic.map(idx => {
            const newIdx = idx + (isGoingRight ? width - 1 : width + 1);
            return newIdx < 225 ? newIdx : idx;
        });
    } else {
        alienInvaders.basic = alienInvaders.basic.map(idx => {
            const newIdx = idx + direction;
            return newIdx >= 0 && newIdx < 225 ? newIdx : idx;
        });
    }

    // Fast invaders movement
    alienInvaders.fast = alienInvaders.fast.map((idx, i) => {
        const newIdx = i % 2 === 0 ? idx + width : idx - width;
        return newIdx >= 0 && newIdx < 225 ? newIdx : idx;
    });

    // Collision detection
    const validInvaders = [
        ...alienInvaders.basic,
        ...alienInvaders.fast
    ].filter(idx => idx >= 0 && idx < 225);

    const gameOver = validInvaders.some(idx => 
        idx === currentShooterIndex || 
        Math.floor(idx / width) >= 14
    );

    if (gameOver) {
        resultDisplay.textContent = "GAME OVER";
        clearInterval(invadersId);
        return;
    }

    if (aliensRemoved.size === 30) {
        resultDisplay.textContent = "YOU WIN";
        clearInterval(invadersId);
        return;
    }

    draw();
}

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
    if (e.key !== "ArrowUp") return;
    
    let currentLaserIndex = currentShooterIndex;
    const laserId = setInterval(() => {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        
        if (currentLaserIndex < 0) {
            clearInterval(laserId);
            return;
        }

        squares[currentLaserIndex].classList.add("laser");
        
        // Direct position-based hit detection
        const basicHit = alienInvaders.basic.indexOf(currentLaserIndex);
        const fastHit = alienInvaders.fast.indexOf(currentLaserIndex);
        
        if (basicHit > -1 && !aliensRemoved.has(`basic-${basicHit}`)) {
            handleHit('basic', basicHit, currentLaserIndex, laserId);
        } else if (fastHit > -1 && !aliensRemoved.has(`fast-${fastHit}`)) {
            handleHit('fast', fastHit, currentLaserIndex, laserId);
        }
    }, 100);
}

function handleHit(type, index, position, laserId) {
    clearInterval(laserId);
    aliensRemoved.add(`${type}-${index}`);
    results++;
    resultDisplay.textContent = results;
    
    squares[position].classList.remove("laser");
    squares[position].classList.add("boom");
    setTimeout(() => squares[position].classList.remove("boom"), 100);
}

document.addEventListener('keydown', shoot);