const audioCtx = new AudioContext();
const sourceElement = document.getElementById("source");
const source = audioCtx.createMediaElementSource(sourceElement);

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

const delayNode = audioCtx.createDelay();
const feedbackNode = audioCtx.createGain();

const dryNode = audioCtx.createGain();
const wetNode = audioCtx.createGain();

const connect = () => {
  source.connect(delayNode);
  delayNode.connect(feedbackNode);
  feedbackNode.connect(wetNode);
  wetNode.connect(delayNode);
  // delayNode.connect(wetNode);
  wetNode.connect(audioCtx.destination);

  source
    .connect(dryNode)
    .connect(audioCtx.destination);

  document.getElementById("enabled").checked = true;
};

const disconnect = () => {
  source.disconnect(delayNode);
  delayNode.disconnect(audioCtx.destination);

  source.connect(audioCtx.destination);

  document.getElementById("enabled").checked = false;
};

// ****
connect();
// ****

const changeOption = (optionName, value) => {
  // delayNode[optionName].value = value;
  if (optionName === "delayTime") {
    delayNode.delayTime.value = value / 1000;
  }
  if (optionName === "feedback") {
    feedbackNode.gain.value = value / 100;
  }
  if (optionName === "dry_wet") {
    dryNode.gain.value = 1 - (value / 100);
    wetNode.gain.value = value / 100;
  }
  document.getElementById(`${optionName}-value`).innerHTML = value;
};

[...document.querySelectorAll(".options-form input")].forEach((input) => {
  input.addEventListener("input", (event) => {
    changeOption(event.target.name, Number(event.target.value));
  });

  changeOption(input.name, Number(input.value));
});
