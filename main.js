// Функция которая генерирует набор данных
// Набор данных - массив значений
// каждое из которых будет радиусом точки
function generateDataSet(amount, minSize, maxSize) {
	var result = [];
	var random = null;

	for( var i = 0; i < amount; i++ ) {
		var random = getRandom(minSize, maxSize);
		result.push(random);
	}
	return result;

}

//Рандом
function getRandom(min, max) {
	return Math.random() * (max - min) + min; 
}

// Инициализация
function ready() {
	var dataset = generateDataSet(100, 10, 20), // Набор данных
			svgHeight = window.innerHeight, // высота svg контейнера
			svgWidth = window.innerWidth; // ширина svg контейнера
			svg = d3.select('body') // контейнер
							.append('svg')
							.attr({
								height: svgHeight,
								width: svgWidth
							})
							.style('display', 'block')
							.style('margin', '0 auto'),
			// Для расставления точек используется странный
			// алгоритм { я уже после его написания понял, что он странный :)}
			// поле делится на 100 прямоугольников, в пределах каждого прямоугольника
			// ставится одна точка, например в прямоугольнике (10,10,20,20) 
			// точка рандомно поставится во ширене от 10 до 20 так же во высоте.
			// Если элементов больше 100, то расстановка точек пойдет сначала.
			// Собственно, ниже переменные для этого алгоритма
			horizontalSquare = svgWidth / 10, 
			verticalSquare = svgHeight / 10,
			oldX = 0,
			oldY = 0,
			currentX = horizontalSquare,
			currentY = verticalSquare;

	svg.selectAll('circle') // Генерируем на основе надора данных эоементы
		.data(dataset)
		.enter()
		.append('circle')
		.each(function(d, i) {
			// Расстанока точек в контейнере. Странный алгоритм.
			currentX = oldX + horizontalSquare;
			currentY = oldY + verticalSquare;

			var randomX = getRandom(oldX, currentX),
					randomY = getRandom(oldY, currentY);

			d3.select(this)
				.attr({
					fill: 'yellow',
					r: d,
					cx: function(d, i) {
						return randomX;
					},
					cy: function(d, i) {
						return randomY;
					} 
				})

			if( (i + 1) % 10 == 0) {
				oldY = currentY;
				oldX = 0;
			} else {
				oldX = currentX;
			}

			if( (i + 1) % 100 == 0) {
				oldY = 0;
			}

			console.log(currentX);
		})
		// Вешаем событие, которое сработает при наведении курсора
		.on('mouseover', function() { 
			d3.select(this)
				.transition()
				.duration(300)
				.ease('ease-out')
				.attr({
					// При наведении на точку она рандомно
					// отскочит
					cx: function(d) {
						var sign = Math.random() < 0.5 ? -1 : 1;
						return parseInt(this.getAttribute('cx')) + ((Math.random() * 100 + d)  * sign);
					},
					cy: function(d) {
						var sign = Math.random() < 0.5 ? -1 : 1;
						return parseInt(this.getAttribute('cy')) + ((Math.random() * 100 + d)  * sign);
					}
				})
		})

	// Запускаем анимацию
	svg.selectAll('circle').each(function() {
		var that = this,
				speed = getRandom(500, 1000);
		setTimeout(function animate(){

			var speed = getRandom(500, 1000),
			    currentFill = null;

			if( that.getAttribute('fill') === '#ffff00' ) {
				currentFill = '#ff0000';
			} else {
				currentFill = '#ffff00';
			}

			d3.select(that)
			.transition()
			.duration(speed)
			.ease('linear')
			.attr({
				cx: function(d) {
					var sign = Math.random() < 0.5 ? -1 : 1;
					return parseInt(that.getAttribute('cx')) + ((Math.random() * 100 + d)  * sign);
				},
				cy: function(d) {
					var sign = Math.random() < 0.5 ? -1 : 1;
					return parseInt(that.getAttribute('cy')) + ((Math.random() * 100 + d)  * sign);
				},
				fill: currentFill
			})
			setTimeout(animate, speed);
		}, speed)
	})
}

window.onload = function() {
	ready();
}

window.onresize = function(event){
	svg[0][0].setAttribute('width', this.innerWidth);
	svg[0][0].setAttribute('height', this.innerHeight);
};


