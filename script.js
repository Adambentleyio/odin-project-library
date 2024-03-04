console.log("loaded")
let submit = document.getElementById('submit-book')
submit.addEventListener('submit', handleFormSubmit)

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded")
  let defaultBooks = [{
      title: "Six easy pieces",
      author: "Richard Feynman",
      pages: 300,
      read: true
  },
  {
    title: "Six not so easy pieces",
    author: "Richard Feynman",
    pages: 301,
    read: false
},
{
  title: "Neuromancer",
  author: "William Gibson",
  pages: 362,
  read: false
}
]

defaultBooks.map(book => addBook(book.title, book.author, book.read, book.pages))
render()
console.log(library)

})

let library = []

function Book(title, author, read = false, pages = '') {
  this.title = title,
    this.author = author,
    this.read = read,
    this.pages = pages
}

function addBook(title, author, read, pages) {
  library.push(new Book(title, author, read, pages))
}

function deleteBook() {
  console.log(this)
  const parentContainer = this.parentNode
  const bookIndex = parentContainer.parentNode.dataset.index
  console.log(bookIndex)
  library = library.filter((_, index) => index !== parseInt(bookIndex))
  render()
}

function render(){
  const booksInLibrary = document.querySelector('.library')
  booksInLibrary.innerHTML = '';
  library.forEach(function (book, index) {
    // Create a div for the card
    const cardDiv = document.createElement('div');
    const cardInnerDiv = document.createElement('div');
    cardDiv.append(cardInnerDiv)
    cardInnerDiv.classList.add('uk-card', 'uk-card-default', 'uk-card-body');

    // Create elements for title, author, and other details
    const titleElement = document.createElement('h3');
    titleElement.classList.add('uk-card-title');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.classList.add('uk-text-bold');
    authorElement.textContent = `Author: ${book.author}`;

    const pagesElement = document.createElement('p');
    pagesElement.textContent = `Pages: ${book.pages}`;

    cardDiv.dataset.index = index

    // Optionally, add a badge for read/unread status
    const statusBadge = document.createElement('p');
    statusBadge.classList.add('uk-text-meta');
    statusBadge.textContent = book.read ? 'Read' : 'Unread';

    const deleteButton = document.createElement('button')
    deleteButton.classList.add('uk-button', 'uk-button-secondary', 'uk-button-small')
    deleteButton.textContent = "Delete"

    deleteButton.addEventListener('click', deleteBook)

    // Append title, author, and other elements to the card
    cardInnerDiv.appendChild(titleElement);
    cardInnerDiv.appendChild(authorElement);
    cardInnerDiv.appendChild(pagesElement);
    cardInnerDiv.appendChild(statusBadge);
    cardInnerDiv.appendChild(deleteButton)

    // Append the card to the book list
    booksInLibrary.appendChild(cardDiv);
  });
}



function handleFormSubmit(event) {
  event.preventDefault();
  console.log("Handling submit")

  try {
     // Extract values
     console.log("Inside try block");
    let title = document.getElementById('title');
    let author = document.getElementById('author');
    let pages = document.getElementById('pages');
    let read = document.getElementById('read');

    let isDuplicate = library.filter(book => book.title == title.value)

    console.log("is it a dupe: ", isDuplicate)

    if (isDuplicate.length > 0) throw new Error("Duplicate book title")

      // Attempt to add the book
      addBook(title.value, author.value, read.checked, parseInt(pages.value));


    // Clear input fields
    title.value = '';
    author.value = '';
    pages.value = '';
    read.checked = false;

    // If adding the book is successful, render the library
    const modal = document.getElementById('modal-add-book');
    const modalInstance = UIkit.modal(modal);
    modalInstance.hide();
    render();

  } catch(error) {
    // If adding the book fails, throw an error
    // If adding the book fails, display an error message to the user
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to add the book. Please check the input data.';
    errorMessage.classList.add('error-message');

    // Append the error message to a suitable element in the DOM
    const formContainer = document.getElementById('form-container');
    formContainer.appendChild(errorMessage);

    // Optionally, you can remove the error message after a certain time period
    setTimeout(() => {
        errorMessage.remove();
    }, 5000); // Remove the error message after 5 seconds
    throw new Error('Failed to add the book. Please check the input data.');
  }

  // Get the modal element
const modal = document.getElementById('modal-add-book');

// Listen for the modal hide event
modal.addEventListener('hide.uk.modal', function () {
    // Clear the input fields
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('pages').value = '';
    document.getElementById('read').checked = false;
});
}

// Get the modal element
const modal = document.getElementById('modal-add-book');

// Create a MutationObserver
const observer = new MutationObserver(function(mutationsList) {
    // Check if the 'uk-open' class is present
    const isOpen = modal.classList.contains('uk-open');

    if (!isOpen) {
        // Clear the input fields
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('pages').value = '';
        document.getElementById('read').checked = false;
    }
});

// Start observing changes to the attributes of the modal element
observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
