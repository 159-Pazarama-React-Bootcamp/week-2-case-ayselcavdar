import { uuid } from "./helpers.js";

//* Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const userName = document.getElementById("userName");
const darkModeToggle = document.getElementById("switch");
const body = document.getElementsByTagName("body");

// andpoint ana url
const BASE_API_URL = "https://61c43cf7f1af4a0017d99412.mockapi.io/";

// burada isEdit flagı ve kullanıcının giriş yaptıgı veriler
let isEdit = false;
let editedData = {
  id: "",
  content: todoInput.value,
  isCompleted: false,
};

let username = "";
// burada window yuklendiginde kullanıcı login olmuş mu local storagedan bakarak check ediyoruz
// eger olmuşsa username'i ana sayfadaki başlıga koyuyoruz
// degilse login olması için login sayfasına yonlendiriyoruz
window.onload = function () {
  const urlOrigin = location.origin;
  if (localStorage.getItem("USERNAME")) {
    username = localStorage.getItem("USERNAME");
    userName.textContent = `${JSON.parse(username)}'s todo list`;
  } else {
    location.href = `${urlOrigin}/login.html`;
  }
};

//* Event Listeners
// burada kullanıcının dark-mode secenigini localstorage kaydediyoruz
// buna gore de sayfamızı dark moda ve ya light moda geciiyoruz
window.addEventListener("DOMContentLoaded", function () {
  if (JSON.parse(localStorage.getItem("DARK_MODE")) == true) {
    darkModeToggle.checked = true;
    body[0].style.background = "#333";
  } else {
    darkModeToggle.checked = false;
    body[0].style.background = "";
  }
});

todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheckEdit);
filterOption.addEventListener("change", filterTodo);
// burada sayfanın sag ust kosesinde bulunan switch buttonu ile
// anlık sayfamızı dark moda ve ya light moda geciriyoruz
// aynı zamanda localstorage da bu degerleri kaydediyoruz
darkModeToggle.addEventListener("change", function () {
  if (darkModeToggle.checked) {
    body[0].style.background = "#333";
    localStorage.setItem("DARK_MODE", true);
  } else {
    localStorage.setItem("DARK_MODE", false);
    body[0].style.background = "";
  }
});

//* Functions
// burada api'e get istegi atarak kullanıcını butun todolarını alıyoruz
// ve show(data) fonksionu ile sayfamıza yazdırıyoruz
async function getTodos() {
  try {
    const response = await fetch(`${BASE_API_URL}/todos`);
    const data = await response.json();
    show(data);
  } catch (error) {
    console.log("error :>> ", error);
  }
}

