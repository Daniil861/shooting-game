import Enemy from "./Enemy.js";

export default class HiveWale extends Enemy {
	constructor(game) {
		super(game);

		this.width = 400;
		this.height = 227;
		this.y = Math.random() * (this.game.height * 0.9 - this.height);

		this.image = document.getElementById('hiveWhale');
		this.frameY = 0;

		this.lives = 15;
		this.score = this.lives;

		this.type = 'hive';

		this.speedX = Math.random() * -1.2 - 0.2;
	}
}