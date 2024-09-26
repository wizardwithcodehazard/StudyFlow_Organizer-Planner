const quizContainer = document.getElementById('quizContainer');
const quizQuestions = JSON.parse(sessionStorage.getItem('quizQuestions')) || [];

// Render quiz questions dynamically
function renderQuestions() {
    quizQuestions.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'quiz-question'; // Add a class for styling
        questionElement.innerHTML = `
            <p>${index + 1}. ${question}</p>
            <input type="text" class="answer" placeholder="Your answer" />
        `;
        quizContainer.appendChild(questionElement);
    });
}

// Handle quiz submission
document.getElementById('submitQuiz').addEventListener('click', function() {
    const answers = [...document.getElementsByClassName('answer')].map(input => input.value.trim());
    
    if (answers.some(answer => answer === '')) {
        alert("Please answer all questions before submitting.");
        return; // Prevent submission if any answer is empty
    }

    const results = calculateResults(answers);
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    window.location.href = 'results.html'; // Redirect to results page
});

// Function to calculate results
function calculateResults(answers) {
    // Here you can compare answers with the original flashcard answers
    // Implement your grading logic based on stored correct answers
    // Placeholder logic for illustration purposes
    const correctAnswers = JSON.parse(sessionStorage.getItem('flashcardAnswers')) || []; // Assuming this is stored
    const score = answers.reduce((acc, answer, index) => {
        return acc + (answer.toLowerCase() === correctAnswers[index].toLowerCase() ? 1 : 0);
    }, 0);

    return {
        score: score,
        total: correctAnswers.length,
        answers: answers
    };
}

// Initialize the quiz by rendering questions
renderQuestions();
