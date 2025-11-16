// Question data
const questionsData = [
  {questionid: 1, filename: "Question1.PNG", answer: "A"},
  {questionid: 2, filename: "Question2.PNG", answer: "A"},
  {questionid: 3, filename: "Question3.PNG", answer: "A"},
  {questionid: 4, filename: "Question4.PNG", answer: "A"},
  {questionid: 5, filename: "Question5.PNG", answer: "A"},
  {questionid: 6, filename: "Question6.PNG", answer: "A"},
  {questionid: 7, filename: "Question7.PNG", answer: "A"},
  {questionid: 8, filename: "Question8.PNG", answer: "A"},
  {questionid: 9, filename: "Question9.PNG", answer: "A"},
  {questionid: 10, filename: "Question10.PNG", answer: "A"},
  {questionid: 11, filename: "Question11.PNG", answer: "A"},
  {questionid: 12, filename: "Question12.PNG", answer: "A"},
  {questionid: 13, filename: "Question13.PNG", answer: "A"},
  {questionid: 14, filename: "Question14.PNG", answer: "B"},
  {questionid: 15, filename: "Question15.PNG", answer: "B"},
  {questionid: 16, filename: "Question16.PNG", answer: "B"},
  {questionid: 17, filename: "Question17.PNG", answer: "B"},
  {questionid: 18, filename: "Question18.PNG", answer: "B"},
  {questionid: 19, filename: "Question19.PNG", answer: "B"},
  {questionid: 20, filename: "Question20.PNG", answer: "D"},
  {questionid: 21, filename: "Question21.PNG", answer: "C"},
  {questionid: 22, filename: "Question22.PNG", answer: "C"},
  {questionid: 23, filename: "Question23.PNG", answer: "C"},
  {questionid: 24, filename: "Question24.PNG", answer: "C"},
  {questionid: 25, filename: "Question25.PNG", answer: "C"},
  {questionid: 26, filename: "Question26.PNG", answer: "C"},
  {questionid: 27, filename: "Question27.PNG", answer: "C"},
  {questionid: 28, filename: "Question28.PNG", answer: "C"},
  {questionid: 29, filename: "Question29.PNG", answer: "C"},
  {questionid: 30, filename: "Question30.PNG", answer: "D"},
  {questionid: 31, filename: "Question31.PNG", answer: "D"},
  {questionid: 32, filename: "Question32.PNG", answer: "D"},
  {questionid: 33, filename: "Question33.PNG", answer: "D"},
  {questionid: 34, filename: "Question34.PNG", answer: "D"},
  {questionid: 35, filename: "Question35.PNG", answer: "D"},
  {questionid: 36, filename: "Question36.PNG", answer: "D"},
  {questionid: 37, filename: "Question37.PNG", answer: "D"},
  {questionid: 38, filename: "Question38.PNG", answer: "A"},
  {questionid: 39, filename: "Question39.PNG", answer: "A"},
  {questionid: 40, filename: "Question40.PNG", answer: "A"},
  {questionid: 41, filename: "Question41.PNG", answer: "A"},
  {questionid: 42, filename: "Question42.PNG", answer: "A"},
  {questionid: 43, filename: "Question43.PNG", answer: "A"},
  {questionid: 44, filename: "Question44.PNG", answer: "A"},
  {questionid: 45, filename: "Question45.PNG", answer: "A"},
  {questionid: 46, filename: "Question46.PNG", answer: "B"},
  {questionid: 47, filename: "Question47.PNG", answer: "B"},
  {questionid: 48, filename: "Question48.PNG", answer: "B"},
  {questionid: 49, filename: "Question49.PNG", answer: "B"},
  {questionid: 50, filename: "Question50.PNG", answer: "C"},
  {questionid: 51, filename: "Question51.PNG", answer: "C"},
  {questionid: 52, filename: "Question52.PNG", answer: "C"},
  {questionid: 53, filename: "Question53.PNG", answer: "C"},
  {questionid: 54, filename: "Question54.PNG", answer: "C"},
  {questionid: 55, filename: "Question55.PNG", answer: "C"},
  {questionid: 56, filename: "Question56.PNG", answer: "C"},
  {questionid: 57, filename: "Question57.PNG", answer: "C"},
  {questionid: 58, filename: "Question58.PNG", answer: "C"},
  {questionid: 59, filename: "Question59.PNG", answer: "D"},
  {questionid: 60, filename: "Question60.PNG", answer: "D"},
  {questionid: 61, filename: "Question61.PNG", answer: "D"},
  {questionid: 62, filename: "Question62.PNG", answer: "D"},
  {questionid: 63, filename: "Question63.PNG", answer: "D"},
  {questionid: 64, filename: "Question64.PNG", answer: "D"},
  {questionid: 65, filename: "Question65.PNG", answer: "D"},
  {questionid: 66, filename: "Question66.PNG", answer: "D"},
  {questionid: 67, filename: "Question67.PNG", answer: "A"},
  {questionid: 68, filename: "Question68.PNG", answer: "A"},
  {questionid: 69, filename: "Question69.PNG", answer: "A"},
  {questionid: 70, filename: "Question70.PNG", answer: "A"},
  {questionid: 71, filename: "Question71.PNG", answer: "A"},
  {questionid: 72, filename: "Question72.PNG", answer: "A"},
  {questionid: 73, filename: "Question73.PNG", answer: "A"},
  {questionid: 74, filename: "Question74.PNG", answer: "A"},
  {questionid: 75, filename: "Question75.PNG", answer: "A"},
  {questionid: 76, filename: "Question76.PNG", answer: "A"},
  {questionid: 77, filename: "Question77.PNG", answer: "A"},
  {questionid: 78, filename: "Question78.PNG", answer: "A"},
  {questionid: 79, filename: "Question79.PNG", answer: "A"},
  {questionid: 80, filename: "Question80.PNG", answer: "A"},
  {questionid: 81, filename: "Question81.PNG", answer: "B"},
  {questionid: 82, filename: "Question82.PNG", answer: "B"},
  {questionid: 83, filename: "Question83.PNG", answer: "A"},
  {questionid: 84, filename: "Question84.PNG", answer: "A"},
  {questionid: 85, filename: "Question85.PNG", answer: "A"},
  {questionid: 86, filename: "Question86.PNG", answer: "A"},
  {questionid: 87, filename: "Question87.PNG", answer: "A"},
  {questionid: 88, filename: "Question88.PNG", answer: "A"},
  {questionid: 89, filename: "Question89.PNG", answer: "A"},
  {questionid: 90, filename: "Question90.PNG", answer: "A"},
  {questionid: 91, filename: "Question91.PNG", answer: "A"},
  {questionid: 92, filename: "Question92.PNG", answer: "A"},
  {questionid: 93, filename: "Question93.PNG", answer: "A"},
  {questionid: 94, filename: "Question94.PNG", answer: "B"},
  {questionid: 95, filename: "Question95.PNG", answer: "B"},
  {questionid: 96, filename: "Question96.PNG", answer: "B"},
  {questionid: 97, filename: "Question97.PNG", answer: "B"},
  {questionid: 98, filename: "Question98.PNG", answer: "B"},
  {questionid: 99, filename: "Question99.PNG", answer: "B"},
  {questionid: 100, filename: "Question100.PNG", answer: "B"},
  {questionid: 101, filename: "Question101.PNG", answer: "B"},
  {questionid: 102, filename: "Question102.PNG", answer: "B"},
  {questionid: 103, filename: "Question103.PNG", answer: "B"},
  {questionid: 104, filename: "Question104.PNG", answer: "B"},
  {questionid: 105, filename: "Question105.PNG", answer: "B"},
  {questionid: 106, filename: "Question106.PNG", answer: "B"},
  {questionid: 107, filename: "Question107.PNG", answer: "B"},
  {questionid: 108, filename: "Question108.PNG", answer: "B"},
  {questionid: 109, filename: "Question109.PNG", answer: "B"},
  {questionid: 110, filename: "Question110.PNG", answer: "B"},
  {questionid: 111, filename: "Question111.PNG", answer: "B"},
  {questionid: 112, filename: "Question112.PNG", answer: "B"},
  {questionid: 113, filename: "Question113.PNG", answer: "C"},
  {questionid: 114, filename: "Question114.PNG", answer: "C"},
  {questionid: 115, filename: "Question115.PNG", answer: "C"},
  {questionid: 116, filename: "Question116.PNG", answer: "C"},
  {questionid: 117, filename: "Question117.PNG", answer: "C"},
  {questionid: 118, filename: "Question118.PNG", answer: "A"},
  {questionid: 119, filename: "Question119.PNG", answer: "C"},
  {questionid: 120, filename: "Question120.PNG", answer: "A"},
  {questionid: 121, filename: "Question121.PNG", answer: "C"},
  {questionid: 122, filename: "Question122.PNG", answer: "C"},
  {questionid: 123, filename: "Question123.PNG", answer: "C"},
  {questionid: 124, filename: "Question124.PNG", answer: "C"},
  {questionid: 125, filename: "Question125.PNG", answer: "C"},
  {questionid: 126, filename: "Question126.PNG", answer: "C"},
  {questionid: 127, filename: "Question127.PNG", answer: "C"},
  {questionid: 128, filename: "Question128.PNG", answer: "C"},
  {questionid: 129, filename: "Question129.PNG", answer: "C"},
  {questionid: 130, filename: "Question130.PNG", answer: "C"},
  {questionid: 131, filename: "Question131.PNG", answer: "D"},
  {questionid: 132, filename: "Question132.PNG", answer: "D"},
  {questionid: 133, filename: "Question133.PNG", answer: "D"},
  {questionid: 134, filename: "Question134.PNG", answer: "D"},
  {questionid: 135, filename: "Question135.PNG", answer: "D"},
  {questionid: 136, filename: "Question136.PNG", answer: "D"},
  {questionid: 137, filename: "Question137.PNG", answer: "D"},
  {questionid: 138, filename: "Question138.PNG", answer: "D"},
  {questionid: 139, filename: "Question139.PNG", answer: "D"},
  {questionid: 140, filename: "Question140.PNG", answer: "D"},
  {questionid: 141, filename: "Question141.PNG", answer: "A"},
  {questionid: 142, filename: "Question142.PNG", answer: "A"},
  {questionid: 144, filename: "Question144.PNG", answer: "A"},
  {questionid: 145, filename: "Question145.PNG", answer: "A"},
  {questionid: 146, filename: "Question146.PNG", answer: "A"},
  {questionid: 147, filename: "Question147.PNG", answer: "A"},
  {questionid: 148, filename: "Question148.PNG", answer: "A"},
  {questionid: 149, filename: "Question149.PNG", answer: "B"},
  {questionid: 150, filename: "Question150.PNG", answer: "B"},
  {questionid: 151, filename: "Question151.PNG", answer: "B"},
  {questionid: 152, filename: "Question152.PNG", answer: "B"},
  {questionid: 153, filename: "Question153.PNG", answer: "B"},
  {questionid: 154, filename: "Question154.PNG", answer: "C"},
  {questionid: 155, filename: "Question155.PNG", answer: "C"},
  {questionid: 156, filename: "Question156.PNG", answer: "C"},
  {questionid: 157, filename: "Question157.PNG", answer: "D"},
  {questionid: 158, filename: "Question158.PNG", answer: "C"},
  {questionid: 159, filename: "Question159.PNG", answer: "C"},
  {questionid: 160, filename: "Question160.PNG", answer: "C"},
  {questionid: 161, filename: "Question161.PNG", answer: "C"},
  {questionid: 162, filename: "Question162.PNG", answer: "D"},
  {questionid: 163, filename: "Question163.PNG", answer: "C"},
  {questionid: 164, filename: "Question164.PNG", answer: "C"},
  {questionid: 165, filename: "Question165.PNG", answer: "C"},
  {questionid: 166, filename: "Question166.PNG", answer: "C"},
  {questionid: 167, filename: "Question167.PNG", answer: "C"},
  {questionid: 168, filename: "Question168.PNG", answer: "B"},
  {questionid: 169, filename: "Question169.PNG", answer: "D"},
  {questionid: 170, filename: "Question170.PNG", answer: "D"},
  {questionid: 171, filename: "Question171.PNG", answer: "D"},
  {questionid: 172, filename: "Question172.PNG", answer: "D"},
  {questionid: 173, filename: "Question173.PNG", answer: "D"},
  {questionid: 174, filename: "Question174.PNG", answer: "D"},
  {questionid: 175, filename: "Question175.PNG", answer: "D"}
];

