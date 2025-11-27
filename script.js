// Question data - now stores data per subject
const questionsData = {
  CSD203: [],
  DBI202: [],
  DBI202_FE_SU25: [],
  DBI202_FE_SU25_B5: [],
  DBI202_FE_SU25_RE: [],
  JPD113_SU25_B5: [],
  JPD113_SU25_FE: [],
  JPD113_SU25_RE: [],
  CEA201_SU25_FE: [],
  CEA201_SU25_RE: [],
  CEA201_SU25_B5: [],
  MAS291_C1FA25_FE: [],
  OSG202_FA25_FE: [],
  OSG202_SU25_B5_1: [],
};

// Helper function to parse CSV text into JSON object
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/); // Handle both Windows (\r\n) and Unix (\n) line endings
  if (lines.length < 2) return [];

  // Get headers from first line, remove quotes and whitespace, convert to lowercase
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    // Split by comma (basic splitting, assumes no commas inside values)
    const values = line.split(',');
    const obj = {};
    
    headers.forEach((header, index) => {
      let value = values[index] ? values[index].trim() : '';
      // Remove quotes if present (e.g. "A" -> A)
      value = value.replace(/^"|"$/g, '');
      obj[header] = value;
    });
    
    result.push(obj);
  }
  
  return result;
}

// Load questions from JSON or CSV file for a specific subject
async function loadQuestionsForSubject(subject) {
  let data = null;
  let format = '';

  try {
    // 1. Try loading JSON first
    const jsonResponse = await fetch(`data/${subject}/answers/answers.json`);
    if (jsonResponse.ok) {
      data = await jsonResponse.json();
      format = 'json';
    } else {
      // 2. If JSON fails (404), try loading CSV
      console.log(`JSON not found for ${subject}, trying CSV...`);
      const csvResponse = await fetch(`data/${subject}/answers/answers.csv`);
      if (csvResponse.ok) {
        const csvText = await csvResponse.text();
        data = parseCSV(csvText);
        format = 'csv';
      } else {
        throw new Error(`Could not load answers.json or answers.csv for ${subject}`);
      }
    }

    // Process data (normalize fields)
    questionsData[subject] = data.map((item, index) => {
      // Handle different field names that might occur in CSV vs JSON
      // JSON usually has: questionid, filename, answer
      // CSV headers should ideally match, but we fallback to defaults
      
      return {
        id: item.questionid || item.id || (index + 1),
        filename: item.filename || item.image || `Question${item.questionid || index + 1}`,
        answer: item.answer ? item.answer.toUpperCase() : ''
      };
    });
    
    console.log(`Loaded ${questionsData[subject].length} questions for ${subject} (Format: ${format})`);
    return questionsData[subject];

  } catch (error) {
    console.error(`Error loading questions for ${subject}:`, error);
    alert(`Không thể tải dữ liệu môn ${subject}. Vui lòng kiểm tra file answers.json hoặc answers.csv`);
    return [];
  }
}

// In-memory storage for history (now synced with localStorage)
let testHistory = [];

// Load history from localStorage on page load
function loadHistoryFromStorage() {
  try {
    const stored = localStorage.getItem('testHistory');
    if (stored) {
      testHistory = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading history from localStorage:', error);
  }
}

// Save history to localStorage
function saveHistoryToStorage() {
  try {
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
}

// Clear history from localStorage
function clearHistory() {
  if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi?')) {
    testHistory = [];
    saveHistoryToStorage();
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
  const subject = document.getElementById('subjectSelect').value;
  const maxQuestions = questionsData[subject]?.length || 175;
  const count = parseInt(questionCountInput.value);
  
  if (isNaN(count) || count < 1) {
    questionError.textContent = 'Vui lòng nhập số lớn hơn 0';
    questionError.style.display = 'block';
    return false;
  }
  
  if (count > maxQuestions) {
    questionError.textContent = `Số câu hỏi tối đa cho môn này là ${maxQuestions}`;
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
        <th>Môn học</th>
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
          <td>${item.subject || 'CSD203'}</td>
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
      const idx = parseInt(e.target.getAttribute('data-history-index'));
      showHistoryDetail(sortedHistory[idx]);
    });
  });
}

function displayResults(score, correct, wrong, empty, percentage, timeSpent, results, subject) {
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

    // Support multiple image formats
    let imgSrc = `data/${subject}/questions/${result.filename}`;
    
    const imgCell = result.filename
      ? `<td><img class="result-thumb" src="${imgSrc}" data-src="${imgSrc}" alt="Câu ${result.questionNum}" onerror="this.style.display='none'" /></td>`
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
    img.addEventListener('click', (e) => {
      openImageModal(e.target.dataset.src, e.target.alt);
    });
  });
}

