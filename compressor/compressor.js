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
const makeupGain = new GainNode(audioCtx);

const connect = () => {
  source.connect(compressor);
  compressor.connect(makeupGain);
  makeupGain.connect(audioCtx.destination);

  document.getElementById("enabled").checked = true;
};

const disconnect = () => {
  source.disconnect();
  compressor.disconnect();
  makeupGain.disconnect();

  source.connect(audioCtx.destination);

  document.getElementById("enabled").checked = false;
};

// ****
connect();
// ****

const dBToAmp = (dB) => Math.max(0, Math.pow(10, dB / 20));

const changeOption = (optionName, value) => {
  compressor[optionName].value = value;
  document.getElementById(`${optionName}-value`).innerHTML = value;
};

function add(accumulator, a) {
  return accumulator + a;
}

let listOfN = [];

const cancelAutoMakeupGain = () => {
  const reduction = compressor.reduction;
  // const reductionLinear = dBToAmp(reduction);
  // makeupGain.gain.value = reductionLinear;
  console.log({ reduction });

  listOfN.push(reduction);

  if (listOfN.length === 10) {
    const avg = listOfN.reduce(add, 0) / listOfN.length;
    console.log("SUM: " + avg);
    makeupGain.gain.value = dBToAmp(avg);
    listOfN = [];
  }

  // console.log(reduction);

  requestAnimationFrame(() => {
    cancelAutoMakeupGain();
  });
};

cancelAutoMakeupGain();

[...document.querySelectorAll(".options-form input")].forEach((input) => {
  input.addEventListener("input", (event) => {
    changeOption(event.target.name, Number(event.target.value));
  });

  changeOption(input.name, Number(input.value));
});
