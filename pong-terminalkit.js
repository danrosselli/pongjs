const term = require('terminal-kit').terminal;

class PongGame {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.ball = { x: Math.floor(width / 2), y: Math.floor(height / 2), dx: 1, dy: 1 };
        this.paddle1 = { y: Math.floor(height / 2) - 2 };
        this.paddle2 = { y: Math.floor(height / 2) - 2 };
        this.paddleHeight = 4;
        this.score1 = 0;
        this.score2 = 0;
        this.intervalId = null;
    }

    draw() {
        term.clear();
        term.moveTo(1, 1);

        // Draw top border
        term.bold('█' + '█'.repeat(this.width) + '█\n');

        for (let y = 0; y < this.height; y++) {
            term('█');
            for (let x = 0; x < this.width; x++) {
                if (x === this.ball.x && y === this.ball.y) {
                    term.green('█');
                } else if (x === 1 && y >= this.paddle1.y && y < this.paddle1.y + this.paddleHeight) {
                    term.blue('█');
                } else if (x === this.width - 2 && y >= this.paddle2.y && y < this.paddle2.y + this.paddleHeight) {
                    term.red('█');
                } else {
                    term(' ');
                }
            }
            term('█\n');
        }

        // Draw bottom border
        term.bold('█' + '█'.repeat(this.width) + '█\n');
        term(`   Player A: ${this.score1}` + ' '.repeat(this.width - 26) + `Player B: ${this.score2}\n`);
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
        if (this.ball.x === 2 && this.ball.y >= this.paddle1.y && this.ball.y < this.paddle1.y + this.paddleHeight) {
            this.ball.dx = -this.ball.dx;
        } else if (this.ball.x === this.width - 3 && this.ball.y >= this.paddle2.y && this.ball.y < this.paddle2.y + this.paddleHeight) {
            this.ball.dx = -this.ball.dx;
        }
    }

    resetBall() {
        this.ball.x = Math.floor(this.width / 2);
        this.ball.y = Math.floor(this.height / 2);
        this.ball.dx = -this.ball.dx;
    }

    play() {
        term.hideCursor();
        this.intervalId = setInterval(() => {
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

term.grabInput({ mouse: 'button' });

term.on('key', (name, matches, data) => {
    if (name === 'w') {
        game.movePaddle(1, 'up');
    } else if (name === 's') {
        game.movePaddle(1, 'down');
    } else if (name === 'UP') {
        game.movePaddle(2, 'up');
    } else if (name === 'DOWN') {
        game.movePaddle(2, 'down');
    } else if (name === 'ESCAPE' || (data.isCharacter && data.code === 3)) {
        term.grabInput(false);
        term.hideCursor(false); // Show the cursor
        setTimeout(() => { process.exit(); }, 100);
    }
});