// In-memory storage for history (now synced with localStorage)
let testHistory = [];

// Load history from localStorage on page load
function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem('felearning_history');
    if (stored) {
      testHistory = JSON.parse(stored);
      // Convert date strings back to Date objects
      testHistory = testHistory.map(item => ({
        ...item,
        date: new Date(item.date)
      }));
    }
  } catch (error) {
    console.error('Error loading history from localStorage:', error);
    testHistory = [];
  }
}

// Save history to localStorage
function saveHistoryToStorage() {
  try {
    localStorage.setItem('felearning_history', JSON.stringify(testHistory));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
}

// Clear history from localStorage
function clearHistory() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi?')) {
    testHistory = [];
    localStorage.removeItem('felearning_history');
    renderHistory();
  }
}

// Current quiz state
let currentQuiz = {
  questions: [],
  currentIndex: 0,
  userAnswers: [],
  subject: 'CSD203',
  startTime: null,
  elapsedTime: 0,
  timerInterval: null
};

// DOM elements
const selectionScreen = document.getElementById('selectionScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const questionCountInput = document.getElementById('questionCount');
const questionError = document.getElementById('questionError');
const startBtn = document.getElementById('startBtn');
const historyContainer = document.getElementById('historyContainer');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const quizTitle = document.getElementById('quizTitle');
const quizProgress = document.getElementById('quizProgress');
const quizTimer = document.getElementById('quizTimer');
const questionImage = document.getElementById('questionImage');
const answersGrid = document.getElementById('answersGrid');
const nextBtn = document.getElementById('nextBtn');
const backToSelectionBtn = document.getElementById('backToSelectionBtn');

const resultScore = document.getElementById('resultScore');
const correctCount = document.getElementById('correctCount');
const wrongCount = document.getElementById('wrongCount');
const emptyCount = document.getElementById('emptyCount');
const percentageScore = document.getElementById('percentageScore');
const resultTableBody = document.getElementById('resultTableBody');
const backToHomeBtn = document.getElementById('backToHomeBtn');

// Utility functions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function showScreen(screen) {
  selectionScreen.classList.remove('active');
  quizScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  screen.classList.add('active');
}