function showHistoryDetail(historyItem) {
  // Display summary stats and time with subject
  displayResults(
    historyItem.score,
    historyItem.correct,
    historyItem.wrong,
    historyItem.empty,
    historyItem.percentage,
    historyItem.timeSpent || 0,
    historyItem.detailedResults || [],
    historyItem.subject || 'CSD203'
  );
  
  showScreen(resultScreen);
}

async function startQuiz() {
  if (!validateQuestionCount()) return;
  
  const subject = document.getElementById('subjectSelect').value;
  const count = parseInt(questionCountInput.value);
  
  // Load questions if not loaded yet
  if (!questionsData[subject] || questionsData[subject].length === 0) {
    await loadQuestionsForSubject(subject);
  }
  
  if (!questionsData[subject] || questionsData[subject].length === 0) {
    alert('Không có dữ liệu câu hỏi cho môn này!');
    return;
  }
  
  const shuffled = shuffleArray(questionsData[subject]);
  currentQuiz.questions = shuffled.slice(0, count);
  currentQuiz.currentIndex = 0;
  currentQuiz.userAnswers = new Array(count).fill(null);
  currentQuiz.subject = subject;
  
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

  // Display image from data/{subject}/questions/ folder
  if (question && question.filename) {
    questionImage.innerHTML = '';
    const img = document.createElement('img');
    
    // Support multiple image formats (PNG, JPG, JPEG, WebP)
    let imagePath = `data/${currentQuiz.subject}/questions/${question.filename}`;
    
    // If filename doesn't have extension, try common formats
    if (!question.filename.match(/\.(png|jpg|jpeg|webp)$/i)) {
      // Try WebP first, then PNG, then JPG
      const tryFormats = ['webp', 'png', 'jpg', 'jpeg'];
      let formatIndex = 0;
      
      const tryNextFormat = () => {
        if (formatIndex < tryFormats.length) {
          const ext = tryFormats[formatIndex];
          img.src = `data/${currentQuiz.subject}/questions/${question.filename}.${ext}`;
          formatIndex++;
        } else {
          questionImage.innerHTML = question.filename;
        }
      };
      
      img.onerror = tryNextFormat;
      tryNextFormat();
    } else {
      img.src = imagePath;
      img.onerror = () => {
        questionImage.innerHTML = question.filename;
      };
    }
    
    img.alt = question.filename;
    questionImage.appendChild(img);
  } else {
    questionImage.textContent = 'Không có ảnh';
  }
  
  // Update answer buttons: reset state
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach(btn => {
    btn.classList.remove('selected', 'correct', 'wrong');
    btn.disabled = false;
  });
  
  // Update next button text
  if (currentQuiz.currentIndex === totalQuestions - 1) {
    nextBtn.textContent = 'Hoàn thành';
  } else {
    nextBtn.textContent = 'Tiếp theo';
  }
}

function selectAnswer(answer) {
  const idx = currentQuiz.currentIndex;
  if (!currentQuiz.questions.length) return;

  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  const clickedBtn = answersGrid.querySelector(`[data-answer="${answer}"]`);
  
  // Check if already submitted
  if (answerBtns[0] && answerBtns[0].disabled) return;

  const correctAnswer = currentQuiz.questions[idx].answer;
  
  // Check if this is a multiple choice question (answer contains multiple letters)
  const isMultipleChoice = correctAnswer.length > 1;
  
  if (isMultipleChoice) {
    // Multiple choice mode - toggle selection
    if (clickedBtn.classList.contains('selected')) {
      clickedBtn.classList.remove('selected');
    } else {
      clickedBtn.classList.add('selected');
    }
    
    // Get all selected answers
    const selectedAnswers = Array.from(answerBtns)
      .filter(btn => btn.classList.contains('selected'))
      .map(btn => btn.dataset.answer)
      .sort()
      .join('');
    
    // Store current selection
    currentQuiz.userAnswers[idx] = selectedAnswers || null;
  } else {
    // Single choice mode - select only one
    answerBtns.forEach(btn => btn.classList.remove('selected'));
    clickedBtn.classList.add('selected');
    currentQuiz.userAnswers[idx] = answer;
    
    // Auto-submit after selection and show feedback
    submitCurrentAnswer();
  }
}

