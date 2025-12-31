// Globle Variable for exame question loading part -----------------------

let currentQuestionIndex = 0;
let studentAnswers = [];


/*

//Prevent refresh and re-entry during exam -------------------------------

if (localStorage.getItem("examStarted") === "true") {
    alert("You cannot re-enter the exam. Exam already started.");
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>Access Denied</h2>";
    throw new Error("Exam re-entry blocked");
}
//-------------------------------------------------------------------------

//Disable Refresh / Close Warning -----------------------------------------

window.onbeforeunload = function () {
    return "Exam is in progress. Leaving will submit the exam.";
};
//-------------------------------------------------------------------------



*/


// Utility function to shuffle array
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


const questions = [

/* ---------- BASIC IT & COMPUTING ---------- */

{
    q: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Control Processing Unit"],
    answer: 0
},
{
    q: "Which device is used to input text into a computer?",
    options: ["Monitor", "Printer", "Keyboard", "Speaker"],
    answer: 2
},
{
    q: "Which of the following is an operating system?",
    options: ["Google", "Windows", "Chrome", "Intel"],
    answer: 1
},
{
    q: "What is RAM mainly used for?",
    options: ["Long-term storage", "Temporary data storage", "Internet connection", "Power supply"],
    answer: 1
},

/* ---------- LOGICAL THINKING ---------- */

{
    q: "If 5 + 3 × 2 = ?",
    options: ["16", "11", "10", "13"],
    answer: 1
},
{
    q: "Which number comes next in the series: 2, 4, 8, 16, ?",
    options: ["18", "20", "24", "32"],
    answer: 3
},
{
    q: "If ALL bloops are razzies and ALL razzies are lazzies, then ALL bloops are?",
    options: ["Lazzies", "Razzies", "Bloops", "None"],
    answer: 0
},
{
    q: "Which shape has the most sides?",
    options: ["Triangle", "Square", "Pentagon", "Hexagon"],
    answer: 3
},

/* ---------- PROGRAMMING BASICS ---------- */

{
    q: "Which language is most commonly used to start learning programming?",
    options: ["Python", "Assembly", "Machine Code", "HTML"],
    answer: 0
},
{
    q: "What does a loop do in programming?",
    options: ["Stops execution", "Repeats instructions", "Deletes data", "Runs only once"],
    answer: 1
},
{
    q: "Which of these is a programming language?",
    options: ["HTML", "Python", "WiFi", "USB"],
    answer: 1
},
{
    q: "What symbol is commonly used for assignment in programming?",
    options: ["==", "=", "!=", "<>"],
    answer: 1
},

/* ---------- AI & ROBOTICS APTITUDE ---------- */

{
    q: "What does AI stand for?",
    options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Internet", "Automatic Interface"],
    answer: 1
},
{
    q: "Which of these is an example of Artificial Intelligence?",
    options: ["Calculator", "Washing Machine", "Voice Assistant", "Fan"],
    answer: 2
},
{
    q: "Which sensor helps a robot detect distance?",
    options: ["Temperature sensor", "Ultrasonic sensor", "Light sensor", "Sound sensor"],
    answer: 1
},
{
    q: "What is the main purpose of a robot?",
    options: ["Entertainment only", "Replace humans fully", "Perform tasks automatically", "Store data"],
    answer: 2
},

/* ---------- PROBLEM SOLVING ---------- */

{
    q: "If a program has an error, it is called a?",
    options: ["Bug", "Virus", "Loop", "Crash"],
    answer: 0
},
{
    q: "What should you do first when solving a problem?",
    options: ["Write code immediately", "Understand the problem", "Test the output", "Run the program"],
    answer: 1
},
{
    q: "Which skill is MOST important for a software engineer?",
    options: ["Fast typing", "Problem-solving", "Memorizing code", "Drawing"],
    answer: 1
},
{
    q: "Why is logical thinking important in programming?",
    options: ["To design algorithms", "To type faster", "To use the internet", "To install software"],
    answer: 0
}

];


let student = {};
let shuffledQuestions = [];





// Load Single Questions and handle answers --------------------------------------------------------- 

function handleAnswerOnce() {
    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) return;

    studentAnswers[currentQuestionIndex] = parseInt(selected.value);
    currentQuestionIndex++;

    if (currentQuestionIndex < shuffledQuestions.length) {
        setTimeout(loadSingleQuestion, 300); // smooth transition
    } else {
        submitExam();
    }
}


function loadSingleQuestion() {
    const form = document.getElementById("examForm");
    form.innerHTML = "";

    const q = shuffledQuestions[currentQuestionIndex];

    let div = document.createElement("div");
    div.className = "question";

    let options = shuffle(
        q.options.map((opt, idx) => ({ text: opt, index: idx }))
    );

    div.innerHTML = `
        <div class="question-box">
            <div class="question-meta">
                Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}
            </div>
            <div class="question-text">
                ${q.q}
            </div>
        </div>

        <div class="options-box">
            ${options.map(opt => `
                <label class="option-card">
				<span class="check-icon">￭  &nbsp </span>	
                    <input type="radio" name="answer" value="${opt.index}">
                    <span class="option-text">${opt.text}</span>
                </label>
            `).join("")}
        </div>
    `;

    form.appendChild(div);

    // AUTO-ADVANCE FIX
    div.addEventListener("change", handleAnswerOnce, { once: true });
}

// -----------------

