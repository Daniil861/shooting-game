export default class UI {
	constructor(game) {
		this.game = game;
		this.fontSize = 25;
		this.fontFamily = 'Bangers';
		this.color = 'white';
	}

	draw(context) {
		context.save();
		context.fillStyle = this.color;

		// Добавляем тень тексту
		context.shadowOffsetX = 2;
		context.shadowOffsetY = 2;
		context.shadowColor = 'black';

		// Отображаем очки игры
		context.font = `${this.fontSize}px ${this.fontFamily}`;
		context.fillText(`Score: ${this.game.score}`, 20, 40);

		// Время игры
		const formattedTime = this.game.gameTime * 0.001;
		context.fillText(`Timer: ${formattedTime.toFixed(1)}`, 20, 100);

		// Сообщение о завершении игры
		if (this.game.gameOver) {
			context.textAlign = 'center';
			let message1;
			let message2;
			if (this.game.score > this.game.winningScore) {
				message1 = 'You win!';
				message2 = 'Well done!';
			} else {
				message1 = 'You lose!';
				message2 = 'Try again next time!';
			}

			context.font = `50px ${this.fontFamily}`;
			context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40);
			context.font = `25px ${this.fontFamily}`;
			context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40);
		}

		// Отображаем на экране количество доступных патронов
		if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
		for (let i = 0; i < this.game.ammo; i++) {
			context.fillRect(20 + 5 * i, 50, 3, 20);
		}

		context.restore();
	}
}