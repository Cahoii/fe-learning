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
  timerInterval: null,
  showInstantFeedback: false
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
const showInstantFeedbackCheckbox = document.getElementById('showInstantFeedback');

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

let quizUI = {
  screen: null,
  progress: null,
  timer: null,
  image: null,
  answers: null,
  nav: null,
  prevBtn: null,
  nextBtn: null,
  finishBtn: null,
  backBtn: null
};

// Tạo màn hình làm bài (DOM động)
function createQuizScreen() {
  if (quizUI.screen) return; // đã tạo

  const screen = document.createElement('div');
  screen.id = 'quizScreen';
  screen.className = 'screen';

  // wrapper layout: trái (câu hỏi + đáp án), phải (tiến trình + timer + navigator)
  screen.innerHTML = `
    <div class="quiz-content-wrapper">
      <div class="question-main-area">
        <div class="question-container">
          <div class="answers-grid" id="answersGrid">
            <button class="answer-btn" data-answer="A">A</button>
            <button class="answer-btn" data-answer="B">B</button>
            <button class="answer-btn" data-answer="C">C</button>
            <button class="answer-btn" data-answer="D">D</button>
          </div>
          <div class="question-image" id="questionImage"></div>
        </div>

        <div class="quiz-controls">
          <div class="btn-group">
            <button id="backToSelectionBtn" class="btn btn--secondary">Quay lại</button>
            <button id="prevBtn" class="btn btn--secondary">← Câu trước</button>
            <button id="nextBtn" class="btn btn--secondary">Câu sau →</button>
          </div>
          <button id="finishBtn" class="btn btn--primary">Nộp bài</button>
        </div>
      </div>

      <div class="question-navigator-container">
        <div class="navigator-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div class="quiz-progress" id="quizProgress">Câu 1/1</div>
          <div class="quiz-timer" id="quizTimer">0:00</div>
        </div>
        <div class="question-navigator" id="questionNavigator"></div>
      </div>
    </div>
  `;

  document.querySelector('.app-container').appendChild(screen);

  // Gán refs
  quizUI.screen = screen;
  quizUI.progress = screen.querySelector('#quizProgress');
  quizUI.timer = screen.querySelector('#quizTimer');
  quizUI.image = screen.querySelector('#questionImage');
  quizUI.answers = screen.querySelector('#answersGrid');
  quizUI.nav = screen.querySelector('#questionNavigator');
  quizUI.prevBtn = screen.querySelector('#prevBtn');
  quizUI.nextBtn = screen.querySelector('#nextBtn');
  quizUI.finishBtn = screen.querySelector('#finishBtn');
  quizUI.backBtn = screen.querySelector('#backToSelectionBtn');

  // Class chế độ instant feedback (để CSS áp dụng)
  screen.classList.toggle('instant-on', !!currentQuiz.showInstantFeedback);
  screen.classList.toggle('instant-off', !currentQuiz.showInstantFeedback);

  // Gắn sự kiện
  quizUI.answers.addEventListener('click', (e) => {
    const btn = e.target.closest('.answer-btn');
    if (!btn) return;
    selectAnswer(btn.dataset.answer);
  });
  quizUI.prevBtn.addEventListener('click', prevQuestion);
  quizUI.nextBtn.addEventListener('click', nextQuestion);
  quizUI.finishBtn.addEventListener('click', finishQuiz);
  quizUI.backBtn.addEventListener('click', backToSelection);

  // Click ảnh => mở modal
  quizUI.image.addEventListener('click', (e) => {
    const img = e.target.tagName === 'IMG' ? e.target : quizUI.image.querySelector('img');
    if (img && img.src) openImageModal(img.src, img.alt || '');
  });
}

function destroyQuizScreen() {
  if (!quizUI.screen) return;
  quizUI.screen.remove();
  quizUI = {
    screen: null, progress: null, timer: null, image: null, answers: null,
    nav: null, prevBtn: null, nextBtn: null, finishBtn: null, backBtn: null
  };
}

// Hiển thị 1 screen và ẩn các screen khác
function showScreen(screenEl) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  if (screenEl) screenEl.classList.add('active');
}