function startExam() {
    

    const nameVal = document.getElementById("name").value.trim();
    const nicVal = document.getElementById("nic").value.trim();
    const phoneVal = document.getElementById("phone").value.trim();

    // Reset question state
    currentQuestionIndex = 0;
    studentAnswers = [];

    if (!nameVal || !nicVal || !phoneVal) {
        alert("Please fill all details");
        return;
    }


    student.name = nameVal;
    student.nic = nicVal;
    student.phone = phoneVal;


    // Lock exam session
    localStorage.setItem("examStarted", "true");

    // Shuffle questions
    shuffledQuestions = shuffle([...questions]);

    // 🔥 RESET TIMER HERE (THIS IS THE LINE YOU ASKED ABOUT)
    timeLeft = 30 * 60;

    // Show exam screen
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("examBox").classList.remove("hidden");

    // Load first question & start timer
    loadSingleQuestion();
    startTimer();
}


function submitExam() {
    clearInterval(timerInterval);

    let score = 0;

    shuffledQuestions.forEach((q, i) => {
        if (studentAnswers[i] === q.answer) {
            score++;
        }
    });

    let finalScore = score * 5;
    let status = finalScore >= 50 ? "PASS" : "FAIL";

    document.getElementById("examBox").classList.add("hidden");
    document.getElementById("resultBox").classList.remove("hidden");

    scoreText.innerText = `Marks: ${finalScore} / 100`;
    statusText.innerText = `Status: ${status}`;



		
		const scholarshipBox = document.getElementById("scholarshipBox");
const failBox = document.getElementById("failBox");
const resultTitle = document.getElementById("resultTitle");

if (finalScore >= 50) {
    // PASS
    resultTitle.innerText = "🎉 Congratulations!";
    scholarshipBox.classList.remove("hidden");
    failBox.classList.add("hidden");
} else {
    // FAIL
    resultTitle.innerText = "Exam Result";
    scholarshipBox.classList.add("hidden");
    failBox.classList.remove("hidden");
}





    localStorage.removeItem("examStarted");
    window.onbeforeunload = null;

    sendToGoogleSheet(finalScore, status);
}




function sendToGoogleSheet(mark, status) {
    fetch("https://script.google.com/macros/s/AKfycbx1C29tREY-yl8-ecFWzECeRodzlnsKOtNBzpslVWV14IJmS5PG3wZMS0mGcrGIp9Zf/exec", {
        method: "POST",
        body: JSON.stringify({
            name: student.name,
            nic: student.nic,
            phone: student.phone,
            mark: mark,
            status: status
        })
    });
}


// Timer ---------------------------------------------------------------

let timeLeft = 30 * 60; // 30 minutes
let timerInterval;


function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        document.getElementById("timer").innerText =
            `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Exam will be submitted.");
            submitExam();
        }
    }, 1000);
}




// Auto scroll function -----------------------------------


function confirmSubmit() {
    const totalQuestions = shuffledQuestions.length;

    // Count answered questions
    const answeredCount = studentAnswers.filter(
        ans => ans !== undefined
    ).length;

    // If not all answered → BLOCK submission
    if (answeredCount < totalQuestions) {
        alert(
            `⚠️ Exam not completed!\n\n` +
            `You have answered ${answeredCount} out of ${totalQuestions} questions.\n` +
            `Please complete all questions before submitting.`
        );

        // Return student to exam
        document.getElementById("resultBox").classList.add("hidden");
        document.getElementById("examBox").classList.remove("hidden");
        return;
    }

    // All questions answered → allow submission
    const sure = confirm(
        "You have answered all questions.\nAre you sure you want to submit the exam?"
    );

    if (sure) {
        submitExam();
    }
}



// -------------------------------------------- PDF GEN

function downloadScholarshipPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Page settings
    doc.setFont("Times", "Normal");

    // Header
    doc.setFontSize(16);
    doc.text("TBS International Campus", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(
        "Diploma in Software Engineering & Artificial Intelligence",
        105,
        28,
        { align: "center" }
    );

    doc.line(20, 32, 190, 32);

    // Body
    doc.setFontSize(11);
    doc.text("SCHOLARSHIP OFFER LETTER", 105, 42, { align: "center" });

    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);

    doc.text(`Student Name: ${student.name}`, 20, 65);
    doc.text(`NIC Number: ${student.nic}`, 20, 72);
    doc.text(`Phone Number: ${student.phone}`, 20, 79);

    doc.text(
        `Aptitude Test Score: ${scoreText.innerText.replace("Marks: ", "")}`,
        20,
        90
    );

    doc.text(
        `We are pleased to inform you that you have successfully passed the`,
        20,
        105
    );
    doc.text(
        `Aptitude Test conducted by TBS International Campus.`,
        20,
        112
    );

    doc.text(
        `Based on your performance, you are hereby awarded a`,
        20,
        124
    );

    doc.setFont("Times", "Bold");
    doc.text(
        `50% SCHOLARSHIP`,
        20,
        131
    );

    doc.setFont("Times", "Normal");
    doc.text(
        `to enroll in the Diploma in Software Engineering with Artificial Intelligence.`,
        20,
        138
    );

    doc.text(
        `This scholarship is valid for the upcoming intake only and is subject`,
        20,
        150
    );
    doc.text(
        `to completing the enrollment process within the specified time frame.`,
        20,
        157
    );

    doc.text(
        `For enrollment and further details, please contact our admissions office.`,
        20,
        170
    );

    // Footer
    doc.line(20, 180, 190, 180);

    doc.text("Academic Office", 20, 190);
    doc.text("TBS International Campus", 20, 197);

    // Save PDF
    doc.save(`TBS_Scholarship_Letter_${student.nic}.pdf`);
}


