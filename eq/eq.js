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

const eq = [audioCtx.createBiquadFilter(), audioCtx.createBiquadFilter()];

const connect = () => {
  source.connect(eq[0]);
  eq[0].connect(eq[1]);
  eq[1].connect(audioCtx.destination);

  document.getElementById("enabled").checked = true;
};

const disconnect = () => {
  source.disconnect();
  eq[0].disconnect();
  eq[1].disconnect();

  source.connect(audioCtx.destination);

  document.getElementById("enabled").checked = false;
};

// ****
connect();
// ****

const changeOption = (optionName, value, order) => {
  if (optionName === "type") {
    eq[order][optionName] = value;
  } else {
    eq[order][optionName].value = value;
  }
  document.getElementById(`${optionName}-value`).innerHTML = value;
};

[...document.querySelectorAll(".options-form input, .options-form select")].forEach((input) => {
  const handler = (event) => {
    const order = event.target.parentNode.parentNode.dataset.order;
    changeOption(event.target.name, event.target.value, order);
  };
  input.addEventListener("input", handler);
  input.addEventListener("change", handler);

  const order = input.parentNode.parentNode.dataset.order;
  console.log({ key: input.name, value: input.value });
  changeOption(input.name, input.value, order);
});
