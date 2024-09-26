const resultsContainer = document.getElementById('resultsContainer');
const results = JSON.parse(sessionStorage.getItem('quizResults'));

resultsContainer.innerHTML = `
    <h2>Your Score: ${results.score}</h2>
    <h3>Your Answers:</h3>
    <ul>
        ${results.answers.map(answer => `<li>${answer}</li>`).join('')}
    </ul>
`;
