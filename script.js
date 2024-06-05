document.addEventListener('DOMContentLoaded', () => {
    const game = document.getElementById('game');
    const width = 10;
    const height = 10;
    const minesCount = 20;
    const cells = [];
    let gameOver = false;

    // Initialize the game board
    function init() {
        const mines = generateMines();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.dataset.mine = mines.includes(`${x},${y}`);
                cell.addEventListener('click', () => revealCell(cell));
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    flagCell(cell);
                });
                game.appendChild(cell);
                cells.push(cell);
            }
        }
    }

    // Generate random mines
    function generateMines() {
        const mines = new Set();
        while (mines.size < minesCount) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            mines.add(`${x},${y}`);
        }
        return mines;
    }

    // Reveal a cell
    function revealCell(cell) {
        if (gameOver || cell.classList.contains('revealed') || cell.classList.contains('flag')) return;
        cell.classList.add('revealed');
        if (cell.dataset.mine === 'true') {
            cell.classList.add('mine');
            gameOver = true;
            alert('Game Over!');
            return;
        }
        const minesAround = countMinesAround(cell);
        if (minesAround > 0) {
            cell.textContent = minesAround;
        } else {
            revealAdjacentCells(cell);
        }
    }

    // Flag a cell
    function flagCell(cell) {
        if (gameOver || cell.classList.contains('revealed')) return;
        cell.classList.toggle('flag');
    }

    // Count mines around a cell
    function countMinesAround(cell) {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const neighbor = cells.find(c => c.dataset.x == nx && c.dataset.y == ny);
                    if (neighbor && neighbor.dataset.mine === 'true') count++;
                }
            }
        }
        return count;
    }

    // Reveal adjacent cells
    function revealAdjacentCells(cell) {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const neighbor = cells.find(c => c.dataset.x == nx && c.dataset.y == ny);
                    if (neighbor && !neighbor.classList.contains('revealed')) revealCell(neighbor);
                }
            }
        }
    }

    init();
});