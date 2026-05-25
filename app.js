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

/* ================= JOIN ================= */
function join(){
  myName = document.getElementById("name").value.trim();
  if(!myName) return;

  db.ref("players/" + myName).set({
    name: myName,
    score: 0
  });

  document.getElementById("login").style.display = "none";
  document.getElementById("controls").style.display = "block";

  // 👉 admin (projektor mode)
  const isBigScreen = window.innerWidth > 900;

  if(isBigScreen){
    document.getElementById("admin").style.display = "block";
  }
}

/* ================= VOTE (+1 / -1) ================= */
function vote(val){
  const ref = db.ref("players/" + myName);

  ref.get().then(snap => {
    let data = snap.val();

    let newScore = (data?.score || 0) + val;

    // 🔒 clamp 0–30
    if(newScore < 0) newScore = 0;
    if(newScore > 40) newScore = 40;

    db.ref("players/" + myName).update({
      score: newScore
    });
  });
}

/* ================= RESET (PROJECTOR ONLY) ================= */
function resetAll(){

  const ok = confirm("Jesi siguran da želiš obrisati sve učenike i bodove?");

  if(!ok) return;

  db.ref("players").remove();
}

/* ================= LIVE BOARD ================= */
db.ref("players").on("value", snap => {
  const data = snap.val();
  const board = document.getElementById("board");

  board.innerHTML = "";

  if(!data) return;

  Object.values(data)
    .sort((a,b) => b.score - a.score)
    .forEach(p => {

      let score = p.score || 0;

      // 🔒 sigurnost clamp
      if(score < 0) score = 0;
      if(score > 40) score = 40;

      // 📊 0 → 0%, 30 → 100%
      let width = (score / 40) * 100;

      board.innerHTML += `
        <div class="row">
          <div class="name">${p.name}</div>

          <div class="bar-wrap">
            <div class="bar" style="width:${width}%"></div>
          </div>

          <div class="score">${score}</div>
        </div>
      `;
    });
});
