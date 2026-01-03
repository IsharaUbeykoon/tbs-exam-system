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
                   <!-- <span class="check-icon">✔</span>  -->
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
    const doc = new jsPDF({ compress: true });

    const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAYAAADGFbfiAAAACXBIWXMAAC4jAAAuIwF4pT92AAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI2LTAxLTAyVDE0OjAxOjQwKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNi0wMS0wMlQxNDowMzo0NCswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNi0wMS0wMlQxNDowMzo0NCswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMDNhYjEzYS1lOWUzLWMy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"; // keep your working logo here

    const left = 25;
    const right = 185;
    const width = right - left;
    const lh = 6;

    let y = 20;

    // ===== LOGO =====
    if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 85, y, 40, 20);
        y += 26;
    }

    // ===== HEADER =====
    doc.setFont("Times", "Bold");
    doc.setFontSize(16);
    doc.text("TBS INTERNATIONAL CAMPUS", 105, y, { align: "center" });
    y += lh + 2;

    doc.setFont("Times", "Normal");
    doc.setFontSize(11);
    doc.text("Faculty of Information Technology", 105, y, { align: "center" });
    y += lh;

    doc.text(
        "Diploma in Software Engineering with Artificial Intelligence",
        105,
        y,
        { align: "center" }
    );
    y += lh + 2;

    doc.line(left, y, right, y);
    y += lh + 2;

    // ===== STUDENT DETAILS =====
    doc.text(`Date: ${new Date().toLocaleDateString()}`, left, y); y += lh;
    doc.text(`Student Name: ${student.name}`, left, y); y += lh;
    doc.text(`NIC Number: ${student.nic}`, left, y); y += lh;
    doc.text(`Contact Number: ${student.phone}`, left, y); y += lh;
    doc.text(`Aptitude Test Score: ${scoreText.innerText.replace("Marks: ", "")}`, left, y);
    y += lh + 3;

    // ===== TITLE =====
    doc.setFont("Times", "Bold");
    doc.setFontSize(13);
    doc.text("SCHOLARSHIP OFFER LETTER", 105, y, { align: "center" });
    y += lh + 3;

    // ===== BODY (PROPER PARAGRAPHS) =====
    doc.setFont("Times", "Normal");
    doc.setFontSize(11);

    const p1 =
        "We are pleased to inform you that you have successfully passed the Aptitude Test conducted by TBS International Campus.";

    const p2 =
        "Based on your performance, you have been awarded a 50% Merit-Based Scholarship to enroll in the following program:";

    doc.text(p1, left, y, { maxWidth: width });
    y += doc.getTextDimensions(p1, { maxWidth: width }).h + lh;

    doc.text(p2, left, y, { maxWidth: width });
    y += doc.getTextDimensions(p2, { maxWidth: width }).h + lh;

    doc.setFont("Times", "Bold");
    doc.text(
        "Diploma in Software Engineering with Artificial Intelligence",
        left,
        y
    );
    y += lh;

    doc.text(
        "Faculty of Information Technology – TBS International Campus",
        left,
        y
    );
    y += lh + 3;

    // ===== SUMMARY =====
    doc.setFont("Times", "Bold");
    doc.text("Scholarship Summary", left, y);
    y += lh;

    doc.setFont("Times", "Normal");
    [
        "Scholarship Type: Merit-Based Academic Scholarship",
        "Scholarship Value: 50% reduction on total course fee",
        "Mode of Study: Full-time / Part-time (as applicable)",
        "Validity: Upcoming intake only"
    ].forEach(line => {
        doc.text("• " + line, left + 4, y);
        y += lh;
    });

    y += lh;

    // ===== NEXT STEP =====
    doc.setFont("Times", "Bold");
    doc.text("Next Step", left, y);
    y += lh;

    doc.setFont("Times", "Normal");
    doc.text(
        "Please contact the Admissions Office of TBS International Campus to complete the enrollment process.",
        left,
        y,
        { maxWidth: width }
    );
    y += doc.getTextDimensions(
        "Please contact the Admissions Office of TBS International Campus to complete the enrollment process.",
        { maxWidth: width }
    ).h + lh;

    // ===== CONTACT =====
    doc.setFont("Times", "Bold");
    doc.text("Official Contact Information", left, y);
    y += lh;

    doc.setFont("Times", "Normal");
    doc.text("Website: www.tbs.lk", left + 4, y); y += lh;
    doc.text("Admissions Hotline: +94 71 6 444 777", left + 4, y); y += lh;
    doc.text("Email: info@tbs.lk", left + 4, y); y += lh + 2;

    // ===== FOOTER =====
    doc.line(left, y, right, y);
    y += lh;

    doc.text(
        "Issued by: Academic Office – Faculty of Information Technology",
        left,
        y
    );
    y += lh;
    doc.text("TBS International Campus", left, y);

    doc.save(`TBS_Scholarship_Letter_${student.nic}.pdf`);
}











