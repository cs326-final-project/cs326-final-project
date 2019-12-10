const FONT = "Impact";
const SIZE = [300, 300];

function createWordCloud(WORDS) {
	const totalWords = WORDS.reduce((total, word) => total + word.count, 0);
	const layout = d3Cloud()
		.size(SIZE)
		.words(WORDS.map((word) => ({word: word.word, size: 10 + 80 * word.count / totalWords})))
		.padding(3)
		.rotate(0)
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
			.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
			.text((d) => d.word);
		console.log("Finished drawing wordcloud")
	}
	layout.start();
}

function pullData() {
	$.get("/api/analyse", (words) => {
		console.log(words);
		createWordCloud(words.wordcount);
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