function validateQuestionCount() {
  const count = parseInt(questionCountInput.value);
  if (isNaN(count) || count < 1 || count > 175) {
    questionError.textContent = 'Vui lòng nhập số từ 1 đến 175';
    questionError.style.display = 'block';
    return false;
  }
  questionError.style.display = 'none';
  return true;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  currentQuiz.startTime = Date.now();
  currentQuiz.elapsedTime = 0;
  
  currentQuiz.timerInterval = setInterval(() => {
    currentQuiz.elapsedTime = Math.floor((Date.now() - currentQuiz.startTime) / 1000);
    quizTimer.textContent = `⏱ ${formatTime(currentQuiz.elapsedTime)}`;
  }, 1000);
}

function stopTimer() {
  if (currentQuiz.timerInterval) {
    clearInterval(currentQuiz.timerInterval);
    currentQuiz.timerInterval = null;
  }
}

function renderHistory() {
  if (testHistory.length === 0) {
    historyContainer.innerHTML = '<div class="empty-state">Chưa có lịch sử thi</div>';
    return;
  }

  const sortedHistory = [...testHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const table = document.createElement('table');
  table.className = 'history-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>STT</th>
        <th>Ngày thi</th>
        <th>Số câu</th>
        <th>Thời gian</th>
        <th>Điểm</th>
        <th>Tỉ lệ (%)</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      ${sortedHistory.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${formatDate(item.date)}</td>
          <td>${item.totalQuestions}</td>
          <td>${formatTime(item.timeSpent || 0)}</td>
          <td>${item.score.toFixed(1)}</td>
          <td>${item.percentage.toFixed(1)}%</td>
          <td><button class="btn btn--secondary" style="padding: 6px 12px; font-size: 13px;" data-history-index="${index}">Xem chi tiết</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;
  
  historyContainer.innerHTML = '';
  historyContainer.appendChild(table);

  // Attach click handlers for "Xem chi tiết" buttons
  table.querySelectorAll('button[data-history-index]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.historyIndex);
      showHistoryDetail(sortedHistory[idx]);
    });
  });
}

