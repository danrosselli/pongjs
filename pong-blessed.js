const blessed = require('blessed');

const screen = blessed.screen({
    smartCSR: true,
    title: 'Pong Game',
    mouse: true  // Habilitar captura de eventos de mouse
});

class PongGame {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.paddleHeight = 4;
        this.score1 = 0;
        this.score2 = 0;
        this.intervalId = null;

        this.initUI();
    }

    initUI() {
        // Desenha as bordas
        this.topBorder = blessed.box({
            top: 0,
            left: 0,
            width: this.width,
            height: 1,
            style: { fg: 'white' },
            content: '█'.repeat(this.width)
        });

        this.bottomBorder = blessed.box({
            top: this.height - 1,
            left: 0,
            width: this.width,
            height: 1,
            style: { fg: 'white' },
            content: '█'.repeat(this.width)
        });

        this.leftBorder = blessed.box({
            top: 1,
            left: 0,
            width: 1,
            height: this.height - 2,
            style: { fg: 'gray' },
            content: '█'.repeat(this.height - 2)
        });

        this.rightBorder = blessed.box({
            top: 1,
            left: this.width - 1,
            width: 1,
            height: this.height - 2,
            style: { fg: 'gray' },
            content: '█'.repeat(this.height - 2)
        });

        // Cria a bola e adiciona as propriedades dx e dy como propriedades extras do objeto ball
        this.ball = Object.assign(blessed.box({
            width: 1,
            height: 1,
            top: Math.floor(this.height / 2),
            left: Math.floor(this.width / 2),
            style: { fg: 'green' },
            content: '█'
        }), {dx: 1, dy: 1} );

        // Cria as raquetes
        this.paddle1 = blessed.box({
            left: 1,
            width: 1,
            height: this.paddleHeight,
            top: Math.floor(this.height / 2) - 2,
            style: { fg: 'blue' },
            content: '████'
        });

        this.paddle2 = blessed.box({
            left: this.width - 2,
            width: 1,
            height: this.paddleHeight,
            top: Math.floor(this.height / 2) - 2,
            style: { fg: 'red' },
            content: '████'
        });

        this.score = blessed.box({
            top: this.height, // Posiciona o placar logo abaixo do campo de jogo
            left: 0, // Centraliza o placar horizontalmente
            width: this.width, // Ajuste a largura do placar conforme necessário
            height: 1,
            align: 'center',
            style: { fg: 'white' },
            content: `Blue: ${this.score1}          Red: ${this.score2}`
        });

        screen.append(this.topBorder);
        screen.append(this.bottomBorder);
        screen.append(this.leftBorder);
        screen.append(this.rightBorder);
        screen.append(this.ball);
        screen.append(this.paddle1);
        screen.append(this.paddle2);
        screen.append(this.score);
        screen.render();
    }

    draw() {
        // Move a bola usando dx e dy
        this.ball.left += this.ball.dx;
        this.ball.top += this.ball.dy;

        this.score.setContent(`Blue: ${this.score1}          Red: ${this.score2}`);
        screen.render();
    }

    update() {
        // Bounce off top and bottom
        if (this.ball.top <= 1 || this.ball.top >= this.height - 2) {
            this.ball.dy = -this.ball.dy;
        }

        // Ball out of bounds
        if (this.ball.left < 1) {
            this.score2++;
            this.resetBall();
        } else if (this.ball.left >= this.width - 2) {
            this.score1++;
            this.resetBall();
        }

        // Paddle collision
        if (this.ball.left === 2 && this.ball.top >= this.paddle1.top && this.ball.top < this.paddle1.top + this.paddleHeight) {
            this.ball.dx = -this.ball.dx;
        } else if (this.ball.left === this.width - 3 && this.ball.top >= this.paddle2.top && this.ball.top < this.paddle2.top + this.paddleHeight) {
            this.ball.dx = -this.ball.dx;
        }

        this.draw();
    }

    resetBall() {
        this.ball.left = Math.floor(this.width / 2);
        this.ball.top = Math.floor(this.height / 2);
        this.ball.dx = -this.ball.dx;
    }

    play() {
        this.intervalId = setInterval(() => {
            this.update();
        }, 100);
    }

    movePaddle(player, direction) {
        const paddle = player === 1 ? this.paddle1 : this.paddle2;
        if (direction === 'up' && paddle.top > 1) {
            paddle.top--;
        } else if (direction === 'down' && paddle.top < this.height - this.paddleHeight - 1) {
            paddle.top++;
        }
    }
}

const game = new PongGame(60, 20);
game.play();

screen.key(['w', 's', 'up', 'down', 'escape', 'q', 'C-c'], function(ch, key) {
    if (key.name === 'w') {
        game.movePaddle(1, 'up');
    } else if (key.name === 's') {
        game.movePaddle(1, 'down');
    } else if (key.name === 'up') {
        game.movePaddle(2, 'up');
    } else if (key.name === 'down') {
        game.movePaddle(2, 'down');
    } else if (key.name === 'escape' || key.name === 'c' || key.name === 'q') {
        return process.exit(0);
    }
});

// Captura o evento de scroll do mouse para movimentar a raquete da direita
screen.on('mouse', function(data) {
    if (data.action === 'wheelup') {
        game.movePaddle(2, 'up');  // Move a raquete da direita para cima
    } else if (data.action === 'wheeldown') {
        game.movePaddle(2, 'down');  // Move a raquete da direita para baixo
    }
});

screen.render();