// Bắt đầu thi
async function startQuiz() {
  if (!validateQuestionCount()) return;

  const count = parseInt(questionCountInput.value);
  const subject = subjectSelect.value;

  // Nạp dữ liệu nếu đổi môn
  if (subject !== currentSubject || questionsData.length === 0) {
    await loadQuestionsData(subject);
  }

  // Update current subject + mode
  currentSubject = subject;
  currentQuiz.subject = subject;
  currentQuiz.showInstantFeedback = showInstantFeedbackCheckbox.checked;

  // Chuẩn bị câu hỏi
  const shuffled = shuffleArray(questionsData);
  currentQuiz.questions = shuffled.slice(0, count);
  currentQuiz.currentIndex = 0;
  currentQuiz.userAnswers = new Array(count).fill(null);

  // Tạo UI quiz động
  createQuizScreen();

  // Timer
  startTimer();

  // Render
  renderQuestion();
  showScreen(quizUI.screen);
}

// Render 1 câu hỏi
function renderQuestion() {
  if (!quizUI.screen) return;
  const question = currentQuiz.questions[currentQuiz.currentIndex];
  const total = currentQuiz.questions.length;
  const currentNum = currentQuiz.currentIndex + 1;

  // Cập nhật tiến trình
  if (quizUI.progress) quizUI.progress.textContent = `Câu ${currentNum}/${total}`;

  // Ảnh
  if (question && question.filename) {
    quizUI.image.innerHTML = '';
    const img = document.createElement('img');
    img.src = `data/${question.filename}`;
    img.alt = question.filename;
    img.onerror = () => { quizUI.image.textContent = question.filename; };
    quizUI.image.appendChild(img);
  } else {
    quizUI.image.textContent = 'Không có ảnh';
  }

  // Đáp án
  const btns = quizUI.answers.querySelectorAll('.answer-btn');
  const userAnswer = currentQuiz.userAnswers[currentQuiz.currentIndex];
  const correctAnswer = question.answer;

  btns.forEach(b => {
    b.classList.remove('selected', 'correct', 'wrong');
    b.disabled = false;
    if (userAnswer === b.dataset.answer) {
      b.classList.add('selected');
    }
  });

  // Nếu đang ở chế độ hiện kết quả ngay và đã chọn
  if (currentQuiz.showInstantFeedback && userAnswer) {
    const correctBtn = quizUI.answers.querySelector(`.answer-btn[data-answer="${correctAnswer}"]`);
    const selectedBtn = quizUI.answers.querySelector(`.answer-btn[data-answer="${userAnswer}"]`);
    if (selectedBtn) {
      if (userAnswer === correctAnswer) selectedBtn.classList.add('correct');
      else selectedBtn.classList.add('wrong');
    }
    if (correctBtn) correctBtn.classList.add('correct');
    btns.forEach(b => b.disabled = true);
  }

  // Navigator + nút điều hướng
  renderQuestionNavigator();
  updateNavigationButtons();
}

// Navigator bên phải
function renderQuestionNavigator() {
  if (!quizUI.nav) return;
  const total = currentQuiz.questions.length;

  quizUI.nav.innerHTML = currentQuiz.questions.map((q, i) => {
    const isCurrent = i === currentQuiz.currentIndex;
    const ua = currentQuiz.userAnswers[i];
    let cls = 'question-nav-btn';
    if (isCurrent) cls += ' current';
    if (ua !== null) cls += ' answered';

    // Nếu bật instant => đánh dấu đúng/sai trên navigator
    if (currentQuiz.showInstantFeedback && ua) {
      cls += (ua === q.answer) ? ' is-correct' : ' is-wrong';
    }

    return `<button class="${cls}" data-question-index="${i}">${i + 1}</button>`;
  }).join('');

  quizUI.nav.querySelectorAll('.question-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.questionIndex);
      goToQuestion(index);
    });
  });

  // Hiển thị timer
  if (quizUI.timer) {
    quizUI.timer.textContent = `${formatTime(currentQuiz.elapsedTime || 0)}`;
  }
}

function goToQuestion(index) {
  if (index >= 0 && index < currentQuiz.questions.length) {
    currentQuiz.currentIndex = index;
    renderQuestion();
  }
}

function updateNavigationButtons() {
  if (!quizUI.prevBtn || !quizUI.nextBtn) return;
  quizUI.prevBtn.disabled = currentQuiz.currentIndex === 0;
  quizUI.nextBtn.disabled = currentQuiz.currentIndex === currentQuiz.questions.length - 1;
}