function displayResults(score, correct, wrong, empty, percentage, timeSpent, results) {
  resultScore.textContent = score.toFixed(1);
  correctCount.textContent = correct;
  wrongCount.textContent = wrong;
  emptyCount.textContent = empty;
  percentageScore.textContent = percentage.toFixed(1) + '%';
  
  // Render results table with time info header
  const timeInfo = `
    <div class="result-time-info">
      <span class="result-time-label">Thời gian làm bài:</span>
      <span class="result-time-value">${formatTime(timeSpent || 0)}</span>
    </div>
  `;
  
  resultTableBody.innerHTML = results.map(result => {
    let statusHtml = '';
    if (result.status === 'correct') {
      statusHtml = '<span class="status-correct">✓ Đúng</span>';
    } else if (result.status === 'wrong') {
      statusHtml = '<span class="status-wrong">✗ Sai</span>';
    } else {
      statusHtml = '<span class="status-empty">○ Bỏ trống</span>';
    }

    const imgCell = result.filename
      ? `<td><img class="result-thumb" src="data/${result.filename}" data-src="data/${result.filename}" alt="Câu ${result.questionNum}" /></td>`
      : `<td>-</td>`;
    
    return `
      <tr>
        <td>Câu ${result.questionNum}</td>
        ${imgCell}
        <td>${result.correctAnswer}</td>
        <td>${result.userAnswer}</td>
        <td>${statusHtml}</td>
      </tr>
    `;
  }).join('');
  
  // Insert time info before table
  const resultTable = document.getElementById('resultTable');
  const existingTimeInfo = document.querySelector('.result-time-info');
  if (existingTimeInfo) existingTimeInfo.remove();
  resultTable.insertAdjacentHTML('beforebegin', timeInfo);
  
  // Attach click handlers to thumbnails to open modal
  document.querySelectorAll('.result-thumb').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      const src = e.currentTarget.dataset.src;
      const alt = e.currentTarget.alt || '';
      if (src) openImageModal(src, alt);
    });
  });
}

