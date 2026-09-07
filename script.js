const questions = [
  {
    question: "1年は何日ですか？（うるう年を除く）",
    choices: ["364日", "365日", "366日", "360日"],
    answerIndex: 1
  },
  {
    question: "日本の首都はどこですか？",
    choices: ["大阪", "京都", "東京", "名古屋"],
    answerIndex: 2
  },
  {
    question: "水の化学式はどれですか？",
    choices: ["CO2", "H2O", "O2", "NaCl"],
    answerIndex: 1
  },
  {
    question: "1週間は何日ですか？",
    choices: ["5日", "6日", "7日", "8日"],
    answerIndex: 2
  },
  {
    question: "人間の体温の平均は約何度ですか？",
    choices: ["約30度", "約36度", "約40度", "約45度"],
    answerIndex: 1
  }
];

let currentIndex = 0;
let score = 0;
let answerResults = [];
let resultChart = null;

const progressEl = document.getElementById("progress");
const questionTextEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const scoreTextEl = document.getElementById("score-text");

function renderQuestion() {
  const current = questions[currentIndex];
  progressEl.textContent = `第 ${currentIndex + 1} 問 / ${questions.length} 問`;
  questionTextEl.textContent = current.question;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.hidden = true;
  choicesEl.innerHTML = "";

  current.choices.forEach((choiceText, index) => {
    const btn = document.createElement("button");
    btn.textContent = choiceText;
    btn.className = "choice-btn";
    btn.addEventListener("click", () => selectChoice(index));
    choicesEl.appendChild(btn);
  });
}

function selectChoice(selectedIndex) {
  const current = questions[currentIndex];
  const buttons = choicesEl.querySelectorAll(".choice-btn");

  buttons.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === current.answerIndex) {
    buttons[selectedIndex].classList.add("correct");
    feedbackEl.textContent = "正解です！";
    feedbackEl.classList.add("correct");
    score++;
    answerResults[currentIndex] = 1;
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    buttons[current.answerIndex].classList.add("correct");
    feedbackEl.textContent = "不正解です";
    feedbackEl.classList.add("incorrect");
    answerResults[currentIndex] = 0;
  }

  nextBtn.hidden = false;
}

function showResult() {
  quizScreen.hidden = true;
  resultScreen.hidden = false;
  scoreTextEl.textContent = `${questions.length}問中${score}問正解しました`;
  renderResultChart();
}

function renderResultChart() {
  const chartCanvas = document.getElementById("result-chart");

  if (resultChart) {
    resultChart.destroy();
  }

  resultChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: questions.map((_, index) => `${index + 1}問目`),
      datasets: [{
        label: "正解（1） / 不正解（0）",
        data: answerResults,
        backgroundColor: answerResults.map((result) => result ? "#34a853" : "#e04343"),
        borderRadius: 6
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  score = 0;
  answerResults = [];
  quizScreen.hidden = false;
  resultScreen.hidden = true;
  renderQuestion();
});

async function loadTokyoWeather() {
  const statusEl = document.getElementById("weather-status");
  const detailsEl = document.getElementById("weather-details");
  const iconEl = document.getElementById("weather-icon");

  try {
    const response = await fetch("/api/weather");
    const weather = await response.json();

    if (!response.ok) {
      throw new Error(weather.error || "天気情報を取得できませんでした");
    }

    document.getElementById("weather-description").textContent = weather.description;
    document.getElementById("weather-temperature").textContent = `${Math.round(weather.temperature)}°`;
    document.getElementById("weather-max").textContent = `${Math.round(weather.maxTemperature)}°`;
    document.getElementById("weather-min").textContent = `${Math.round(weather.minTemperature)}°`;
    document.getElementById("weather-humidity").textContent = `${weather.humidity}%`;
    iconEl.textContent = weather.icon;
    statusEl.hidden = true;
    detailsEl.hidden = false;
  } catch (error) {
    statusEl.textContent = error.message;
  }
}

renderQuestion();
loadTokyoWeather();