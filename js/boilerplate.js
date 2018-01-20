/* Marianne Linhares Monteiro @mari-linhares, 01/19/2018*/

window.addEventListener('load', function() {

  var count=3;

  var counter=setInterval(timer, 1000); //1000 will  run it every 1 second

  function timer()
  {
    count=count-1;
    if (count < 0)
    {
       clearInterval(counter);
       var element = document.getElementById("timer");
       element.parentNode.removeChild(element);
       return;
    }

    //Do code for showing the number of seconds here

    document.getElementById("timer").innerHTML=count + " secs"; // watch for spelling
  }

  window.choosedGame = -1;
  var setGame = function(i) {
    window.choosedGame = data_json.games[i].name;
    console.log(choosedGame);
    window.location.href = '#play_game';
  };


  /* Add buttos to choose a game */
  const div = document.getElementById('choose_game');
  console.log(data_json.games);
  for(let i = 0; i < data_json.games.length; i++) {
    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'cool-box input-container white-box col-1')
    buttonDiv.addEventListener('mouseup', () => setGame(i));
    div.appendChild(buttonDiv);

    // Create training button
    const h3 = document.createElement('h3')
    h3.innerText = data_json.games[i].name;
    buttonDiv.appendChild(h3);

    var x = document.createElement("img");
    x.setAttribute("src", data_json.games[i].img);
    x.setAttribute("width", "200");
    x.setAttribute("height", "200");
    buttonDiv.appendChild(x);

    console.log(data_json.games[i].name);
  }


});

// This will not allow keys to move scrollbar
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