// Chọn đáp án
function selectAnswer(answer) {
  const idx = currentQuiz.currentIndex;
  if (!currentQuiz.questions.length || !quizUI.answers) return;

  const btns = quizUI.answers.querySelectorAll('.answer-btn');
  if (currentQuiz.showInstantFeedback && btns[0] && btns[0].disabled) return;

  currentQuiz.userAnswers[idx] = answer;

  btns.forEach(b => {
    b.classList.remove('selected', 'correct', 'wrong');
    if (b.dataset.answer === answer) b.classList.add('selected');
  });

  // Hiển thị kết quả ngay
  if (currentQuiz.showInstantFeedback) {
    const correct = currentQuiz.questions[idx].answer;
    const correctBtn = quizUI.answers.querySelector(`.answer-btn[data-answer="${correct}"]`);
    const selectedBtn = quizUI.answers.querySelector(`.answer-btn[data-answer="${answer}"]`);

    if (answer === correct) {
      if (selectedBtn) selectedBtn.classList.add('correct');
    } else {
      if (selectedBtn) selectedBtn.classList.add('wrong');
      if (correctBtn) correctBtn.classList.add('correct');
    }
    btns.forEach(b => b.disabled = true);
  }

  renderQuestionNavigator();
}

function nextQuestion() {
  if (currentQuiz.currentIndex < currentQuiz.questions.length - 1) {
    currentQuiz.currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentQuiz.currentIndex > 0) {
    currentQuiz.currentIndex--;
    renderQuestion();
  }
}

function finishQuiz() {
  const unanswered = currentQuiz.userAnswers.filter(a => a === null).length;
  if (unanswered > 0) {
    if (!confirm(`Bạn còn ${unanswered} câu chưa làm. Bạn có chắc muốn nộp bài?`)) return;
  }

  stopTimer();

  // Tính điểm
  let correct = 0, wrong = 0, empty = 0;
  const results = currentQuiz.questions.map((q, i) => {
    const ua = currentQuiz.userAnswers[i];
    let status = '';
    if (ua === null) { empty++; status = 'empty'; }
    else if (ua === q.answer) { correct++; status = 'correct'; }
    else { wrong++; status = 'wrong'; }

    return {
      questionNum: i + 1,
      filename: q.filename || '',
      correctAnswer: q.answer || 'N/A',
      userAnswer: ua || '-',
      status
    };
  });

  const total = currentQuiz.questions.length;
  const score = (correct / total) * 10;
  const percentage = (correct / total) * 100;

  // Lưu lịch sử + localStorage
  testHistory.push({
    date: new Date(),
    subject: currentQuiz.subject,
    totalQuestions: total,
    correct, wrong, empty,
    score, percentage,
    timeSpent: currentQuiz.elapsedTime,
    detailedResults: results
  });
  saveHistoryToStorage();

  // Hiển thị kết quả
  displayResults(score, correct, wrong, empty, percentage, currentQuiz.elapsedTime, results);

  // Quay màn kết quả
  showScreen(resultScreen);

  // Dọn quiz screen
  destroyQuizScreen();
}

function backToSelection() {
  if (!confirm('Quay lại trang chủ? Bài thi hiện tại sẽ không được lưu.')) return;
  stopTimer();
  destroyQuizScreen();
  renderHistory();
  showScreen(selectionScreen);
}

// Timer
function startTimer() {
  currentQuiz.startTime = Date.now();
  currentQuiz.elapsedTime = 0;

  if (currentQuiz.timerInterval) clearInterval(currentQuiz.timerInterval);
  currentQuiz.timerInterval = setInterval(() => {
    currentQuiz.elapsedTime = Math.floor((Date.now() - currentQuiz.startTime) / 1000);
    if (quizUI && quizUI.timer) {
      quizUI.timer.textContent = `${formatTime(currentQuiz.elapsedTime)}`;
    }
  }, 1000);
}

function stopTimer() {
  if (currentQuiz.timerInterval) {
    clearInterval(currentQuiz.timerInterval);
    currentQuiz.timerInterval = null;
  }
}

// Sự kiện trang chủ (chỉ những element có sẵn)
startBtn.addEventListener('click', startQuiz);
clearHistoryBtn.addEventListener('click', clearHistory);
backToHomeBtn.addEventListener('click', () => {
  renderHistory();
  showScreen(selectionScreen);
});
subjectSelect.addEventListener('change', async (e) => {
  const subject = e.target.value;
  await loadQuestionsData(subject);
  if (questionsData.length > 0) {
    questionError.textContent = `Có ${questionsData.length} câu hỏi`;
    questionError.style.color = 'var(--color-text-secondary)';
    questionError.style.display = 'block';
  }
});

// Khởi tạo
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
document.getElementById('prevBtn').addEventListener('click', prevQuestion);
document.getElementById('finishBtn').addEventListener('click', finishQuiz);
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