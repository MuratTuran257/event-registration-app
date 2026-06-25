const form = document.querySelector("#registrationForm");
const message = document.querySelector("#message");

const participantList = document.querySelector("#participantList");
const participantCount = document.querySelector("#participantCount");
const emptyInfo = document.querySelector("#emptyInfo");
const searchInput = document.querySelector("#searchInput");
const filterTechnology = document.querySelector("#filterTechnology");
const statistics = document.querySelector("#statistics");

let participants = [];
let nextId = 1;

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullName = document.querySelector("#fullName").value.trim();
  const email = document.querySelector("#email").value.trim();
  const age = document.querySelector("#age").value;
  const technology = document.querySelector("#technology").value;
  const terms = document.querySelector("#terms").checked;

  if (!validateForm(fullName, email, age, technology, terms)) {
    return;
  }

  const participant = createParticipant(fullName, email, age, technology);
  participants.push(participant);

  saveToStorage();
  renderParticipants();
  clearForm();

  showMessage(
    `${fullName} has been registered for the event.<br>Technology: ${technology}<br>Age: ${age}`,
    "success"
  );
});

searchInput.addEventListener("input", renderParticipants);
filterTechnology.addEventListener("change", renderParticipants);

function validateForm(fullName, email, age, technology, terms) {
  if (fullName === "") {
    showMessage("Full name is required.", "error");
    return false;
  }
  if (email === "") {
    showMessage("Email is required.", "error");
    return false;
  }
  if (!email.includes("@")) {
    showMessage("Email is invalid.", "error");
    return false;
  }
  if (age === "") {
    showMessage("Age is required.", "error");
    return false;
  }
  if (Number(age) <= 0) {
    showMessage("Age must be greater than 0.", "error");
    return false;
  }
  if (Number(age) < 18) {
    showMessage("Age must be at least 18.", "error");
    return false;
  }
  if (technology === "") {
    showMessage("Please select a technology.", "error");
    return false;
  }
  if (terms === false) {
    showMessage("You must accept the terms.", "error");
    return false;
  }
  return true;
}

function createParticipant(fullName, email, age, technology) {
  const participant = {
    id: nextId,
    fullName: fullName,
    email: email,
    age: Number(age),
    technology: technology
  };
  nextId++;
  return participant;
}

function getVisibleParticipants() {
  const searchText = searchInput.value.trim().toLowerCase();
  const chosenTech = filterTechnology.value;
  const result = [];

  for (const participant of participants) {
    const matchesTech = chosenTech === "All" || participant.technology === chosenTech;

    const name = participant.fullName.toLowerCase();
    const mail = participant.email.toLowerCase();
    const matchesSearch = name.includes(searchText) || mail.includes(searchText);

    if (matchesTech && matchesSearch) {
      result.push(participant);
    }
  }

  return result;
}

function renderParticipants() {
  const visible = getVisibleParticipants();
  participantList.innerHTML = "";

  for (const participant of visible) {
    const item = document.createElement("li");
    item.className = "participant-item";

    const info = document.createElement("div");
    info.className = "participant-info";
    info.innerHTML =
      `<strong>${participant.fullName}</strong>` +
      `<span>${participant.email} | Age: ${participant.age} | ${participant.technology}</span>`;

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteParticipant(participant.id);
    });

    item.appendChild(info);
    item.appendChild(deleteButton);
    participantList.appendChild(item);
  }

  updateCounter();
  updateStatistics();
  updateEmptyInfo(visible.length);
}

function deleteParticipant(id) {
  const remaining = [];

  for (const participant of participants) {
    if (participant.id !== id) {
      remaining.push(participant);
    }
  }

  participants = remaining;
  saveToStorage();
  renderParticipants();
}

function updateCounter() {
  participantCount.textContent = participants.length;
}

function updateStatistics() {
  if (participants.length === 0) {
    statistics.style.display = "none";
    return;
  }
  statistics.style.display = "block";

  let jsCount = 0;
  let ageSum = 0;

  for (const participant of participants) {
    if (participant.technology === "JavaScript") {
      jsCount++;
    }
    ageSum = ageSum + participant.age;
  }

  const averageAge = Math.round(ageSum / participants.length);

  const techList = ["HTML", "CSS", "JavaScript", "React", "Other"];
  let popularTech = "-";
  let popularCount = 0;

  for (const tech of techList) {
    let count = 0;
    for (const participant of participants) {
      if (participant.technology === tech) {
        count++;
      }
    }
    if (count > popularCount) {
      popularCount = count;
      popularTech = tech;
    }
  }

  statistics.innerHTML =
    `<strong>Statistics</strong><br>` +
    `Total participants: ${participants.length}<br>` +
    `Interested in JavaScript: ${jsCount}<br>` +
    `Average age: ${averageAge}<br>` +
    `Most popular technology: ${popularTech}`;
}

function updateEmptyInfo(visibleCount) {
  if (participants.length === 0) {
    emptyInfo.textContent = "No participants yet. Be the first to register!";
    emptyInfo.style.display = "block";
  } else if (visibleCount === 0) {
    emptyInfo.textContent = "No participants match your search or filter.";
    emptyInfo.style.display = "block";
  } else {
    emptyInfo.style.display = "none";
  }
}

function clearForm() {
  document.querySelector("#fullName").value = "";
  document.querySelector("#email").value = "";
  document.querySelector("#age").value = "";
  document.querySelector("#technology").value = "";
  document.querySelector("#terms").checked = false;
}

function showMessage(text, type) {
  message.innerHTML = text;
  message.className = "message " + type;
}

function saveToStorage() {
  localStorage.setItem("participants", JSON.stringify(participants));
}

function loadFromStorage() {
  const saved = localStorage.getItem("participants");
  if (saved !== null) {
    participants = JSON.parse(saved);
  }
}

loadFromStorage();

for (const participant of participants) {
  if (participant.id >= nextId) {
    nextId = participant.id + 1;
  }
}

renderParticipants();
