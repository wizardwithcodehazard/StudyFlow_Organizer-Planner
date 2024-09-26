document.addEventListener("DOMContentLoaded", () => {
    // Data storage
    const courses = [];
    const habits = [];
    const quizzes = [];
    const resources = [];

    // DOM Elements
    const coursesList = document.getElementById("coursesList");
    const habitsList = document.getElementById("habitsList");
    const quizzesList = document.getElementById("quizzesList");
    const analyticsContent = document.getElementById("analyticsContent");
    const resourcesList = document.getElementById("resourcesList");

    const courseForm = document.getElementById("courseForm");
    const habitForm = document.getElementById("habitForm");
    const quizForm = document.getElementById("quizForm");
    const resourceForm = document.getElementById("resourceForm");

    // Event listeners
    courseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addCourse();
    });

    habitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addHabit();
    });

    quizForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addQuiz();
    });

    resourceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleResourceUpload();
    });

    document.querySelectorAll(".tab-button").forEach(tab => {
        tab.addEventListener("click", () => showTab(tab.id.replace('Tab', '')));
    });

    // Handle resource file upload
    function handleResourceUpload() {
        const fileInput = document.getElementById("resourceFile");
        const files = Array.from(fileInput.files);
        if (files.length) {
            files.forEach(addResource);
            fileInput.value = ''; // Reset the file input
        }
    }

    // Show the selected tab
    function showTab(tab) {
        document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));

        document.getElementById(`${tab}Section`).classList.add('active');
        document.getElementById(`${tab}Tab`).classList.add('active');

        if (tab === 'analytics') {
            renderAnalytics();
        }
    }

    // Add a course
    function addCourse() {
        const name = document.getElementById("courseName").value;
        const startDate = document.getElementById("courseStartDate").value;
        const endDate = document.getElementById("courseEndDate").value;

        if (!name || !startDate || !endDate) {
            alert("Please fill in all fields for the course.");
            return;
        }

        const course = { id: Date.now(), name, startDate, endDate, progress: 0 };
        courses.push(course);
        renderCourses();
        courseForm.reset();
        renderAnalytics(); // Update analytics after adding a course
    }

    // Add a habit
    function addHabit() {
        const name = document.getElementById("habitName").value;

        if (!name) {
            alert("Please enter a habit name.");
            return;
        }

        const habit = { id: Date.now(), name, streak: 0, completedToday: false };
        habits.push(habit);
        renderHabits();
        habitForm.reset();
        renderAnalytics(); // Update analytics after adding a habit
    }

    // Add a quiz
    function addQuiz() {
        const name = document.getElementById("quizName").value;
        const score = document.getElementById("quizScore").value;

        if (!name || score === "") {
            alert("Please fill in all fields for the quiz.");
            return;
        }

        const quiz = { id: Date.now(), name, score: parseFloat(score) };
        quizzes.push(quiz);
        renderQuizzes();
        quizForm.reset();
        renderAnalytics(); // Update analytics after adding a quiz
    }

    // Add a resource
    function addResource(file) {
        const fileURL = URL.createObjectURL(file);
        const uploadDate = new Date().toLocaleDateString();
        const resourceItem = document.createElement('div');

        resourceItem.className = 'resource-item';
        resourceItem.innerHTML = `    
            <div>
                ${file.name} 
                <span>Uploaded on: ${uploadDate}</span> 
                <a href="${fileURL}" target="_blank" class="view-btn">View PDF</a>
                <a href="analyzer.html?file=${encodeURIComponent(file.name)}" target="_blank" class="analyze-btn">Analyze</a>
            </div>
        `;
        resourcesList.appendChild(resourceItem);
        resources.push(file); // Optional: Store uploaded resources
    }

    // Render courses
    function renderCourses() {
        coursesList.innerHTML = courses.map(course => `
            <div class="course-item">
                <div>${course.name} (${course.startDate} to ${course.endDate}) - Progress: ${course.progress}%</div>
                <input type="range" value="${course.progress}" min="0" max="100" onchange="updateCourseProgress(${course.id}, this.value)">
                <span class="progress-value" id="progressValue-${course.id}">${course.progress}%</span>
                <button onclick="deleteCourse(${course.id})">Delete</button>
            </div>
        `).join('');
    }

    // Render habits
    function renderHabits() {
        habitsList.innerHTML = habits.map(habit => `
            <div class="habit-item">
                <div>${habit.name} - Streak: ${habit.streak} days</div>
                <button onclick="markHabitCompleted(${habit.id})" class="align">Mark Completed</button>
                <button onclick="deleteHabit(${habit.id})">Delete</button>
            </div>
        `).join('');
    }

    // Render quizzes
    function renderQuizzes() {
        quizzesList.innerHTML = quizzes.map(quiz => `
            <div class="quiz-item">
                <div>${quiz.name} - Score: ${quiz.score}</div>
                <button onclick="deleteQuiz(${quiz.id})">Delete</button>
            </div>
        `).join('');
    }

    // Render analytics
    function renderAnalytics() {
        analyticsContent.innerHTML = `
            <h3>Analytics</h3>
            <p>Total Courses: ${courses.length}</p>
            <p>Total Habits: ${habits.length}</p>
            <p>Total Quizzes: ${quizzes.length}</p>
            <p>Overall Course Progress: ${calculateAverageProgress()}%</p>
            <p>Longest Habit Streak: ${calculateLongestHabitStreak()} days</p>
            <p>Average Quiz Score: ${calculateAverageQuizScore()}</p>
        `;
    }

    // Calculate average course progress
    function calculateAverageProgress() {
        if (!courses.length) return 0;
        const totalProgress = courses.reduce((sum, course) => sum + parseFloat(course.progress), 0);
        return (totalProgress / courses.length).toFixed(2);
    }

    // Calculate longest habit streak
    function calculateLongestHabitStreak() {
        if (!habits.length) return 0;
        return Math.max(...habits.map(habit => habit.streak));
    }

    // Calculate average quiz score
    function calculateAverageQuizScore() {
        if (!quizzes.length) return 0;
        const totalScore = quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
        return (totalScore / quizzes.length).toFixed(2);
    }

    // Global functions to manage courses, habits, and quizzes
    window.updateCourseProgress = function(id, value) {
        const course = courses.find(course => course.id === id);
        if (course) {
            course.progress = value;
            document.getElementById(`progressValue-${id}`).textContent = `${value}%`;
            renderAnalytics(); // Update analytics when progress changes
        }
    };

    window.deleteCourse = function(id) {
        const index = courses.findIndex(course => course.id === id);
        if (index > -1) {
            courses.splice(index, 1);
            renderCourses();
            renderAnalytics(); // Update analytics after deleting a course
        }
    };

    window.markHabitCompleted = function(id) {
        const habit = habits.find(h => h.id === id);
        if (!habit.completedToday) {
            habit.streak++;
            habit.completedToday = true;
        } else {
            alert('You have already completed this habit today!');
        }
        renderHabits();
        renderAnalytics(); // Update analytics when marking a habit as completed
    };

    window.deleteHabit = function(id) {
        const index = habits.findIndex(habit => habit.id === id);
        if (index > -1) {
            habits.splice(index, 1);
            renderHabits();
            renderAnalytics(); // Update analytics after deleting a habit
        }
    };

    window.deleteQuiz = function(id) {
        const index = quizzes.findIndex(quiz => quiz.id === id);
        if (index > -1) {
            quizzes.splice(index, 1);
            renderQuizzes();
            renderAnalytics(); // Update analytics after deleting a quiz
        }
    };

    // Initial render of lists and analytics
    renderCourses();
    renderHabits();
    renderQuizzes();
    renderAnalytics();
});

