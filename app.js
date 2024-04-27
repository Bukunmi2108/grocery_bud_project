//CONST ASSEMBLE
const form = document.getElementById('form');

const alertt = document.querySelector('.alert');

const text = document.getElementById('text');

const clear = document.querySelector('.clear');

const itemcontainer = document.querySelector('.itemcon');

const submitBtn = document.querySelector('.submitbtn');

//EDIT OPTIONS

let editElement;
let editFlag = false;
let editID = "";

//EVENT LISTENER
//ADD ITEMS
form.addEventListener('submit', addItems);

//CLEAR ITEMS
clear.addEventListener('click', clearItems);

//LOAD ITEMS
window.addEventListener('DOMContentLoaded', setUpItems)

//addITEMS
function addItems(e) {
  e.preventDefault();
  const value = text.value;

  const id = new Date().getTime().toString();

  if (value && !editFlag){
    createListItems(id,value);
    clear.classList.remove('hidden');

    displayAlert('A New Item has been Added', 'rgb(195, 253, 195)');

    addToLocalStorage(id, value);

    setBackToDefault();
  } else if (value && editFlag){
    editElement.innerHTML = value;
    displayAlert('Value Changed', 'rgb(195, 253, 195)');
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert('Empty Value', 'rgb(255, 138, 138)');
  }
}

//DISPLAY ALERT

function displayAlert(message, colour) {
  alertt.textContent = `${message}`;
  alertt.classList.add('pa');
  alertt.style.background = `${colour}`;

  //remove alert
  setTimeout(function(){
    alertt.textContent = ``;
  alertt.classList.remove('pa');
  alertt.style.background = `none`;
  }, 2000)
}


//CLEAR ITEMS
function clearItems(){
  const items = document.querySelectorAll('.item');

  if (items.length > 0) {
    items.forEach(
      function (item) {
        itemcontainer.removeChild(item);
      }
    )
  }
  displayAlert('Empty Value','rgb(255, 138, 138)')

  clear.classList.add('hidden');
  setBackToDefault();
  localStorage.clear();
}

//SET BACK TO DEFAULT
function setBackToDefault() {
  text.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'Submit'
}

//edit function
function editItem(e){
  const element = e.currentTarget.parentElement.parentElement;

  editElement = e.currentTarget.parentElement.previousElementSibling;

  text.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = 'Save';
}
//delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;

  const id = element.dataset.id;

  itemcontainer.removeChild(element);

  displayAlert('Item removed', 'rgb(255, 138, 138)');
  setBackToDefault();
  removeFromLocalStorage(id)
};

//ADD TO LOCAL STORAGE
function addToLocalStorage(id, value) {
  const grocery = {id,value};
  let items = getLocalStorage();

  console.log(items);;

  items.push(grocery);
  localStorage.setItem('list',JSON.stringify(items))
};

//REMOVE FROM LOCAL STORAGE
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function(item){
    if (item.id !== id) {
      return item
    }
  })
  localStorage.setItem('list',JSON.stringify(items));
};

//EDIT LOCAL STORAGE
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function(item){
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

//GET LOCAL STORAGE
function getLocalStorage(){
  return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")): []; 
}

//SETUP ITEMS

function setUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(
      function(item){
        createListItems(item.id, item.value)
      }
    )
    clear.classList.remove('hidden');
  }
}

function createListItems(id, value){
  const element = document.createElement('div');
    element.classList.add('item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="it">${value}</p>
    <div class="btncon">
      <button class="edit">edit</button>
      <button class="delete">delete</button>
    </div>`

    const deleteBtn = element.querySelector('.delete');

    const editBtn = element.querySelector('.edit');

    editBtn.addEventListener('click', editItem);
    
    deleteBtn.addEventListener('click', deleteItem);

    itemcontainer.appendChild(element);
}