// burada kullanıcının girdigi todo bilgilerini alıp andpointe gondererek
// database'e kaydettiriyoruz
async function createTodo(data) {
  try {
    const rawResponse = await fetch(`${BASE_API_URL}/todos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await rawResponse.json();
    getTodos();
  } catch (error) {
    console.log("error :>> ", error);
  }
}

// burada kullanıcı silmek istedigi todo'ya tıkladıgı anda id'sini alarak
// delete metodu ile andpointe istek atarak bu todo'yu siliyoruz
async function deleteTodo(id) {
  try {
    const res = await fetch(`${BASE_API_URL}/todos/${id}`, {
      method: "DELETE",
    });
    const resData = await res.json();
  } catch (error) {
    console.log("error :>> ", error);
  }
}

// burada kullanıcı todo'sunu yapıldı olarak isharetlendiginde andpointe
// put metodu ile istek atarak todo bilgisi guncelliyoruz
async function updateTodo(data) {
  try {
    const res = await fetch(`${BASE_API_URL}/todos/${data.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const content = await res.json();
  } catch (error) {
    console.log("error :>> ", error);
  }
}

// kullanıcı todo eklediginde veya var olan todolarını sayfada gostermek icin
// olusturulmus bir fonksiondur
function show(data) {
  // Loop to access all todo items
  let todoDiv = ``;
  data.forEach((i) => {
    todoDiv += `
    <div class="todo ${i.isCompleted ? "completed" : ""}" id=${i.id}> 
      <li class="todo-item">${i.content} </li>
      <button class="complete-btn"><i class="fas fa-check"></i></button>
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      <button class="trash-btn"><i class="fas fa-trash"></i></button>
    </div>
    `;
  });

  todoList.innerHTML = todoDiv;
}

getTodos();

// burada kullanıcı todo ekldiginde belli validasyondan gecirerek ya bir alert mesajı gosteriyoruz
// yada ilgili todo elementini olusturup sayfamızda gosteriyoruz
// eger kullanıcı edit modundaysa burada todo'sunu update ediyoruz
// ve update edilmis veriyi gosteriyoruz
async function addTodo(event) {
  //Prevent form from submitting
  event.preventDefault();
  if (todoInput.value.length < 3)
    return alert("Please enter a valid todo content");
  // update
  if (isEdit) {
    editedData.content = todoInput.value;
    await updateTodo(editedData);
    await getTodos();

    return (
      (todoInput.value = ""), (isEdit = false), (filterOption.value = "all")
    );
  }
  // div elementi olusturuyoruz
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // burada bir liste olusturuyoruz ve yukarıda olusturdugumuz div'e child olarak ekliyoruz
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
  // burada da check iconunu ekliyoruz
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
  // delete iconunu ekledik
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
  //liste hazır olduktan sonra todo listemize child element olarak ekliyoruz
  todoList.appendChild(todoDiv);

  // todo olusturmak icin andpointimizin bizden istedigi payloadı olusturuyoruz
  const data = {
    id: uuid(),
    content: todoInput.value,
    isCompleted: false,
  };
  // burada da ilgili payloadı gondererek istek atıyoruz ve todomuzun olusturulmasını saglıyoruz
  createTodo(data);
  // burada da kullanıcını giris yaptıgı degeri temizliyoruz
  todoInput.value = "";
  filterOption.value = "all";
}

function deleteCheckEdit(e) {
  const item = e.target;
  // burada kullanıcın delete butonuna basıp basmadıgını kontrol ediyoruz
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;

    // andpointe istek atarak hem database'den hem ui'dan bu todo'yu kaldırıyoruz
    deleteTodo(item.parentElement.id);
    todo.classList.add("fall");
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  // check marka tıklanıp tıklanmadıgını kontol ediyoruz
  // basmıssa done olarak isaretliyip ilgili css'e uyguluyoruz
  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    const content = item.previousElementSibling.innerText;

    if (todo.classList.contains("completed")) {
      const data = {
        id: item.parentElement.id,
        content,
        isCompleted: false,
      };
      updateTodo(data);
      todo.classList.remove("completed");
    } else {
      const data = {
        id: item.parentElement.id,
        content,
        isCompleted: true,
      };
      updateTodo(data);
      todo.classList.add("completed");
    }
  }

  // edit butonuna basıp basmadıgı kontrol ederek kullanıcının tıkladıgı todo'nun bilgilerini
  // guncellenmesini saglıyoruz
  if (
    item.classList.contains("edit-btn") ||
    item.classList.contains("fa-edit")
  ) {
    let content = "";
    let isCompleted = null;
    let id = "";

    if (item.classList.contains("edit-btn")) {
      id = item.parentElement.id;
      content = item.previousElementSibling.previousElementSibling.innerText;
      isCompleted = item.parentElement.classList.contains("completed");
    } else {
      id = item.parentElement.parentElement.id;
      content =
        item.parentElement.previousElementSibling.previousElementSibling
          .innerText;
      isCompleted =
        item.parentElement.parentElement.classList.contains("completed");
    }
    todoInput.value = content;
    isEdit = true;
    editedData.id = id;
    editedData.content = content;
    editedData.isCompleted = isCompleted;
  }
}

// burada inputun sagında bulunan drop down'da kullıcı tamamlanmıs ve ya tamamlanmamıs
// todolarını filtreliyip gormek için olusturulmus bir fonksiondur
function filterTodo(e) {
  const todos = todoList.children;
  for (const todo of todos) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      default:
        break;
    }
  }
}
