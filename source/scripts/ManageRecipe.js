import {storage} from './storage.js';

window.addEventListener('DOMContentLoaded', init);

/** Initialize the manage page */
function init() {
  const id = isEdit();
  if (id != '-1') {
    populateRecipeHelper(id);
  }
}

const leftButton = document.getElementById('back-button');
const rightButton = document.getElementById('next-button');
const ingButton = document.getElementById('ing-button');
const instrButton = document.getElementById('instr-button');
const picButton = document.getElementById('pic-button');
const vidButton = document.getElementById('vid-button');
const picURL = document.getElementById('pic-url');
const vidURL = document.getElementById('vid-url');
const recipePic = document.getElementById('recipe-pic');
const recipeVid = document.getElementById('recipe-vid');
const nameText = document.getElementById('current-name');
const ingList = document.getElementById('ing-box');
const instrList = document.getElementById('instr-box');
const firstIng = document.getElementById('first-ing');
const firstInstr = document.getElementById('first-instr');
const box1 = document.getElementById('b1');
const box2 = document.getElementById('b2');
const box3 = document.getElementById('b3');
const box4 = document.getElementById('b4');
const page1 = document.getElementsByClassName('page-one')[0];
const page2 = document.getElementsByClassName('page-two')[0];
const page3 = document.getElementsByClassName('page-three')[0];
const page4 = document.getElementsByClassName('page-four')[0];
let currentPage = 0;
const pages = [page1, page2, page3, page4];
const boxes = [box1, box2, box3, box4];
const titleTexts = [
  'Managing a Recipe...',
  'Ingredients!',
  'Instructions!',
  'Finishing Touches'];

/**
 * Recipe populate helper
 * @param {String} id id of the recipe
 */
function populateRecipeHelper(id) {
  if (isSearched() && id != '-1') {
    populateRecipe(storage.getSearchedRecipe(id));
  } else {
    populateRecipe(storage.getRecipe(id));
  }
}

/**
 * Populate recipe into our manage page
 * @param {Recipe} recipe the recipe being edited/added
 */
function populateRecipe(recipe) {
  if (Object.keys(recipe).length == 0) return; // TODO: catch error

  // Populate imageUrl
  picURL.value = recipe.image;
  // Populate title
  document.getElementById('name-box').value = recipe.name;
  // Populate description
  document.getElementById('desc-box').value = recipe.description;
  // Populate tags
  document.getElementById('tag-box').value =
    recipe.tag == null ? '' : recipe.tag;

  // Populate ingredients
  for (let i=0; i<recipe.recipeIngredient.length; i++) {
    if (i == 0) {
      firstIng.textContent =
        recipe.recipeIngredient[0];
      continue;
    }
    const created = newIng();
    created.textContent = recipe.recipeIngredient[i];
    ingList.appendChild(created);
    created.focus();
  }

  // Populate ingredients
  for (let i=0; i<recipe.recipeInstruction.length; i++) {
    if (i == 0) {
      firstInstr.textContent =
        recipe.recipeInstruction[0];
      continue;
    }
    const created = newInstr();
    created.textContent = recipe.recipeInstruction[i];
    instrList.appendChild(created);
    created.focus();
  }

  // Populate cooktime and servings
  document.querySelector('#time-box').value = recipe.totalTime;
  document.querySelector('#serving-box').value = recipe.recipeYield;

  // Populate videoUrl
  document.querySelector('#vid-url').value = recipe.video;
}


/** Helper function for navigating to the 4 different slides of the page
 *  Hides elements from the previous page, shows elements of newPage,
 *  and changes the currentPage counter to the newPage.
 * @param {int} newPage The page number of the page navigating to
 */
function moveToPage(newPage) {
  boxes[currentPage].classList.remove('active-box');
  boxes[newPage].classList.add('active-box');
  pages[currentPage].classList.add('hidden');
  pages[newPage].classList.remove('hidden');
  nameText.textContent = titleTexts[newPage];
  if (currentPage == 0) leftButton.classList.remove('fade');
  if (currentPage == 3) rightButton.textContent = 'Next';
  if (newPage == 0) leftButton.classList.add('fade');
  if (newPage == 3) rightButton.textContent = 'Save';
  currentPage = newPage;
}