function submitCurrentAnswer() {
  const idx = currentQuiz.currentIndex;
  const userAnswer = currentQuiz.userAnswers[idx];
  const correctAnswer = currentQuiz.questions[idx].answer;
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  
  // Disable all buttons
  answerBtns.forEach(btn => {
    btn.disabled = true;
  });
  
  const isMultipleChoice = correctAnswer.length > 1;
  
  if (isMultipleChoice) {
    // Multiple choice: mark correct answers in green, wrong selections in red
    const correctAnswers = correctAnswer.split('');
    const userAnswers = (userAnswer || '').split('');
    
    answerBtns.forEach(btn => {
      const btnAnswer = btn.dataset.answer;
      if (correctAnswers.includes(btnAnswer)) {
        btn.classList.add('correct');
      }
      if (userAnswers.includes(btnAnswer) && !correctAnswers.includes(btnAnswer)) {
        btn.classList.add('wrong');
      }
    });
  } else {
    // Single choice: show correct answer and mark user's wrong answer if any
    if (userAnswer === correctAnswer) {
      answersGrid.querySelector(`[data-answer="${userAnswer}"]`).classList.add('correct');
    } else {
      if (userAnswer) {
        answersGrid.querySelector(`[data-answer="${userAnswer}"]`).classList.add('wrong');
      }
      answersGrid.querySelector(`[data-answer="${correctAnswer}"]`).classList.add('correct');
    }
  }
}

function nextQuestion() {
  const idx = currentQuiz.currentIndex;
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  
  // If this is a multiple choice question and not yet submitted, submit first
  const correctAnswer = currentQuiz.questions[idx].answer;
  const isMultipleChoice = correctAnswer.length > 1;
  
  if (isMultipleChoice && !answerBtns[0].disabled) {
    submitCurrentAnswer();
    // Wait for user to see the result before moving to next question
    return;
  }
  
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
    
    if (userAnswer === null || userAnswer === '') {
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
  
  // Save to history
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
  
  saveHistoryToStorage();
  displayResults(score, correct, wrong, empty, percentage, currentQuiz.elapsedTime, results, currentQuiz.subject);
  showScreen(resultScreen);
}

function backToSelection() {
  if (confirm('Bạn có chắc chắn muốn quay lại? Bài thi hiện tại sẽ không được lưu.')) {
    stopTimer();
    showScreen(selectionScreen);
  }
}

function backToHome() {
  renderHistory();
  showScreen(selectionScreen);
}

// --- Image modal ---
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

function openImageModal(src, alt = '') {
  imageModalImg.src = src;
  imageModalImg.alt = alt;
  imgScale = 1;
  panX = 0; panY = 0;
  applyTransform();
  imageModal.classList.add('active');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  imageModal.classList.remove('active');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function applyTransform() {
  imageModalImg.style.transform = `scale(${imgScale}) translate(${panX}px, ${panY}px)`;
}

questionImage.addEventListener('click', (e) => {
  if (e.target.tagName === 'IMG') {
    openImageModal(e.target.src, e.target.alt);
  }
});

imageModalClose.addEventListener('click', closeImageModal);
imageModalBackdrop.addEventListener('click', closeImageModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && imageModal.classList.contains('active')) {
    closeImageModal();
  }
});

imageModalImg.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  imgScale = Math.max(0.5, Math.min(5, imgScale + delta));
  applyTransform();
});

imageModalImg.addEventListener('mousedown', (e) => {
  isPanning = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  imageModalImg.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', (e) => {
  if (!isPanning) return;
  panX = e.clientX - startX;
  panY = e.clientY - startY;
  applyTransform();
});

window.addEventListener('mouseup', () => {
  isPanning = false;
  imageModalImg.style.cursor = 'grab';
});

imageModalImg.addEventListener('dblclick', () => {
  imgScale = 1;
  panX = 0; panY = 0;
  applyTransform();
});

// Event Listeners
startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
  const idx = currentQuiz.currentIndex;
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  const correctAnswer = currentQuiz.questions[idx].answer;
  const isMultipleChoice = correctAnswer.length > 1;
  
  // If multiple choice and not submitted yet, this click submits the answer
  if (isMultipleChoice && !answerBtns[0].disabled) {
    submitCurrentAnswer();
    nextBtn.textContent = currentQuiz.currentIndex === currentQuiz.questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo';
  } else {
    // Otherwise, move to next question
    nextQuestion();
  }
});
backToSelectionBtn.addEventListener('click', backToSelection);
backToHomeBtn.addEventListener('click', backToHome);
clearHistoryBtn.addEventListener('click', clearHistory);

answersGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('answer-btn')) {
    selectAnswer(e.target.dataset.answer);
  }
});

// Initialize app
(async function init() {
  loadHistoryFromStorage();
  renderHistory();
  
  // Load CSD203 by default
  await loadQuestionsForSubject('CSD203');
  
  // Update max value when subject changes
  document.getElementById('subjectSelect').addEventListener('change', async (e) => {
    const subject = e.target.value;
    if (!questionsData[subject] || questionsData[subject].length === 0) {
      await loadQuestionsForSubject(subject);
    }
    const maxQuestions = questionsData[subject]?.length || 175;
    questionCountInput.setAttribute('max', maxQuestions);
    questionCountInput.value = Math.min(parseInt(questionCountInput.value), maxQuestions);
  });
})();