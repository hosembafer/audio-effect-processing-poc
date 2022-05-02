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

const connect = () => {
  source.connect(delayNode);
  delayNode.connect(audioCtx.destination);

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
  delayNode[optionName].value = value;
  document.getElementById(`${optionName}-value`).innerHTML = value;
};

[...document.querySelectorAll(".options-form input")].forEach((input) => {
  input.addEventListener("input", (event) => {
    changeOption(event.target.name, Number(event.target.value));
  });

  changeOption(input.name, Number(input.value));
});
