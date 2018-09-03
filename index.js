var webcamElement = document.getElementById('webcam');
let net;
const classifier = knnClassifier.create();

async function app() {
    // Load the model.
    net = await mobilenet.load();
  
    await setupWebcam();

    // Buttons
    const code = {
        0: {"key": "left", "code": 37, "symbol": "←"},
        1: {"key": "right", "code": 39, "symbol": "→"},
        2: {"key": "up", "code": 38, "symbol": "↑"},
        3: {"key": "down", "code": 40, "symbol": "↓"},
        4: {"key": "nothing", "code": "", "symbol": ""}
    };
  
    // Reads an image from the webcam and associates it with a specific class
    // index.
    const addExample = classId => {
      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(webcamElement, 'conv_preds');
  
      // Pass the intermediate activation to the classifier.
      classifier.addExample(activation, classId);

      // Number of samples in each class
      let exampleCount = classifier.getClassExampleCount();

      // Update text about the button
      let button_text = document.getElementById('text-' + code[classId]['key']);
      button_text.innerText = `${exampleCount[classId]} examples`;
    };

    // When clicking a button, add an example for that class.
    for (let c in code) {
        let button = document.getElementById(code[c]['key']);
        button.addEventListener('click', () => addExample(parseInt(c)));
        button.className += 'beaut-button';
        button.innerText = code[c]['symbol'] + ' ' + code[c]['key'];

        let button_text = document.getElementById('text-' + code[c]['key']);
        button_text.innerText = 'No examples given';
    }

    while (true) {
      if (classifier.getNumClasses() > 0) {
        // Get the activation from mobilenet from the webcam.
        const activation = net.infer(webcamElement, 'conv_preds');
        // Get the most likely class and confidences from the classifier module.
        const result = await classifier.predictClass(activation);
  
        document.getElementById('console').innerText = `
          prediction: ${code[result.classIndex]['key']}\n
          probability: ${result.confidences[result.classIndex]}`;

        for (c in code) {
            let button_text = document.getElementById('text-' + code[c]['key']);
            if (c == result.classIndex) {
                button_text.style.fontWeight = 'bold';
            } else {
                button_text.style.fontWeight = 'normal';
            }
        }
      
        var keyUpFunction = function(code) {
            var e2 = document.createEvent('Event');
            e2.initEvent('keyup', true, true);
            e2.keyCode = code[parseInt(result.classIndex)]['code'];
            document.dispatchEvent(e2);
        }

        if (result.classIndex != 4) {
            var e = document.createEvent('Event');
            e.initEvent('keydown', true, true);
            e.keyCode = code[parseInt(result.classIndex)]['code'];
            document.dispatchEvent(e);

            setTimeout(keyUpFunction, 100, code);
        }
      }

      // Avoid really movements in the game
      await sleep(200);
  
      await tf.nextFrame();
    }
}

async function setupWebcam() {
    webcamElement = document.getElementById('webcam');
    console.log(webcamElement);

    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          },
          error => reject());
      } else {
        reject();
      }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

app();