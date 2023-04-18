export default class Particle {
	constructor(game, x, y) {
		this.game = game;
		this.x = x;
		this.y = y;

		this.spriteSize = 50;
		this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);

		this.size = this.spriteSize * this.sizeModifier;

		this.speedX = Math.random() * 6 - 3;
		this.speedY = Math.random() * -15;
		this.angle = 0;
		this.va = Math.random() * 0.2 - 0.1;  // rotation speed

		this.gravity = 0.5;

		this.markedForDeletion = false;

		this.image = document.getElementById('gears');

		this.frameX = Math.floor(Math.random() * 3);
		this.frameY = Math.floor(Math.random() * 3);

		// Переменные для создания эффекта ударения об пол при падении частицы
		this.bounced = 0;
		this.bottomBounceBoundary = Math.random() * 80 + 60;
	}

	update() {
		this.angle += this.va;

		// Физика. С каждой перерисовкой у нас изменяется параметр скорости (расстояние на которое отклоняемся с каждой перерисовкой)
		// Получается эффект не линейного движения предмета, а как прыгает мяч.
		this.speedY += this.gravity;
		this.x -= this.speedX + this.game.speed;
		this.y += this.speedY;

		if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;

		// Создаем эффект отскока от пола - то есть частичка не просто летит вниз за пределы экрана, 
		// а летит вниз, ударяется об пол, немного подпрыгивает и снова летит вниз. Классный эффект.
		if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2) {
			this.bounced++;
			this.speedY *= -0.5;
		}
	}

	draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.angle);
		context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
		context.restore();
	}
}