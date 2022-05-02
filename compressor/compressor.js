const audioCtx = new AudioContext();
const sourceElement = document.getElementById("source");
const source = audioCtx.createMediaElementSource(sourceElement);
const dest = audioCtx.createMediaStreamDestination();
const audioTrack = dest.stream.getAudioTracks()[0];

sourceElement.addEventListener("play", () => {
  audioCtx.resume();
});

document.getElementById("enabled").addEventListener("change", (event) => {
  if (event.target.checked) {
    connect();
  } else {
    disconnect();
  }
});

// ****

const compressor = audioCtx.createDynamicsCompressor();

const connect = () => {
  source.connect(compressor);
  compressor.connect(audioCtx.destination);

  document.getElementById("enabled").checked = true;
};

const disconnect = () => {
  source.disconnect(compressor);
  compressor.disconnect(audioCtx.destination);

  source.connect(audioCtx.destination);

  document.getElementById("enabled").checked = false;
};

// ****
connect();
// ****

const changeOption = (optionName, value) => {
  compressor[optionName].value = value;
  document.getElementById(`${optionName}-value`).innerHTML = value;
};

[...document.querySelectorAll(".options-form input")].forEach((input) => {
  input.addEventListener("input", (event) => {
    changeOption(event.target.name, Number(event.target.value));
  });

  changeOption(input.name, Number(input.value));
});
