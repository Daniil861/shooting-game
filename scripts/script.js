
import Game from './Game.js';

window.addEventListener('load', () => {
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');

	canvas.width = 800;
	canvas.height = 500;

	const game = new Game(canvas.width, canvas.height);

	let lastTime = 0;

	// Анимационный цикл
	function animate(timeStamp) {
		// timeStamp - это время работы анимации с момента запуска функции

		// deltaTime - время отрисовки, или время кадра анимации
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;

		// В каждой перерисовке стираем текущую картинку в канвасе
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// отрисовываем новую картинку в канвас
		game.draw(ctx);
		game.update(deltaTime);

		// Запускаем цикл обновления анимации. По сути является движком игры.
		requestAnimationFrame(animate);
	}

	animate(0);

})