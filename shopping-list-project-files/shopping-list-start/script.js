const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearButton = document.getElementById("clear");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

// Display existing items from local storage
const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
};

// if Add is clicked
const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  // Check if edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove(".edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    // prevent adding of duplicate item
    if (checkIfItemExists(newItem)) {
      alert("That item alreadyexists.");
      return;
    }
  }
  // add item to DOM

  addItemToDom(newItem);

  // add items to local storage

  addItemToStorage(newItem);

  checkUI();
  itemInput.value = "";
};

// Create List Item on page

const addItemToDom = (item) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);

  // add li to DOM
  itemList.appendChild(li);
};

// Add item to local storage
const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

// create button

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

// create the icon in the button

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
// get local storahe item list
const getItemsFromStorage = (item) => {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
};

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
// select on area other than icon

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

//avoid duplicates
const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
};

// set up edit form

const setItemToEdit = (item) => {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = ' <i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
};

// remove an item

const removeItem = (item) => {
  if (confirm("Are you sure?")) {
    // remove item from dom
    item.remove();
    // remove Item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
};
// remove an item from storage

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();
  // filter out items to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  //re-set to local storage
  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};
//clear items
const clearItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  //clear from local storage
  localStorage.removeItem("items");
  checkUI();
};

// filter according to characters typed in

const filterItems = (e) => {
  const text = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    console.log(itemName);
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

//reload the window

const checkUI = () => {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
  }
  formBtn.innerHTML = "";
  formBtn.innerHTML = ' <i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
};
const init = () => {
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearButton.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
};
init();
