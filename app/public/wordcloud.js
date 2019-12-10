const FONT = "Impact";
const SIZE = [800, 650];

function createWordCloud(WORDS) {
	WORDS = WORDS.sort((a, b) => a.count - b.count);
	const totalWords = WORDS.reduce((total, word) => total + word.count, 0);
	const layout = d3Cloud()
		.size(SIZE)
		.words(WORDS.map((word) => ({word: word.word, size: 30 + 5000 * word.count / totalWords, rotate: ~~(Math.random() * 2) * 90})))
		.padding(3)
		.rotate((d) => d.rotate)
		.font(FONT)
		.fontSize((d) => d.size)
		.on("end", draw);

	function draw(words) {
		console.log("Drawing wordcloud...");
		const div = d3.select("#wordcloud");
		div.html("");
		div.append("svg")
			.attr("width", layout.size()[0])
			.attr("height", layout.size()[1])
			.append("g")
			.attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
			.selectAll("text")
			.data(words)
			.enter().append("text")
			.style("font-size", (d) => d.size + "px")
			.style("font-family", FONT)
			// TODO use different colors to make everything pretty.
			.style("fill", "black")
			.attr("text-anchor", "middle")
			.attr("transform", (d) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
			.text((d) => d.word);
		console.log("Finished drawing wordcloud")
	}
	layout.start();
}

function pullData() {
	$.get("/api/analyse", (data) => {
		console.log(data);
		createWordCloud(data.wordcount);
		$("#sentiscore").text(`Your sentiment score is ${data.score}. ${data.score < 0 ? "You should be more happy" : "You are a wonderful person"}!`);
	}).fail((err) => {
		if (err.status === 404) {
			setTimeout(pullData, 3000);
		} else {
			console.error(err);
		}
	});
}

document.addEventListener("DOMContentLoaded", () => {
	pullData()
});