function showHistoryDetail(historyItem) {
  // Display summary stats and time
  displayResults(
    historyItem.score,
    historyItem.correct,
    historyItem.wrong,
    historyItem.empty,
    historyItem.percentage,
    historyItem.timeSpent || 0,
    historyItem.detailedResults || []
  );
  
  showScreen(resultScreen);
}

function startQuiz() {
  if (!validateQuestionCount()) return;
  
  const count = parseInt(questionCountInput.value);
  const shuffled = shuffleArray(questionsData);
  currentQuiz.questions = shuffled.slice(0, count);
  currentQuiz.currentIndex = 0;
  currentQuiz.userAnswers = new Array(count).fill(null);
  
  startTimer();
  renderQuestion();
  showScreen(quizScreen);
}

function renderQuestion() {
  const question = currentQuiz.questions[currentQuiz.currentIndex];
  const totalQuestions = currentQuiz.questions.length;
  const currentNum = currentQuiz.currentIndex + 1;
  
  quizTitle.textContent = currentQuiz.subject;
  quizProgress.textContent = `Câu ${currentNum}/${totalQuestions}`;

  // Hiển thị ảnh từ thư mục data/ theo filename; nếu không có file sẽ hiển thị tên hoặc placeholder
  if (question && question.filename) {
    questionImage.innerHTML = '';
    const img = document.createElement('img');
    img.src = `data/${question.filename}`;
    img.alt = question.filename;
    img.onload = () => { /* ảnh tải thành công */ };
    img.onerror = () => {
      questionImage.innerHTML = question.filename;
    };
    questionImage.appendChild(img);
  } else {
    questionImage.textContent = 'Không có ảnh';
  }
  
  // Update answer buttons: reset state (khi render câu mới cho phép chọn lại)
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach(btn => {
    btn.classList.remove('selected', 'correct', 'wrong');
    btn.disabled = false;
    const answer = btn.dataset.answer;
    if (currentQuiz.userAnswers[currentQuiz.currentIndex] === answer) {
      btn.classList.add('selected');
      // nếu đã có câu trả lời trước đó, show feedback ngay
      const correctAnswer = currentQuiz.questions[currentQuiz.currentIndex].answer;
      if (answer === correctAnswer) btn.classList.add('correct');
      else btn.classList.add('wrong');
      // lock if there was an answer already
      answerBtns.forEach(b => b.disabled = true);
    }
  });
  
  // Update next button text
  if (currentQuiz.currentIndex === totalQuestions - 1) {
    nextBtn.textContent = 'Hoàn tất';
  } else {
    nextBtn.textContent = 'Tiếp theo';
  }
}

