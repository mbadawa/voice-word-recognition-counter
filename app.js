$(document).ready(function () {
	const $counter = $("#counter");
	const $startButton = $("#start");
	const $stopButton = $("#stop");
	const $resetButton = $("#reset");
	const $wordInput = $("#word");
	let counter = parseInt(localStorage.getItem("counter")) || 0;

	localStorage.getItem("word") && $wordInput.val(localStorage.getItem("word"));
	$counter.text(counter);

	// Check if the browser supports the Web Speech API
	if (
		!("webkitSpeechRecognition" in window) &&
		!("SpeechRecognition" in window)
	) {
		alert("Your browser does not support the Web Speech API");
		return;
	}

	// Initialize the SpeechRecognition object
	const SpeechRecognition =
		window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = new SpeechRecognition();

	recognition.continuous = true;
	recognition.interimResults = false;
	recognition.lang = "en-US";

	recognition.onresult = function (event) {
		const transcript = event.results[event.resultIndex][0].transcript
			.trim()
			.toLowerCase();
		const targetWord = $wordInput.val().trim().toLowerCase();
		if (transcript === targetWord) {
			counter++;
			$counter.text(counter);
			// Save the counter to the local storage
			localStorage.setItem("counter", counter);
		}
	};

	recognition.onerror = function (event) {
		console.error("Speech recognition error", event.error);
	};

	recognition.onend = function () {
		console.log("Speech recognition service disconnected");
	};

	$wordInput.on("change", function () {
		localStorage.setItem("word", $wordInput.val());
	});

	$startButton.on("click", function () {
		if ($wordInput.val().trim() === "") {
			alert("Please type a word to listen for.");
			return;
		}
		recognition.start();
	});

	$stopButton.on("click", function () {
		recognition.stop();
	});

	$resetButton.on("click", function () {
		counter = 0;
		$counter.text(counter);
		$wordInput.val("");
		localStorage.removeItem("word");
		localStorage.removeItem("counter");
		recognition.stop();
	});
});
