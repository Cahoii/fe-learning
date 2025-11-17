// Question data - will be loaded from JSON
let questionsData = [];

// In-memory storage for history (now synced with localStorage)
let testHistory = [];

// Current subject selection
let currentSubject = 'CSD203';

// Load questions from JSON file
async function loadQuestionsData(subject) {
  try {
    const response = await fetch(`data/${subject}/answers/answers.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    questionsData = data.map(item => ({
      ...item,
      filename: `${subject}/questions/${item.filename}`
    }));
    console.log(`Loaded ${questionsData.length} questions for ${subject}`);
  } catch (error) {
    console.error('Error loading questions:', error);
    questionsData = [];
    alert(`Không thể tải dữ liệu câu hỏi cho môn ${subject}. Vui lòng kiểm tra lại file answers.json`);
  }
}

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

const subjectSelect = document.getElementById('subjectSelect');
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
  const maxQuestions = questionsData.length;
  
  if (questionsData.length === 0) {
    questionError.textContent = 'Chưa có dữ liệu câu hỏi. Vui lòng chọn môn học.';
    questionError.style.display = 'block';
    return false;
  }
  
  if (isNaN(count) || count < 1 || count > maxQuestions) {
    questionError.textContent = `Vui lòng nhập số từ 1 đến ${maxQuestions}`;
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
        <th>Môn học</th>
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
          <td>${item.subject}</td>
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

async function startQuiz() {
  if (!validateQuestionCount()) return;
  
  const count = parseInt(questionCountInput.value);
  const subject = subjectSelect.value;
  
  // Update current subject
  currentSubject = subject;
  currentQuiz.subject = subject;
  
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

// Handle subject change - reload questions
subjectSelect.addEventListener('change', async (e) => {
  const subject = e.target.value;
  await loadQuestionsData(subject);
  // Update max question count hint
  if (questionsData.length > 0) {
    questionError.textContent = `Có ${questionsData.length} câu hỏi`;
    questionError.style.color = 'var(--color-text-secondary)';
    questionError.style.display = 'block';
  }
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

// Initialize app - load history and default subject questions
async function initializeApp() {
  loadHistoryFromStorage();
  renderHistory();
  await loadQuestionsData(currentSubject);
  if (questionsData.length > 0) {
    questionError.textContent = `Có ${questionsData.length} câu hỏi`;
    questionError.style.color = 'var(--color-text-secondary)';
    questionError.style.display = 'block';
  }
}

initializeApp();