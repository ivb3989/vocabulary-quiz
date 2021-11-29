var questions = [
  {
    question: "everybody",
    answer: "всі",
  },
  {
    question: "enemy",
    answer: "ворог",
  },
  {
    question: "road",
    answer: "дорога",
  },
  {
    question: "body",
    answer: "тіло",
  },
  {
    question: "to pray",
    answer: "молитися",
  },
  {
    question: "to swear",
    answer: "лаятися",
  },
  {
    question: "saint",
    answer: "святий",
  },
  {
    question: "tree",
    correct: "дерево",
  },
  {
    question: "to run",
    answer: "бігти",
  },
  {
    question: "smile",
    answer: "посмішка",
  },
  {
    question: "head",
    answer: "голова",
  },
  {
    question: "apple",
    answer: "яблуко",
  },
  {
    question: "page",
    answer: "сторінка",
  },
  {
    question: "language",
    answer: "мова",
  },
  {
    question: "clock",
    answer: "годинник",
  },
  {
    question: "thunder",
    answer: "грім",
  },
  {
    question: "candy",
    answer: "цукерки",
  },
  {
    question: "text",
    answer: "текст",
  },
  {
    question: "phone",
    answer: "телефон",
  },
  {
    question: "music",
    answer: "музика",
  },
];

/* let uniques = chance
  .unique(chance.natural, 10, { min: 1, max: questions.length - 1 })
  .map((x) => (x !== 7 ? x : Math.floor(Math.random() * 7))); */
  let uniques = Array(questions.length - 1).fill().map((_, index) => index + 1).sort(() => Math.random() - 0.5).slice(0, 10).map((x) => (x !== 7 ? x : Math.floor(Math.random() * 7)));


let index = 0;

$(document).ready(function () {
  // Variable Declarations
  const $question = $(".question");
  const $answer = $(".answer");
  const $form = $("form");
  const $userAnswer = $("form input");
  const $popUp = $(".overlay");
  const $bg = $(".problem");
  const $progressBar = $(".progress-bar");
  const $statement = $(".statement");
  const $gameStatus = $(".game-status");
  const $reset = $(".overlay button");

  $userAnswer.focus();

  let state = {
    wrongAnswers: 0,
    questionsLeft: 10,
    currentQuestion: null,
  };

  // Function Declarations
  function generateNumber(x) {
    return Math.floor(Math.random() * x + 1);
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    console.log(a);
    return a;
  }

  function updateQuestion() {
    state.currentQuestion = questions[uniques[index]];
    if (typeof state.currentQuestion === "undefined") {
      state.currentQuestion = questions[0];
    }
    let q = state.currentQuestion;
    if (typeof q === "undefined") {
      q = questions[0];
      if (typeof q.question === "undefined") {
        q.question = questions[0].question;
      }
      if (typeof q.answer === "undefined") {
        q.question = questions[0].answer;
      }
    }

    $question.text(q.question);
    $answer.text(q.answer);
    console.log(q);
    ++index;
  }

  function updateStatement() {
    let x = state.questionsLeft;
    let y = state.wrongAnswers;
    let message = `You have ${x} question`;
    if (x > 1) {
      message += `s`;
    }
    message += `  to answer<br>and ${y} wrong answer`;
    if (y > 1) {
      message += `s`;
    }
    message += ".";
    return message;
  }

  function formSub(e) {
    e.preventDefault();
    $userAnswer.focus();
    $("button").prop("disabled", true);
    let correctAnswer = state.currentQuestion.answer;

    $form.focus();
    if (correctAnswer === $.trim($userAnswer.val()).toLowerCase()) {
      state.questionsLeft -= 1;
      $statement.html(updateStatement());
      $progressBar.css({
        transform: `scaleX(0.${10 - state.questionsLeft})`,
      });
      if (state.questionsLeft === 0) {
        $reset.focus();
        gameOver(state.wrongAnswers);
      }
      updateQuestion();
      $("button").prop("disabled", false);
    } else {
      state.questionsLeft -= 1;
      state.wrongAnswers += 1;
      $(`.box:nth-child(${10 - state.questionsLeft})`).css({
        background: "red",
      });
      /* $question.addClass("error"); */
      $(".wrapper").flip(true);
      setTimeout(() => {
        $(".wrapper").flip(false);
        /* $question.removeClass("error"); */
      }, 1150);
      if (state.questionsLeft === 0) {
        $reset.focus();
        gameOver(state.wrongAnswers);
      }
      $statement.html(updateStatement());
      setTimeout(() => {
        updateQuestion();
        $("button").prop("disabled", false);
      }, 1300);
    }
    $userAnswer.val("");
  }

  function gameOver(won) {
    $form.blur();
    $userAnswer.blur();

    $bg.addClass("blur");
    $popUp.removeClass("hid");
    $progressBar.css({ transform: `scaleX(0.${10 - state.questionsLeft})` });
    $(".box").css({ background: "transparent" });

    if (won === 0) {
      $gameStatus.text(`YOU ARE A MASTER JEDI. MY CONGRATULATIONS!!!`);
    } else if (won <= 4) {
      $gameStatus.text(`Your Result Is Good.`);
    } else if (won === 5) {
      $gameStatus.text(`Your Result Is Average.`);
    } else if (won >= 6 && won <= 9) {
      $gameStatus.text(`Your Result Is Below Average.`);
    } else if (won === 10) {
      $gameStatus.html(`You're A Looser :D<br> You've Lost the Game.`);
    }
    $reset.focus();
  }

  function resetGame() {
    console.log(state.wrongAnswers);
    index = 0;
    uniques = Array(questions.length - 1).fill().map((_, index) => index + 1).sort(() => Math.random() - 0.5).slice(0, 10).map((x) => (x !== 7 ? x : Math.floor(Math.random() * 7)));
    state.questionsLeft = 10;
    state.wrongAnswers = 0;

    $bg.removeClass("blur");
    $popUp.addClass("hid");
    $progressBar.css({ transform: "scaleX(0.0)" });
    $(".box").css({ background: "transparent" });
    $statement.html(
      `You have ${state.questionsLeft} questions to answer<br>and ${state.wrongAnswers} wrongs.`
    );
    updateQuestion();

    $userAnswer.focus();
  }

  // Events
  $form.on("submit", formSub);
  $reset.on("click", resetGame);
  $(".wrapper").flip({ trigger: "manual" });
  // Function Calls
  console.log(uniques);
  shuffle(questions);
  updateQuestion();
});