document.addEventListener("DOMContentLoaded", () => {
    // Data storage
    const courses = [];
    const habits = [];
 const quizzes = [];
    const resources = [];
    const blogs = [];

    // Function to add course
    const addCourse = (courseName) => {
        const course = {
            name: courseName,
            addedDate: new Date().toLocaleDateString(),
            completedDate: null
        };
        courses.push(course);
        displayCourses();
    };

    // Function to display courses
    const displayCourses = () => {
        const coursesList = document.getElementById("coursesList");
        coursesList.innerHTML = "";
        courses.forEach((course) => {
            const courseHTML = `
                <div>
                    <h3>${course.name}</h3>
                    <p>Added on: ${course.addedDate}</p>
                    <p>Completed on: ${course.completedDate ? course.completedDate : "Not completed"}</p>
                    <button class="complete-button">Mark as Completed</button>
                </div>
            `;
            coursesList.innerHTML += courseHTML;
        });
    };

    // Function to mark course as completed
    const markCourseAsCompleted = (courseIndex) => {
        const course = courses[courseIndex];
        course.completedDate = new Date().toLocaleDateString();
        displayCourses();
    };

    // Event listeners
    document.getElementById("courseForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const courseName = document.getElementById("courseName").value;
        addCourse(courseName);
        document.getElementById("courseName").value = "";
    });

    document.getElementById("coursesList").addEventListener("click", (e) => {
        if (e.target.classList.contains("complete-button")) {
            const courseIndex = Array.prototype.indexOf.call(e.target.parentNode.parentNode.children, e.target.parentNode);
            markCourseAsCompleted(courseIndex);
        }
    });
});