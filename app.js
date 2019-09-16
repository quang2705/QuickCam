// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")

let recognizer; 

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

function triggerCam () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
};

async function app() {
    recognizer = speechCommands.create('BROWSER_FFT');
    // Make sure that the underlying model and metadata are loaded via HTTPS
    // requests.
    await recognizer.ensureModelLoaded();
    // See the array of words that the recognizer is trained to recognize.
    words = recognizer.wordLabels();
    recognizer.listen(({scores}) => {
        scores = Array.from(scores).map((s, i) => ({score: s, word: words[i]}));
        scores.sort((s1, s2) => s2.score - s1.score);
        prediction = scores[0].word
        console.log(prediction)
        if (prediction == "go") {
            triggerCam();
        }
    }, {
        includeSpectrogram: true,
        probabilityThreshold: 0.70
    });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function(){triggerCam()};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);

app();