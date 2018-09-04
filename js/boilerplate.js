/* Marianne Linhares Monteiro @mari-linhares, 01/19/2018*/

window.addEventListener('load', function() {

    window.choosedGame = -1;
    var setGame = function(i) {
      window.choosedGame = data_json.games[i].name;
      window.location.href = '#play_game';
    };
  
    /* Add buttons to choose a game */
    const div = document.getElementById('choose_game');
    for(let i = 0; i < data_json.games.length; i++) {
      const buttonDiv = document.createElement('div');
      buttonDiv.setAttribute('class', 'cool-box input-container white-box col-1')
      buttonDiv.addEventListener('mouseup', () => setGame(i));
      div.appendChild(buttonDiv);
  
      // Add name
      const a = document.createElement('a')
      a.innerText = data_json.games[i].name + ' by ' + data_json.games[i].author;
      a.setAttribute('href', data_json.games[i].url);
      buttonDiv.appendChild(a);
  
      // Add image
      var x = document.createElement("img");
      x.setAttribute("src", data_json.games[i].img);
      x.setAttribute("width", "200");
      x.setAttribute("height", "200");
      buttonDiv.appendChild(x);
    }
  
    /* Adds play button */
    const div_game = document.getElementById('play_game');
  
    const button = document.createElement('button')
    button.innerText = "Play";
    div_game.appendChild(button);
  
    // Listen for mouse events when clicking the button
    var play_game = function() {
      window.dispatchEvent(new CustomEvent('play' + window.choosedGame, { detail: 1 }));
      window.location.hash = '#screen';
    }
    button.addEventListener('mouseup', play_game);
  
  });
  
  // This will not allow keys to move scrollbar
  window.addEventListener("keydown", function(e) {
      // space and arrow keys
      if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
      }
  }, false);