

// //  [
// //    { title: "Math",
// //      clues: [
// //        {question: "2+2", answer: 4, showing: null},
// //        {question: "1+1", answer: 2, showing: null}
// //        ...
// //      ],
// //    },
// //    { title: "Literature",
// //      clues: [
// //        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
// //        {question: "Bell Jar Author", answer: "Plath", showing: null},
// //        ...
// //      ],
// //    },
// //    ...
// //  ]

// let categories = [];


// /** Get NUM_CATEGORIES random category from API.
//  *
//  * Returns array of category ids
//  */

// async function getCategoryIds() {


// /** Return object with data about a category:
//  *
//  *  Returns { title: "Math", clues: clue-array }
//  *
//  * Where clue-array is:
//  *   [
//  *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//  *      {question: "Bell Jar Author", answer: "Plath", showing: null},
//  *      ...
//  *   ]
//  */

// async function getCategory(catId) {


// /** Fill the HTML table#jeopardy with the categories & cells for questions.
//  *
//  * - The <thead> should be filled w/a <tr>, and a <td> for each category
//  * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
//  *   each with a question for each category in a <td>
//  *   (initally, just show a "?" where the question/answer would go.)
//  */

// async function fillTable() {
   


// /** Handle clicking on a clue: show the question or answer.
//  *
//  * Uses .showing property on clue to determine what to show:
//  * - if currently null, show question & set .showing to "question"
//  * - if currently "question", show answer & set .showing to "answer"
//  * - if currently "answer", ignore click
//  * */

// function handleClick(evt) {

//     }
// }

// /** Wipe the current Jeopardy board, show the loading spinner,
//  * and update the button used to fetch data.
//  */

// function showLoadingView() {
//

// /** Remove the loading spinner and update the button used to fetch data. */



// /** Start game:
//  *
//  * - get random category Ids
//  * - get data for each category
//  * - create HTML table
//  * */

// //   
// categories = []; // Limpa as categorias para um novo jogo


//     async function setupAndStart() {




// /** On click of start / restart button, set up game. */

// // TODO

// /** On page load, add event handler for clicking clues */

// // TODO

let categories = [];
const baseURL = 'http://jservice.io/api';

async function getCategoryIds() {
  const response = await axios.get(`${baseURL}/categories`, {
    params: {
      count: 6
    }
  });
  return response.data.map(category => category.id);
}

async function getCategory(catId) {
  const response = await axios.get(`${baseURL}/category`, {
    params: {
      id: catId
    }
  });
  const clues = response.data.clues.map(clue => {
    return {
      question: clue.question,
      answer: clue.answer,
      showing: null
    };
  });
  return {
    title: response.data.title,
    clues: _.sampleSize(clues, 5)
  };
}

async function fillTable() {
  showLoadingView();

  const table = document.createElement('table');
  table.id = 'jeopardy';
  document.body.appendChild(table);

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  thead.appendChild(tr);

  const categoryIds = await getCategoryIds();
  
  for (let catId of categoryIds) {
    const category = await getCategory(catId);
    categories.push(category);
  }

  categories.forEach(category => {
    const th = document.createElement('th');
    th.textContent = category.title;
    tr.appendChild(th);
  });

  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  for (let i = 0; i < 5; i++) {
    const tr = document.createElement('tr');
    tbody.appendChild(tr);

    categories.forEach((category, idx) => {
      const td = document.createElement('td');
      td.dataset.category = idx;
      td.dataset.clue = i;
      td.textContent = '?';
      tr.appendChild(td);
    });
  }

  hideLoadingView();

  document.querySelectorAll('td').forEach(td => {
    td.addEventListener('click', handleClick);
  });
}

async function setupAndStart() {
  categories = [];
  const jeopardyTable = document.querySelector('#jeopardy');

  if (jeopardyTable) {
    jeopardyTable.remove();
  }

  await fillTable();
}

function handleClick(evt) {
  const target = evt.target;

  if (target.tagName === 'TD') {
    const categoryId = target.dataset.category;
    const clueId = target.dataset.clue;

    const category = categories[categoryId];
    const clue = category.clues[clueId];

    if (clue.showing === null) {
      target.textContent = clue.question;
      clue.showing = 'question';
    } else if (clue.showing === 'question') {
      target.textContent = clue.answer;
      clue.showing = 'answer';
    }
  }
}

function showLoadingView() {
  const loadingSpinner = document.createElement('div');
  loadingSpinner.classList.add('loading-spinner');
  document.body.appendChild(loadingSpinner);
}

function hideLoadingView() {
  const loadingSpinner = document.querySelector('.loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.createElement('button');
  startButton.id = 'start-button';
  startButton.textContent = 'Start Game';
  document.body.appendChild(startButton);

  startButton.addEventListener('click', (event) => {
    event.preventDefault();
    setupAndStart();
  });

  document.querySelectorAll('td').forEach(td => {
    td.addEventListener('click', handleClick);
  });
});
