import Player from "./Player.js";
import InputHandler from "./InputHandler.js";
import UI from "./UI.js";
import Angler1 from "./Angler1.js";
import Angler2 from "./Angler2.js";
import Background from "./Background.js";
import Lucky from "./Lucky.js";
import Particle from "./Particle.js";
import HiveWale from "./HiveWhale.js";
import Drone from "./Drone.js";
import SmokeExplosion from "./SmokeExplosion.js";
import FireExplosion from "./FireExplosion.js";

export default class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.keys = [];
		this.ammo = 20;
		this.maxAmmo = 50;
		this.ammoTimer = 0;
		this.ammoInterval = 350;

		this.enemies = [];
		this.enemyTimer = 0;
		this.enemyInterval = 2000;

		this.particles = [];

		this.explosions = [];

		this.gameOver = false;

		this.debug = false;

		this.score = 0;
		this.winningScore = 80;
		this.gameTime = 0;
		this.timeLimit = 30000;

		this.speed = 1;

		this.background = new Background(this);
		this.player = new Player(this);
		this.input = new InputHandler(this);
		this.ui = new UI(this);

	}

	update(deltaTime) {
		// Если игра не закончена по какому-то условию - добавляем текущее время игры
		if (!this.gameOver) this.gameTime += deltaTime;

		// Проверяем не закончилось ли время игры, если закончилось - завершаем игру
		if (this.gameTime > this.timeLimit) this.gameOver = true;

		this.background.update();
		this.background.layer4.update();
		this.player.update(deltaTime);

		// Система добавления патронов. Каждые пол секунды добавляем 1 патрон.
		// Если количество патронов не больше максимума - добавляем патрон
		if (this.ammoTimer > this.ammoInterval) {
			if (this.ammo < this.maxAmmo) this.ammo++;
			this.ammoTimer = 0;
		} else {
			this.ammoTimer += deltaTime;
		}

		this.particles.forEach(particle => particle.update());
		this.particles = this.particles.filter(particle => !particle.markedForDeletion);

		this.explosions.forEach(explosion => explosion.update(deltaTime));
		this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);

		this.enemies.forEach(enemy => {
			enemy.update();
			if (this.checkCollision(this.player, enemy)) {
				enemy.markedForDeletion = true;
				this.addExplosion(enemy);

				// Если враг разрушен - создаем частички шестеренок, имитируем что развалился на кусочки
				for (let i = 0; i < enemy.score; i++) {
					this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
				}
				if (enemy.type === 'lucky') this.player.enterPowerUp();
				else if (!this.gameOver) this.score--;
			}
			this.player.projectiles.forEach(projectile => {
				if (this.checkCollision(projectile, enemy)) {
					enemy.lives--;
					projectile.markedForDeletion = true;

					// Если пуля попала во врага - создаем одну частичку шестеренок, имитируем что развалился на кусочки
					this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));

					if (enemy.lives <= 0) {
						if (enemy.type === 'lucky') this.player.enterPowerUp();

						if (enemy.type === 'hive') {
							for (let i = 0; i < 5; i++) {
								this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height * 0.5));
							}
						}

						enemy.markedForDeletion = true;
						this.addExplosion(enemy);

						// Если враг разрушен - создаем частички шестеренок, имитируем что развалился на кусочки
						for (let i = 0; i < enemy.score; i++) {
							this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
						}

						if (!this.gameOver) this.score += enemy.score;

						// Проверяем условие победы - если набрали достаточное количество очков - выиграли
						if (this.score > this.winningScore) this.gameOver = true;
					}
				}
			})

		})

		this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

		// Добавляем врагов через определенный интервал
		if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
			this.addEnemy();
			this.enemyTimer = 0;
		} else {
			this.enemyTimer += deltaTime;
		}
	}

	draw(context) {
		this.background.draw(context);
		this.ui.draw(context);
		this.player.draw(context);

		this.particles.forEach(particle => particle.draw(context));

		this.enemies.forEach(enemy => {
			enemy.draw(context);
		})

		this.explosions.forEach(explosion => {
			explosion.draw(context);
		})

		// Отдельно отрисовываем один слой фона - для того чтобы этот фон был поверх всех спрайтов на странице
		this.background.layer4.draw(context);
	}

	addEnemy() {
		const randomize = Math.random();
		if (randomize < 0.3) this.enemies.push(new Angler1(this));
		else if (randomize < 0.6) this.enemies.push(new Angler2(this));
		else if (randomize < 0.8) this.enemies.push(new HiveWale(this));
		else this.enemies.push(new Lucky(this));
	}

	addExplosion(enemy) {
		const randomize = Math.random();
		if (randomize < 0.5) {
			this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
		} else {
			this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
		}
	}

	checkCollision(rect1, rect2) {
		return (
			rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y
		)
	}

}