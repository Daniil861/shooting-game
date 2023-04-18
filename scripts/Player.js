import Projectile from "./Projectile.js";

export default class Player {
	constructor(game) {
		this.game = game;

		// Берем размеры исодя из натурального размера в спрайте
		this.width = 120;
		this.height = 190;

		// Стартовые координаты игрока
		this.x = 20;
		this.y = 100;

		this.speedY = 0;
		this.maxSpeed = 2;

		this.image = document.getElementById('player');

		this.frameX = 0; // позиция изображения в спрайте по оси x
		this.frameY = 0; // позиция изображения в спрайте по оси y
		this.maxFrame = 37; // это количество спрайтов в ряду

		this.projectiles = [];

		this.powerUp = false;
		this.powerUpTimer = 0;
		this.powerUpLimit = 10000;


	}

	update(deltaTime) {

		// Проверяем какая кнопка нажата (какая кнопка находится в массиве события нажатия кнопки) и меняем скорость передвижения героя
		if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
		else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
		else this.speedY = 0;

		this.y += this.speedY;

		// Не даем игроку опуститься ниже экрана
		if (this.y > this.game.height - this.height * 0.5) this.y = this.game.height - this.height * 0.5;
		else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;

		this.projectiles.forEach(projectile => {
			projectile.update();
		})

		// Проверяем - вылетела ли пуля за пределы экрана (помечена к удалению), если да - фильтруем массив пуль, удаляем помеченную
		// При каждой перерисовке обновляем массив пуль - оставляя только те у которых нет markedForDeletion = true
		this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);

		// Анимация спрайта
		if (this.frameX < this.maxFrame) this.frameX++;
		else this.frameX = 0;

		if (this.powerUp) {
			if (this.powerUpTimer > this.powerUpLimit) {
				this.powerUpTimer = 0;
				this.powerUp = false;
				this.frameY = 0;
			} else {
				this.powerUpTimer += deltaTime;
				this.frameY = 1;
				this.game.ammo += 0.1;
			}
		}
	}

	draw(context) {
		if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);

		this.projectiles.forEach(projectile => {
			projectile.draw(context);
		})

		context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);

		// ниже - пример использования когда картинка - спрайт
		// context.drawImage(this.image,sourceX, sourceY, sourceWidth,sourceHeight, this.x, this.y, this.width, this.height);
		// sourceX - позиция изображения в спрайте по оси x
		// sourceY - позиция изображения в спрайте по оси y
		// sourceWidth - ширина изображения
		// sourceHeight - высота изображения

	}

	shootTop() {
		if (this.game.ammo > 0) {
			this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
			this.game.ammo--;
		}
		if (this.powerUp) this.shootBottom(); // Если мы в состоянии powerUp - тогда стреляем и снизу
	}

	shootBottom() {
		if (this.game.ammo > 0) {
			this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
		}
	}

	enterPowerUp() {
		this.powerUp = true;
		this.powerUpTimer = 0;
		if (this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo;
	}
}