function selectAnswer(answer) {
  const idx = currentQuiz.currentIndex;
  if (!currentQuiz.questions.length) return;

  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  // nếu đã khóa (đã chọn trước đó) thì không cho chọn lại
  if (answerBtns[0] && answerBtns[0].disabled) return;

  // lưu đáp án người dùng
  currentQuiz.userAnswers[idx] = answer;

  // reset classes then mark selected
  answerBtns.forEach(btn => {
    btn.classList.remove('selected', 'correct', 'wrong');
    btn.disabled = true; // khóa luôn sau khi chọn để người dùng biết kết quả
    if (btn.dataset.answer === answer) btn.classList.add('selected');
  });

  const correctAnswer = currentQuiz.questions[idx].answer;
  if (answer === correctAnswer) {
    const btn = answersGrid.querySelector(`.answer-btn[data-answer="${answer}"]`);
    if (btn) btn.classList.add('correct');
  } else {
    const selectedBtn = answersGrid.querySelector(`.answer-btn[data-answer="${answer}"]`);
    const correctBtn = answersGrid.querySelector(`.answer-btn[data-answer="${correctAnswer}"]`);
    if (selectedBtn) selectedBtn.classList.add('wrong');
    if (correctBtn) correctBtn.classList.add('correct');
  }
}

