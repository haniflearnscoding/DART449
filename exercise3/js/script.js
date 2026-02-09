// Get DOM elements
const submitBtn = document.getElementById('submitBtn');
const answer1Input = document.getElementById('answer1');
const answer2Input = document.getElementById('answer2');
const resultDiv = document.getElementById('resultDiv');
const scoreDisplay = document.getElementById('scoreDisplay');
const feedback = document.getElementById('feedback');
const emoji = document.getElementById('emoji');

// Event listener for submit button
submitBtn.addEventListener('click', checkAnswers);

// Also allow Enter key to submit
answer1Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswers();
});

answer2Input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswers();
});

// Function to check answers and calculate score
function checkAnswers() {
    let score = 0;
    const ans1 = answer1Input.value.trim().toLowerCase();
    const ans2 = answer2Input.value.trim().toLowerCase();

    // Check Question 1 - accept "javascript" or "js"
    if (ans1 === 'javascript' || ans1 === 'js') {
        score += 10;
    }

    // Check Question 2 - accept full form or variations
    if (ans2 === 'cascading style sheets' || 
        ans2 === 'cascading stylesheets' ||
        ans2 === 'cascading style sheet') {
        score += 10;
    }

    // Display results
    displayResults(score);
}

// Function to display results with conditional feedback
function displayResults(score) {
    scoreDisplay.textContent = score + ' / 20 points';
    
    // Conditional statements for different score ranges
    if (score === 20) {
        feedback.textContent = 'Perfect score! You nailed it! 🎉';
        emoji.textContent = '🏆';
        resultDiv.style.background = '#d4edda';
    } else if (score >= 10) {
        feedback.textContent = 'Good job! You got one right.';
        emoji.textContent = '👍';
        resultDiv.style.background = '#fff3cd';
    } else {
        feedback.textContent = 'Keep studying! Try again.';
        emoji.textContent = '📚';
        resultDiv.style.background = '#f8d7da';
    }

    // Show the result div
    resultDiv.classList.add('show');
}
