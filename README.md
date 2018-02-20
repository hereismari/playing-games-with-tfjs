# Teachable Machine for Games

This is a modified version of the code made available by the google creative lab that can be acessed [here](https://github.com/googlecreativelab/teachable-machine-boilerplate).

The original games sources can be acessed at:

* [Snake](https://github.com/maryrosecook/retro-games) by maryroseek. 
* [Asteroids](https://github.com/maryrosecook/retro-games) by maryrosecook.
* [Tetris](https://github.com/ttencate/tis) by ttencate.


Thanks to all!

<div style="text-align:center"><img src="demo/demo_tetris1.gif"/></div>

**This project was developed in my free time and there's a lot of possible improvements, feel free to contribute!**

## About it

This is a small and simple project that uses [deeplearn.js](https://deeplearnjs.org) to play a couple of games. [Here](https://github.com/mari-linhares/teachable-machine-games/blob/master/README.md#adding-your-own-game) you can learn how to add your own game.

## Run it yourself!

Currently I don't have a server running this demo, but you can run it locally.

First install the javascript dependencies by running  
```
npm install
```
Then start the local budo webserver by running 
```
npm start
```

This will start a webserver on [`localhost:9966`](http://localhost:9966). Try and allow permission to your webcam, and add some examples by holding down the buttons. 

## Adding your own game

Add your game info at games.json, for instance:

```
{
      "name": "snake",
       "img": "imgs/snake_screenshot.png",
       "url": "https://github.com/maryrosecook/retro-games",
       "author": "maryrosecook"
     }
```

This information is used only for display. But, **when the user press play an event named *name* (in this case 'snake') will be dispatched**, and your game should start playing when this event happens.

And that's it :smile:!

Oh, also I'm considering that your game uses only the arrow keys, if this is not true you can just add more buttons at [main.js](https://github.com/mari-linhares/teachable-machine-games/blob/ea5e00e78c985f44f138ec9d4561c2a1577259af/main.js#L35) and change the number of trainable classes [here](https://github.com/mari-linhares/teachable-machine-games/blob/ea5e00e78c985f44f138ec9d4561c2a1577259af/main.js#L19).


## Quick Reference
A quick overview of the most important function calls in the deeplearn.js [KNN Image Classifier](https://github.com/PAIR-code/deeplearnjs/tree/master/models/knn_image_classifier)

- `KNNImageClassifier(numClasses, k)`: The constructor takes an argument of how many classes you want to train and recoginize, and a `k` value that is the number of neighbors looked at when doing the classification. A value of `10` can be a good starting point.

- `.load()`: Downloads the SqueezeNet model from the internet, and setups the model.

- `.addImage(image, classIndex)`: Adds an image to the specific class training set

- `.clearClass(classIndex)`: Clears a specific class for training data

- `.predictClass(image)`: Runs the prediction on the image, and returns (as a Promise) the class index and confidence score. 

See the full implementation [here](https://github.com/PAIR-code/deeplearnjs/blob/master/models/knn_image_classifier/knn_image_classifier.ts)