/* Adds 'event listeners' for the back and next navigation buttons */
leftButton.onclick = function() {
  moveToPage(currentPage - 1);
};
rightButton.onclick = function() {
  if (currentPage == 3) {
    // save();
    const recp = {};
    recp.name = document.getElementById('name-box').value;
    recp.image = picURL.value;
    recp.video = document.getElementById('vid-url').value;
    // console.log(document.getElementsByTagName('video'));
    // document.querySelector('video').src = recp.video;
    document.getElementsByTagName('video').src = recp.video;

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    recp.datePublished = today;

    recp.description = document.getElementById('desc-box').value;

    recp.totalTime = document.getElementById('time-box').value;
    recp.recipeYield = document.getElementById('serving-box').value;

    const IngreArray = [];
    const ListIngre = document.querySelectorAll('#ing-box li');
    for (let i = 0; i < ListIngre.length; i++) {
      IngreArray.push(ListIngre[i].textContent);
    }
    recp.recipeIngredient = IngreArray;

    const InstrArray = [];
    const ListInstr = document.querySelectorAll('#instr-box li');
    for (let i = 0; i < ListInstr.length; i++) {
      InstrArray.push(ListInstr[i].textContent);
    }
    recp.recipeInstruction = InstrArray;

    // recp.tag

    let id = isEdit();
    if (isSearched()) {
      id = storage.addRecipe(recp);
      // navigate to the new recipecard page
      window.location.href = window.location.origin +
        window.location.pathname.replace('ManageRecipe.html'
            , 'Recipe.html?id=' + id);
    } else if (id != '-1') {
      // edit recipe
      recp.id = id;
      storage.editRecipe(recp);
      // go back to recipe
      window.location.href =
        window.location.pathname.replace(
            'ManageRecipe.html', 'Recipe.html?id=' + id);
    } else {
      id = storage.addRecipe(recp);
      // navigate to the new recipecard page
      window.location.href = window.location.origin +
        window.location.pathname.replace('ManageRecipe.html'
            , 'Recipe.html?id=' + id);
    }
  } else {
    moveToPage(currentPage + 1);
  }
};

/* Adds 'event listeners' for the dot navigation */
box1.onclick = function() {
  moveToPage(0);
};
box2.onclick = function() {
  moveToPage(1);
};
box3.onclick = function() {
  moveToPage(2);
};
box4.onclick = function() {
  moveToPage(3);
};

/** Adds 'event listeners' for the import video
 *  and picture from URL buttons by setting src.
 *  */
picButton.onclick = function() {
  recipePic.src = picURL.value;
};
vidButton.onclick = function() {
  recipeVid.src = vidURL.value;
};

/**  Helper function for adding a new ingredient
 *   Creates a new li object and adds event listeners for backspace (to delete)
 *   and enter (to create a new one right below and
 *   moves to it [through focus()]).
 *   @return {li} that li object
 */
function newIng() {
  const created = document.createElement('li');
  created.setAttribute('contenteditable', 'true');
  created.addEventListener('keydown', (event) => {
    if (event.key == 'Backspace') {
      if (created.textContent == '') ingList.removeChild(created);
    }
    if (event.key == 'Enter') {
      event.preventDefault();
      created.parentNode.insertBefore(newIng(), created.nextSibling);
      created.nextSibling.focus();
    }
  });
  return created;
}

/** Adds 'event listener' to the add ingredient button
 *  Specifically creates an ingredient, appends it to the list, and finally
 *  moves to editing the new ingredient.
 */
ingButton.onclick = function() {
  const created = newIng();
  ingList.appendChild(created);
  created.focus();
};

/**  Helper function for adding a new instruction
 *   Creates a new li object and adds event listeners for backspace (to delete)
 *   and enter (to create a new one right below and
 *   moves to it [through focus()]).
 *   @return {li} that li object
 */
function newInstr() {
  const created = document.createElement('li');
  created.setAttribute('contenteditable', 'true');
  created.addEventListener('keydown', (event) => {
    if (event.key == 'Backspace') {
      if (created.textContent == '') instrList.removeChild(created);
    }
    if (event.key == 'Enter') {
      event.preventDefault();
      created.parentNode.insertBefore(newInstr(), created.nextSibling);
      created.nextSibling.focus();
    }
  });
  return created;
}

/** Adds 'event listener' to the add ingredient button
 *  Specifically creates an instruction, appends it to the list, and finally
 *  moves to editing the new instruction.
 */
instrButton.onclick = function() {
  const created = newInstr();
  instrList.appendChild(created);
  created.focus();
};

/** Adds event listeners to the first ingredient and instruction
 *  Unlike the created ingredients and instructions, it cannot be deleted.
 */
firstIng.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    event.preventDefault();
    firstIng.parentNode.insertBefore(newIng(), firstIng.nextSibling);
    firstIng.nextSibling.focus();
  }
});
firstInstr.addEventListener('keydown', (event) => {
  if (event.key == 'Enter') {
    event.preventDefault();
    firstInstr.parentNode.insertBefore(newInstr(), firstInstr.nextSibling);
    firstInstr.nextSibling.focus();
  }
});

/**
 * Check if we are editing a recipe
 * @return {String} the editing recipe id if editing, else '-1'
 */
function isEdit() {
  // console.log('storage:' + storage);
  // Extract query id
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id');
  return id != null ? id : '-1';
}

/**
 * Check if we are editing from a searched recipe
 * @return {Boolean} true if yes, else false
 */
function isSearched() {
  // console.log('storage:' + storage);
  // Extract query id
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('searched') != null;
}