function nextQuestion() {
  if (currentQuiz.currentIndex < currentQuiz.questions.length - 1) {
    currentQuiz.currentIndex++;
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  stopTimer();
  
  // Calculate results
  let correct = 0;
  let wrong = 0;
  let empty = 0;
  
  const results = currentQuiz.questions.map((question, index) => {
    const userAnswer = currentQuiz.userAnswers[index];
    const correctAnswer = question.answer;
    let status = '';
    
    if (userAnswer === null) {
      empty++;
      status = 'empty';
    } else if (userAnswer === correctAnswer) {
      correct++;
      status = 'correct';
    } else {
      wrong++;
      status = 'wrong';
    }
    
    return {
      questionNum: index + 1,
      filename: question.filename || '',
      correctAnswer: correctAnswer || 'N/A',
      userAnswer: userAnswer || '-',
      status
    };
  });
  
  const totalQuestions = currentQuiz.questions.length;
  const score = (correct / totalQuestions) * 10;
  const percentage = (correct / totalQuestions) * 100;
  
  // Save to history WITH detailed results and time
  testHistory.push({
    date: new Date(),
    subject: currentQuiz.subject,
    totalQuestions,
    correct,
    wrong,
    empty,
    score,
    percentage,
    timeSpent: currentQuiz.elapsedTime,
    detailedResults: results
  });
  
  // Save to localStorage
  saveHistoryToStorage();
  
  // Display results with time
  displayResults(score, correct, wrong, empty, percentage, currentQuiz.elapsedTime, results);
  
  showScreen(resultScreen);
}

function backToSelection() {
  if (confirm('Bạn có chắc chắn muốn quay lại? Bài thi hiện tại sẽ không được lưu.')) {
    stopTimer();
    renderHistory();
    showScreen(selectionScreen);
  }
}

function backToHome() {
  renderHistory();
  showScreen(selectionScreen);
}

function clearHistory() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi?')) {
    testHistory = [];
    localStorage.removeItem('felearning_history');
    renderHistory();
  }
}

// --- Simple image modal with wheel-zoom and drag-pan ---
const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const imageModalClose = document.getElementById('imageModalClose');
const imageModalBackdrop = document.getElementById('imageModalBackdrop');

let imgScale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;

// open modal with src
function openImageModal(src, alt = '') {
  imageModalImg.src = src;
  imageModalImg.alt = alt;
  imgScale = 1;
  panX = 0; panY = 0;
  applyTransform();
  imageModal.classList.add('active');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  imageModalImg.focus?.();
}

// close modal
function closeImageModal() {
  imageModal.classList.remove('active');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  imageModalImg.src = '';
}

// apply transform (scale + translate)
function applyTransform() {
  imageModalImg.style.transform = `translate(${panX}px, ${panY}px) scale(${imgScale})`;
}

// open when clicked on question image (the img inside .question-image)
questionImage.addEventListener('click', (e) => {
  const img = e.target.tagName === 'IMG' ? e.target : questionImage.querySelector('img');
  if (img && img.src) {
    openImageModal(img.src, img.alt || '');
  }
});

// close handlers
imageModalClose.addEventListener('click', closeImageModal);
imageModalBackdrop.addEventListener('click', closeImageModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageModal.classList.contains('active')) closeImageModal();
});

// wheel to zoom
imageModalImg.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = -Math.sign(e.deltaY) * 0.1;
  imgScale = Math.min(4, Math.max(0.5, imgScale + delta));
  applyTransform();
});

// pan with mouse
imageModalImg.addEventListener('mousedown', (e) => {
  isPanning = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  imageModalImg.classList.add('grabbing');
  e.preventDefault();
});
window.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  applyTransform();
});
window.addEventListener('mouseup', () => {
  if (!isPanning) return;
  isPanning = false;
  imageModalImg.classList.remove('grabbing');
});

// double click to reset zoom/position
imageModalImg.addEventListener('dblclick', () => {
  imgScale = 1; panX = 0; panY = 0;
  applyTransform();
});

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
backToSelectionBtn.addEventListener('click', backToSelection);
backToHomeBtn.addEventListener('click', () => {
  renderHistory();
  showScreen(selectionScreen);
});
clearHistoryBtn.addEventListener('click', clearHistory);

answersGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('answer-btn')) {
    selectAnswer(e.target.dataset.answer);
  }
});

// Initialize app - load history from localStorage
loadHistoryFromStorage();
renderHistory();