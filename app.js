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

function join() {
  myName = document.getElementById("name").value;

  if (!myName) return;

  db.ref("players/" + myName).set({
    name: myName,
    status: "none"
  });

  document.getElementById("buttons").style.display = "flex";
}

function vote(type) {
  if (!myName) return;

  db.ref("players/" + myName).update({
    status: type
  });
}

// realtime update
db.ref("players").on("value", snap => {
  const data = snap.val();
  const box = document.getElementById("players");

  box.innerHTML = "";

  if (!data) return;

  Object.values(data).forEach(p => {

    let color = "gray";
    let icon = "⬜";

    if (p.status === "plus") {
      color = "green";
      icon = "🟩";
    }

    if (p.status === "minus") {
      color = "red";
      icon = "🟥";
    }

    box.innerHTML += `
      <div class="player ${color}">
        <span>${p.name}</span>
        <span>${icon}</span>
      </div>
    `;
  });
});
