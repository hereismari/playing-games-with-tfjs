// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {KNNImageClassifier} from 'deeplearn-knn-image-classifier';
import {NDArrayMathGPU, Array3D, ENV}from 'deeplearn';

// Number of classes to classify
const NUM_CLASSES = 5;
// Webcam Image size. Must be 227.
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;


class Main {
  constructor(){
    // Initiate variables
    this.infoTexts = [];
    this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;

    this.lastTime = new Date();

    this.code = {
      0: {"key": "left", "code": 37, "symbol": "&larr;"},
      1: {"key": "right", "code": 39, "symbol": "&rarr;"},
      2: {"key": "up", "code": 38, "symbol": "&uarr;"},
      3: {"key": "down", "code": 40, "symbol": "&darr;"},
      4: {"key": "None", "code": null}
    }

    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new KNNImageClassifier(NUM_CLASSES, TOPK, ENV.math);

    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');

    // Add video element to DOM
    const divVideo = document.getElementById('video');
    divVideo.appendChild(this.video);


    const menu = document.getElementById('menu');

    // Create training buttons and info texts
    for(let i in this.code){
      const div = document.createElement('div');
      menu.appendChild(div);
      div.style.marginBottom = '10px';

      // Create training button
      const button = document.createElement('button');
      button.innerText = this.code[i]['symbol'] + ' ' + this.code[i]['key'];
      div.appendChild(button);

      // Listen for mouse events when clicking the button
      button.addEventListener('mousedown', () => this.training = i);
      button.addEventListener('mouseup', () => this.training = -1);

      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " No examples added";
      div.appendChild(infoText);
      this.infoTexts.push(infoText);
    }

    const div = document.createElement('div');
    menu.appendChild(div);
    div.style.marginBottom = '10px';

    // Create training button
    const button = document.createElement('button')
    button.innerText = "Play";
    div.appendChild(button);

    // Listen for mouse events when clicking the button
    button.addEventListener('mouseup', () => window.dispatchEvent(new CustomEvent('play' + window.choosedGame, { detail: 1 })));

    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.width = IMAGE_SIZE;
      this.video.height = IMAGE_SIZE;

      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })

    // Load knn model
    this.knn.load()
    .then(() => this.start());
  }

  start(){
    if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  animate(){
    if(this.videoPlaying){
      // Get image data from video element
      const image = Array3D.fromPixels(this.video);

      // Train class if one of the buttons is held down
      if(this.training != -1){
        // Add current image to classifier
        this.knn.addImage(image, this.training)
      }

      // If any examples have been added and some time has passesd, run predict
      const exampleCount = this.knn.getClassExampleCount();
      if(new Date().getTime() - this.lastTime.getTime() >= 400 &&
         Math.max(...exampleCount) > 0) {
         console.log(new Date().getTime() - this.lastTime.getTime());
        this.lastTime = new Date();
        this.knn.predictClass(image)
        .then((res)=>{
          for(let i=0;i<NUM_CLASSES; i++){
            // Make the predicted class bold
            if(res.classIndex == i){
              this.infoTexts[i].style.fontWeight = 'bold';
            } else {
              this.infoTexts[i].style.fontWeight = 'normal';
            }
            //console.log(res);
            // Update info text
            if(exampleCount[i] > 0){
              this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i]*100}%`
            }
          }

          // Firing a native keyboard event is way harder than it should be,
          // but we can fake it.
          // http://stackoverflow.com/questions/961532/firing-a-keyboard-event-in-javascript

          console.log(res.classIndex);
          if(res.classIndex != 4) {
            var e = document.createEvent('Event');

            e.initEvent('keydown', true, true);
            e.keyCode = this.code[res.classIndex]['code'];
            document.dispatchEvent(e);

            var x = function(code) {
              var e2 = document.createEvent('Event');
              e2.initEvent('keyup', true, true);
              e2.keyCode = code[res.classIndex]['code'];
              document.dispatchEvent(e2);
            }

            setTimeout(x, 100, this.code);
          }

        })
        // Dispose image when done
        .then(()=> image.dispose())
      } else {
        image.dispose()
      }
    }

    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}

window.addEventListener('load', () => new Main());
