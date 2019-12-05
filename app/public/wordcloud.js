const FONT = "Impact";
const SIZE = [300, 300];
// TODO get word frequency data from the server.
const WORDS = [
	{word: "Hello", count: 3},
	{word: "World", count: 4},
	{word: "here", count: 1},
	{word: "are", count: 2},
	{word: "some", count: 1},
	{word: "words", count: 6},
];


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

document.addEventListener("DOMContentLoaded", () => {
	layout.start();
});
