let username;
let socket = io();

do {
  username = prompt("Enter your name");
} while (!username);

const textarea = document.querySelector("#textarea");
const submitBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment__box");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let comment = textarea.value;

  if (!comment) {
    return;
  }

  postComment(comment);
});

function postComment(comment) {
  // Append to dom
  let data = {
    username: username,
    comment: comment,
  };

  appendToDom(data);

  textarea.value = "";

  // Brodcast

  broadcastComment(data);

  // Sync with mongo db

  syncWithDb(data);
}

function appendToDom(data) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");

  let markup = `
    <div class="card border-light mb-3">
      <div class="card-body">
        <h6>${data.username}</h6>
        <p>${data.comment}</p>

        <div>
          <img src="img/clock.png" alt="clock" />
          <span>${moment(data.time).format("LT")}</span>
        </div>
      </div>
    </div>
    `;
  lTag.innerHTML = markup;

  commentBox.prepend(lTag);
}

// showing comment in other browser
function broadcastComment(data) {
  socket.emit("comment", data);
}

socket.on("comment", (data) => {
  appendToDom(data);
});

let timerId = null;
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    func();
  }, timer);
}

let typingDiv = document.querySelector(".typing");
socket.on("typing", (data) => {
  typingDiv.innerHTML = `${data.username} is Typing...`;
  debounce(() => {
    typingDiv.innerHTML = "";
  }, 1000);
});

// Event listener on textarea
textarea.addEventListener("keyup", (e) => {
  socket.emit("typing", { username: username });
});

// adding alert when new user join
let userJoint = document.querySelector(".user-joint");

socket.emit("user-joint", username);

socket.on("new-user", (user) => {
  userJoint.innerHTML = `${user} Joined `;
  userJoint.parentElement.classList.replace("d-none", "d-block");
  setTimeout(() => {
    userJoint.parentElement.classList.replace("d-block", "d-none");
  }, 1000);
});

//

// let users = [];

// socket.emit("onlineUser", users);

function syncWithDb(data) {
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/api/comments", {
    method: "Post",
    body: JSON.stringify(data),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
}

function fetchComment() {
  fetch("/api/comments")
    .then((resp) => resp.json())
    .then((result) => {
      result.forEach((comment) => {
        comment.time = comment.createdAt;
        appendToDom(comment);
      });
    });
}

window.onload = fetchComment;
