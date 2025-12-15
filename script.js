// Question data - now stores data per subject
const questionsData = {
  CSD203: [],
  DBI202: [],
  AIG202c: [],
  AIG202c_SP25_FE_HCM: [],
  AIG202c_SU25_FE: [],
  AIG202c_SU24_FE: [],
  AIG202c_SP24_FE: [],
  DBI202_FE_SU25: [],
  DBI202_FE_SU25_B5: [],
  DBI202_FE_SU25_RE: [],
  DBI202_FA25_FE: [],
  DBI202_FA25_RE: [],
  JPD113_SU25_B5: [],
  JPD113_SU25_FE: [],
  JPD113_SU25_RE: [],
  CEA201_SU25_FE: [],
  CEA201_SU25_RE: [],
  CEA201_SU25_B5: [],
  MAS291_C1FA25_FE: [],
  MAS291_C2FA25_FE: [],
  OSG202_FA25_FE: [],
  OSG202_SU25_B5_1: [],
};

// Exam structure: môn học -> các đề thi
const examStructure = {
  CSD203: [
    { value: 'CSD203', label: 'CSD203 - Đề chính (175 câu)' }
  ],
  DBI202: [
    { value: 'DBI202', label: 'DBI202 - Đề chính (203 câu)' },
    { value: 'DBI202_FE_SU25', label: 'DBI202 - FE SU25' },
    { value: 'DBI202_FE_SU25_B5', label: 'DBI202 - FE SU25 B5' },
    { value: 'DBI202_FE_SU25_RE', label: 'DBI202 - FE SU25 RE' },
    { value: 'DBI202_FA25_FE', label: 'DBI202 - FA25 FE' },
    { value: 'DBI202_FA25_RE', label: 'DBI202 - FA25 RE' },
  ],
  AIG202c: [
    { value: 'AIG202c', label: 'AIG202c - Đề chính (100 câu)' },
    { value: 'AIG202c_SP25_FE_HCM', label: 'AIG202c - FE SP25 HCM' },
    { value: 'AIG202c_SU25_FE', label: 'AIG202c - FE SU25' },
    { value: 'AIG202c_SU24_FE', label: 'AIG202c - FE SU24' },
    { value: 'AIG202c_SP24_FE', label: 'AIG202c - FE SP24' }
  ],
  JPD113: [
    { value: 'JPD113_SU25_FE', label: 'JPD113 - FE SU25' },
    { value: 'JPD113_SU25_RE', label: 'JPD113 - RE SU25' },
    { value: 'JPD113_SU25_B5', label: 'JPD113 - B5 SU25' }
  ],
  CEA201: [
    { value: 'CEA201_SU25_FE', label: 'CEA201 - FE SU25' },
    { value: 'CEA201_SU25_RE', label: 'CEA201 - RE SU25' },
    { value: 'CEA201_SU25_B5', label: 'CEA201 - B5 SU25' }
  ],
  MAS291: [
    { value: 'MAS291_C1FA25_FE', label: 'MAS291 - C1 FA25 FE' },
    { value: 'MAS291_C2FA25_FE', label: 'MAS291 - C2 FA25 FE' }
  ],
  OSG202: [
    { value: 'OSG202_FA25_FE', label: 'OSG202 - FA25 FE' },
    { value: 'OSG202_SU25_B5_1', label: 'OSG202 - SU25 B5' }
  ]
};

// Helper function to parse CSV text into JSON object
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    const obj = {};
    
    headers.forEach((header, index) => {
      let value = values[index] ? values[index].trim() : '';
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
    console.log(`🔍 Loading data for subject: ${subject}`);
    
    const jsonResponse = await fetch(`data/${subject}/answers/answers.json`);
    if (jsonResponse.ok) {
      data = await jsonResponse.json();
      format = 'json';
      console.log(`✅ Loaded JSON for ${subject}`);
    } else {
      console.log(`❌ JSON not found for ${subject} (Status: ${jsonResponse.status}), trying CSV...`);
      const csvResponse = await fetch(`data/${subject}/answers/answers.csv`);
      if (csvResponse.ok) {
        const csvText = await csvResponse.text();
        console.log(`📄 CSV raw text (first 200 chars):`, csvText.substring(0, 200));
        data = parseCSV(csvText);
        format = 'csv';
        console.log(`✅ Loaded CSV for ${subject}`);
      } else {
        throw new Error(`Could not load answers.json or answers.csv for ${subject}`);
      }
    }

    questionsData[subject] = data.map((item, index) => {
      return {
        id: item.questionid || item.id || (index + 1),
        filename: item.filename || item.image || `Question${item.questionid || index + 1}`,
        answer: item.answer ? item.answer.toUpperCase() : ''
      };
    });
    
    // Log chi tiết 3 câu đầu tiên
    console.log(`📊 Sample data for ${subject}:`, questionsData[subject].slice(0, 3));
    console.log(`✅ Loaded ${questionsData[subject].length} questions for ${subject} (Format: ${format})`);
    return questionsData[subject];

  } catch (error) {
    console.error(`❌ Error loading questions for ${subject}:`, error);
    alert(`Không thể tải dữ liệu môn ${subject}. Vui lòng kiểm tra file answers.json hoặc answers.csv`);
    return [];
  }
}

