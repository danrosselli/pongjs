const readline = require('readline');

class PongGame {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ball = { x: Math.floor(width / 2), y: Math.floor(height / 2), dx: 1, dy: 1 };
        this.paddle1 = { y: Math.floor(height / 2) };
        this.paddle2 = { y: Math.floor(height / 2) };
        this.paddleHeight = 4;
        this.score1 = 0;
        this.score2 = 0;
    }

    draw() {
        console.clear();
        let output = '';

        // Desenhar linha superior
        output += '+' + '-'.repeat(this.width) + '+\n';

        for (let y = 0; y < this.height; y++) {
            let line = '|';
            for (let x = 0; x < this.width; x++) {
                if (x === this.ball.x && y === this.ball.y) {
                    line += 'O';
                } else if (x === 0 && y >= this.paddle1.y && y < this.paddle1.y + this.paddleHeight) {
                    line += '|';
                } else if (x === this.width - 1 && y >= this.paddle2.y && y < this.paddle2.y + this.paddleHeight) {
                    line += '|';
                } else {
                    line += ' ';
                }
            }
            line += '|';
            output += line + '\n';
        }

        // Desenhar linha inferior
        output += '+' + '-'.repeat(this.width) + '+\n';
        output += `   Player A: ${this.score1}` + ' '.repeat(this.width - 26) + `Player B: ${this.score2}\n`;
        console.log(output);
    }

    update() {
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Bounce off top and bottom
        if (this.ball.y < 0 || this.ball.y >= this.height) {
            this.ball.dy = -this.ball.dy;
        }

        // Ball out of bounds
        if (this.ball.x < 0) {
            this.score2++;
            this.resetBall();
        } else if (this.ball.x >= this.width) {
            this.score1++;
            this.resetBall();
        }

        // Paddle collision
        if (this.ball.x === 1 && this.ball.y >= this.paddle1.y && this.ball.y < this.paddle1.y + this.paddleHeight) {
            this.ball.dx = -this.ball.dx;
        } else if (this.ball.x === this.width - 2 && this.ball.y >= this.paddle2.y && this.ball.y < this.paddle2.y + this.paddleHeight) {
            this.ball.dx = -this.ball.dx;
        }
    }

    resetBall() {
        this.ball.x = Math.floor(this.width / 2);
        this.ball.y = Math.floor(this.height / 2);
        this.ball.dx = -this.ball.dx;
    }

    play() {
        setInterval(() => {
            this.update();
            this.draw();
        }, 100);
    }

    movePaddle(player, direction) {
        const paddle = player === 1 ? this.paddle1 : this.paddle2;
        if (direction === 'up' && paddle.y > 0) {
            paddle.y--;
        } else if (direction === 'down' && paddle.y < this.height - this.paddleHeight) {
            paddle.y++;
        }
    }
}

const game = new PongGame(60, 20);
game.play();

// Configura o readline para capturar as entradas do teclado
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.name === 'w') {
        game.movePaddle(1, 'up');
    } else if (key.name === 's') {
        game.movePaddle(1, 'down');
    } else if (key.name === 'up') {
        game.movePaddle(2, 'up');
    } else if (key.name === 'down') {
        game.movePaddle(2, 'down');
    } else if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === 'escape') {
        process.exit();
    }
});
