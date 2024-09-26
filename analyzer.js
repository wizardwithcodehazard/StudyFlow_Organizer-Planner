// analyzer.js

const fileInput = document.getElementById('fileInput');
const pdfContainer = document.getElementById('pdfContainer');
let pdfDocument = null; // Store the loaded PDF document
let currentPage = 1; // Track the current page
let scale = 1; // Initialize scale variable for zoom

fileInput.addEventListener('change', handleFileSelect);

// Handle PDF file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const typedarray = new Uint8Array(this.result);
            loadPDF(typedarray);
        };
        fileReader.readAsArrayBuffer(file);
    } else {
        alert("Please upload a valid PDF file.");
    }
}

// Load PDF document using PDF.js
function loadPDF(typedarray) {
    pdfjsLib.getDocument(typedarray).promise.then(pdf => {
        pdfDocument = pdf; // Store the loaded document
        renderPage(currentPage); // Render the first page
    });
}

// Render a specific page
function renderPage(pageNumber) {
    pdfDocument.getPage(pageNumber).then(page => {
        const pdfViewport = page.getViewport({ scale: scale }); // Use current scale
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = pdfViewport.height;
        canvas.width = pdfViewport.width;

        // Clear previous content and append the new canvas
        pdfContainer.innerHTML = ''; 
        pdfContainer.appendChild(canvas);

        // Render the PDF page into the canvas context
        const renderContext = {
            canvasContext: context,
            viewport: pdfViewport // Use the current viewport
        };
        page.render(renderContext);
    });
}

// Event listener for keydown to handle page navigation and zooming
document.addEventListener('keydown', (event) => {
    if (pdfDocument) { // Check if a PDF is loaded
        switch (event.key) {
            case 'ArrowRight': // Go to next page
                if (currentPage < pdfDocument.numPages) {
                    currentPage++;
                    renderPage(currentPage);
                }
                break;
            case 'ArrowLeft': // Go to previous page
                if (currentPage > 1) {
                    currentPage--;
                    renderPage(currentPage);
                }
                break;
            case '+': // Zoom in
                scale = Math.min(3, scale + 0.1); // Increase scale, max 3
                renderPage(currentPage); // Re-render current page
                break;
            case '-': // Zoom out
                scale = Math.max(0.1, scale - 0.1); // Decrease scale, min 0.1
                renderPage(currentPage); // Re-render current page
                break;
        }
    }
});

// Flashcard generation functionality
document.getElementById('generateFlashcard').addEventListener('click', function() {
    const flashcardQuestion = document.getElementById('flashcardQuestion').value;
    const flashcardAnswer = document.getElementById('flashcardAnswer').value;

    if (flashcardQuestion.trim() && flashcardAnswer.trim()) {
        addFlashcard(flashcardQuestion, flashcardAnswer);
    } else {
        alert("Please enter both question and answer.");
    }
});

// Function to add a flashcard to the list
function addFlashcard(question, answer) {
    const flashcardList = document.getElementById('flashcardList');
    const flashcardItem = document.createElement('div');
    flashcardItem.className = 'flashcard-item';
    flashcardItem.innerHTML = `<strong>Q:</strong> ${question}<br><strong>A:</strong> ${answer}`;
    flashcardList.appendChild(flashcardItem);
    
    // Clear textareas
    document.getElementById('flashcardQuestion').value = '';
    document.getElementById('flashcardAnswer').value = '';
}

// Quiz generation functionality
document.getElementById('generateQuiz').addEventListener('click', function() {
    const flashcards = [...document.getElementsByClassName('flashcard-item')];
    const questions = flashcards.map(card => card.innerHTML.split('<br>')[0]);

    if (questions.length > 0) {
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        sessionStorage.setItem('quizQuestions', JSON.stringify(shuffledQuestions));
        window.location.href = 'quiz.html'; // Redirect to quiz page
    } else {
        alert("Please add flashcards before generating a quiz.");
    }
});

// Resize event listener to re-render PDF pages
window.addEventListener('resize', function() {
    if (pdfDocument) {
        renderPage(currentPage); // Re-render current page on resize
    }
});
