const firebaseConfig = {
    apiKey: "AIzaSyDQfAxP2lQLlv0HHcO8EodpfbBZC_lFhFM",
    authDomain: "sro-test-85608.firebaseapp.com",
    databaseURL: "https://sro-test-85608-default-rtdb.firebaseio.com",
    projectId: "sro-test-85608",
    storageBucket: "sro-test-85608.firebasestorage.app",
    messagingSenderId: "1079740587419",
    appId: "1:1079740587419:web:aca3d8cda6e1588c5dd53e"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let myName = "";

function join(){
  myName = document.getElementById("name").value.trim();
  if(!myName) return;

  db.ref("players/" + myName).set({
    name: myName,
    score: 0
  });

  document.getElementById("login").style.display = "none";
  document.getElementById("controls").style.display = "block";
}

function vote(val){
  const ref = db.ref("players/" + myName);

  ref.get().then(snap => {
    let data = snap.val();
    let newScore = (data.score || 0) + val;

    db.ref("players/" + myName).update({
      score: newScore
    });
  });
}

// LIVE BOARD (projektor)
db.ref("players").on("value", snap => {
  const data = snap.val();
  const board = document.getElementById("board");

  board.innerHTML = "";

  if(!data) return;

  Object.values(data)
    .sort((a,b) => b.score - a.score)
    .forEach(p => {

      const width = Math.max(0, Math.min(100, 50 + p.score * 5));

      board.innerHTML += `
        <div class="row">
          <div class="name">${p.name}</div>
          <div class="bar-wrap">
            <div class="bar" style="width:${width}%"></div>
          </div>
          <div class="score">${p.score}</div>
        </div>
      `;
    });
});
