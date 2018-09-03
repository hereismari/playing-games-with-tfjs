# Playing games with TensorFlow JS

Demo: [https://mari-linhares.github.io/playing-games-with-tfjs/](https://mari-linhares.github.io/playing-games-with-tfjs/). The page may take a while to load since it needs to load the models.

----

This code was originally a modified version of the code made available by the google creative lab that can be acessed [here](https://github.com/googlecreativelab/teachable-machine-boilerplate) based on DeepLearn.js.


[Medium: Playing a game using just your camera with Deeplearn.js](https://medium.com/@mariannelinharesm/playing-a-game-using-just-your-camera-with-deeplearnjs-ca156008f537).

The code was updated and now is implemented in TensorFlow.js.

<div style="text-align:center"><img src="demo/demo_tetris1.gif"/></div>

---

## Games available

The original games sources can be acessed at:

* [Snake](https://github.com/maryrosecook/retro-games) by maryroseek. 
* [Asteroids](https://github.com/maryrosecook/retro-games) by maryrosecook.
* [Tetris](https://github.com/ttencate/tis) by ttencate.

---

**This project was developed during my free time and there's a lot of possible improvements, feel free to contribute!**


## Run locally

```
python -m SimpleHTTPServer 8080
```

This command will start a webserver on [`localhost:8080`](http://localhost:8080). Give permission to a webcam, and add some examples by holding down the buttons.

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

This information is used only for display. But, **when the user press play an event named *name* (in this case 'snake') will be dispatched**, and your game should start running when this event happens.

And that's it :smile:!

Oh, also I'm considering that your game uses only the arrow keys, if this is not true you can just add more buttons at [index.js](index.js).