// In-memory storage for history (now synced with localStorage)
let testHistory = [];

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

function saveHistoryToStorage() {
  try {
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
}

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
  subject: '',
  startTime: null,
  elapsedTime: 0,
  timerInterval: null
};

// DOM elements
const selectionScreen = document.getElementById('selectionScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const subjectSelect = document.getElementById('subjectSelect');
const examSelect = document.getElementById('examSelect');
const examGroup = document.getElementById('examGroup');
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

// Populate exam dropdown based on selected subject
function populateExamDropdown(subject) {
  examSelect.innerHTML = '<option value="">-- Chọn đề thi --</option>';
  
  if (subject && examStructure[subject]) {
    examStructure[subject].forEach(exam => {
      const option = document.createElement('option');
      option.value = exam.value;
      option.textContent = exam.label;
      examSelect.appendChild(option);
    });
    examGroup.style.display = 'block';
    examSelect.value = '';
  } else {
    examGroup.style.display = 'none';
  }
}

function validateQuestionCount() {
  const examCode = examSelect.value;
  if (!examCode) {
    questionError.textContent = 'Vui lòng chọn môn học và đề thi';
    questionError.style.display = 'block';
    return false;
  }
  
  const maxQuestions = questionsData[examCode]?.length || 175;
  const count = parseInt(questionCountInput.value);
  
  if (isNaN(count) || count < 1) {
    questionError.textContent = 'Vui lòng nhập số lớn hơn 0';
    questionError.style.display = 'block';
    return false;
  }
  
  if (count > maxQuestions) {
    questionError.textContent = `Số câu hỏi tối đa cho đề này là ${maxQuestions}`;
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
          <td>${item.subject || 'N/A'}</td>
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
  
  const resultTable = document.getElementById('resultTable');
  const existingTimeInfo = document.querySelector('.result-time-info');
  if (existingTimeInfo) existingTimeInfo.remove();
  resultTable.insertAdjacentHTML('beforebegin', timeInfo);
  
  document.querySelectorAll('.result-thumb').forEach(img => {
    img.addEventListener('click', (e) => {
      openImageModal(e.target.dataset.src, e.target.alt);
    });
  });
}

function showHistoryDetail(historyItem) {
  displayResults(
    historyItem.score,
    historyItem.correct,
    historyItem.wrong,
    historyItem.empty,
    historyItem.percentage,
    historyItem.timeSpent || 0,
    historyItem.detailedResults || [],
    historyItem.subject || ''
  );
  
  showScreen(resultScreen);
}

async function startQuiz() {
  if (!validateQuestionCount()) return;
  
  const examCode = examSelect.value;
  const count = parseInt(questionCountInput.value);
  
  if (!questionsData[examCode] || questionsData[examCode].length === 0) {
    await loadQuestionsForSubject(examCode);
  }
  
  if (!questionsData[examCode] || questionsData[examCode].length === 0) {
    alert('Không có dữ liệu câu hỏi cho đề thi này!');
    return;
  }
  
  const shuffled = shuffleArray(questionsData[examCode]);
  currentQuiz.questions = shuffled.slice(0, count);
  currentQuiz.currentIndex = 0;
  currentQuiz.userAnswers = new Array(count).fill(null);
  currentQuiz.subject = examCode;
  
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

  console.log(`🖼️ Rendering question ${currentNum}:`, question);

  if (question && question.filename) {
    questionImage.innerHTML = '';
    const img = document.createElement('img');
    
    let imagePath = `data/${currentQuiz.subject}/questions/${question.filename}`;
    
    if (!question.filename.match(/\.(png|jpg|jpeg|webp)$/i)) {
      console.log(`⚠️ Filename without extension: ${question.filename}, trying multiple formats...`);
      const tryFormats = ['webp', 'png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'WEBP'];
      let formatIndex = 0;
      
      const tryNextFormat = () => {
        if (formatIndex < tryFormats.length) {
          const ext = tryFormats[formatIndex];
          const testPath = `data/${currentQuiz.subject}/questions/${question.filename}.${ext}`;
          console.log(`🔄 Trying format: ${testPath}`);
          img.src = testPath;
          formatIndex++;
        } else {
          console.error(`❌ All formats failed for: ${question.filename}`);
          questionImage.innerHTML = `<p style="color: red;">Không tìm thấy ảnh: ${question.filename}</p>`;
        }
      };
      
      img.onerror = () => {
        console.error(`❌ Failed to load: ${img.src}`);
        tryNextFormat();
      };
      
      img.onload = () => {
        console.log(`✅ Successfully loaded: ${img.src}`);
      };
      
      tryNextFormat();
    } else {
      console.log(`📷 Loading image with extension: ${imagePath}`);
      img.src = imagePath;
      img.onerror = () => {
        console.error(`❌ Failed to load image: ${imagePath}`);
        questionImage.innerHTML = `<p style="color: red;">Không tìm thấy ảnh: ${question.filename}</p>`;
      };
      img.onload = () => {
        console.log(`✅ Successfully loaded: ${imagePath}`);
      };
    }
    
    img.alt = question.filename;
    questionImage.appendChild(img);
  } else {
    console.warn(`⚠️ No filename found for question ${currentNum}`);
    questionImage.textContent = 'Không có ảnh';
  }
  
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  answerBtns.forEach(btn => {
    btn.classList.remove('selected', 'correct', 'wrong');
    btn.disabled = false;
  });
  
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
  
  if (answerBtns[0] && answerBtns[0].disabled) return;

  const correctAnswer = currentQuiz.questions[idx].answer;
  const isMultipleChoice = correctAnswer.length > 1;
  
  if (isMultipleChoice) {
    if (clickedBtn.classList.contains('selected')) {
      clickedBtn.classList.remove('selected');
    } else {
      clickedBtn.classList.add('selected');
    }
    
    const selectedAnswers = Array.from(answerBtns)
      .filter(btn => btn.classList.contains('selected'))
      .map(btn => btn.dataset.answer)
      .sort()
      .join('');
    
    currentQuiz.userAnswers[idx] = selectedAnswers || null;
  } else {
    answerBtns.forEach(btn => btn.classList.remove('selected'));
    clickedBtn.classList.add('selected');
    currentQuiz.userAnswers[idx] = answer;
    submitCurrentAnswer();
  }
}

function submitCurrentAnswer() {
  const idx = currentQuiz.currentIndex;
  const userAnswer = currentQuiz.userAnswers[idx];
  const correctAnswer = currentQuiz.questions[idx].answer;
  const answerBtns = answersGrid.querySelectorAll('.answer-btn');
  
  answerBtns.forEach(btn => {
    btn.disabled = true;
  });
  
  const isMultipleChoice = correctAnswer.length > 1;
  
  if (isMultipleChoice) {
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
  const correctAnswer = currentQuiz.questions[idx].answer;
  const isMultipleChoice = correctAnswer.length > 1;
  
  if (isMultipleChoice && !answerBtns[0].disabled) {
    submitCurrentAnswer();
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
  
  if (isMultipleChoice && !answerBtns[0].disabled) {
    submitCurrentAnswer();
    nextBtn.textContent = currentQuiz.currentIndex === currentQuiz.questions.length - 1 ? 'Hoàn thành' : 'Tiếp theo';
  } else {
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

// Subject select change handler
subjectSelect.addEventListener('change', (e) => {
  const subject = e.target.value;
  populateExamDropdown(subject);
});

// Exam select change handler
examSelect.addEventListener('change', async (e) => {
  const examCode = e.target.value;
  if (examCode) {
    if (!questionsData[examCode] || questionsData[examCode].length === 0) {
      await loadQuestionsForSubject(examCode);
    }
    const maxQuestions = questionsData[examCode]?.length || 100;
    questionCountInput.setAttribute('max', maxQuestions);
    questionCountInput.value = Math.min(parseInt(questionCountInput.value), maxQuestions);
  }
});

// Initialize app
(async function init() {
  loadHistoryFromStorage();
  renderHistory();
})();