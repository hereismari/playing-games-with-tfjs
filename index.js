var webcamElement = document.getElementById('webcam');
let net;
const classifier = knnClassifier.create();

async function app() {
    // Load the model.
    net = await posenet.load(0.75);
  
    await setupWebcam();

    // Buttons
    const code = {
        0: {"key": "left", "code": 37, "symbol": "←"},
        1: {"key": "right", "code": 39, "symbol": "→"},
        2: {"key": "up", "code": 38, "symbol": "↑"},
        3: {"key": "down", "code": 40, "symbol": "↓"},
        4: {"key": "nothing", "code": "", "symbol": ""}
    };

    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');

    const videoHeight = 224;
    const videoWidth = 224;
    canvas.width = videoHeight;
    canvas.height = videoWidth;

  
    // Reads an image from the webcam and associates it with a specific class
    // index.
    const addExample = async function(classId) {
      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      //const activation = net.infer(webcamElement, 'conv_preds');
      let poses = [];
      const pose = await net.estimateSinglePose(webcamElement, 0.5, true, 16);
      poses.push(pose);

      console.log(pose);

      ctx.clearRect(0, 0, videoWidth, videoHeight);

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(webcamElement, 0, 0, videoWidth, videoHeight);
      ctx.restore();

      const minPartConfidence = 0.0;
      
      poses.forEach(({score, keypoints}) => {
        if (score >= 0) {
          drawSkeleton(keypoints, minPartConfidence, ctx, posenet);
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
      });

      var res = [];
      const keypoints = pose.keypoints;
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        const {y, x} = keypoint.position;
        res.push(x);
        res.push(y);
      }

      console.log(classId);
      // Pass the intermediate activation to the classifier.
      classifier.addExample(tf.tensor(res), classId);

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
        let poses = [];
        const pose = await net.estimateSinglePose(webcamElement, 0.5, true, 16);
        poses.push(pose);
  
        console.log(pose);
  
        ctx.clearRect(0, 0, videoWidth, videoHeight);
  
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-videoWidth, 0);
        ctx.drawImage(webcamElement, 0, 0, videoWidth, videoHeight);
        ctx.restore();
  
        const minPartConfidence = 0.5;
        
        poses.forEach(({score, keypoints}) => {
          if (score >= 0) {
            drawSkeleton(keypoints, minPartConfidence, ctx, posenet);
            drawKeypoints(keypoints, minPartConfidence, ctx);
          }
        });


      if (classifier.getNumClasses() > 0) {
        // Get the activation from mobilenet from the webcam.
        // const activation = net.infer(webcamElement, 'conv_preds');
        const pose = await net.estimateSinglePose(webcamElement, 0.5, true, 16);

        var res = [];
        const keypoints = pose.keypoints;
        for (let i = 0; i < keypoints.length; i++) {
          const keypoint = keypoints[i];
          const {y, x} = keypoint.position;
          res.push(x);
          res.push(y);
        }
      
        // Get the most likely class and confidences from the classifier module.
        const result = await classifier.predictClass(tf.tensor(res));
  
        //document.getElementById('console').innerText = `
        //  prediction: ${code[result.classIndex]['key']}\n
        //  probability: ${result.confidences[result.classIndex]}`;

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