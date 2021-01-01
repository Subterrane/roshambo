window.addEventListener("DOMContentLoaded", () => {
  const scoresCtx = document.getElementById("scores");
  const statsCtx = document.getElementById("stats");
  const output = document.querySelector("#output");
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => button.addEventListener("click", clicked));
  const history = [];
  const scores = { p: 0, c: 0 };
  const stats = { r: 0, p: 0, s: 0 };

  const scoreChart = displayScores(scores, scoresCtx);
  const statsChart = displayStats(scores, statsCtx);

  function clicked(event) {
    const pthrow = event.currentTarget.id;
    const cthrow = chooseThrow(history);
    const winner = determineWinner(pthrow, cthrow);
    const timestamp = Date.now();
    const round = { pthrow, cthrow, winner, timestamp };
    stats[pthrow]++;
    history.push(round);
    displayResult(scores, scoreChart, output, round, history);
    updateStats(stats, statsChart);
  }
});

function determineWinner(pthrow, cthrow) {
  if (pthrow === cthrow) return "t";
  else if (pthrow == "r") return cthrow == "p" ? "c" : "p";
  else if (pthrow == "p") return cthrow == "s" ? "c" : "p";
  else if (pthrow == "s") return cthrow == "r" ? "c" : "p";
}

function getThrowLabel(code) {
  return { r: "Rock", p: "Paper", s: "Scissors" }[code];
}

function getResultLabel(code) {
  return { t: "tie.", p: "win!", c: "lose." }[code];
}

function displayResult(scores, scoreChart, output, round, history) {
  if (round.winner === "c") scores.c++;
  if (round.winner === "p") scores.p++;

  updateScores(scores, scoreChart);
  displayText(output, round, history);
}

function displayScores(scores, ctx) {
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Player", "Computer"],
      datasets: [
        {
          data: [scores.p, scores.c],
          backgroundColor: ["rgb(255, 205, 86)", "rgb(255, 99, 132)"],
        },
      ],
    },
    options: {
      rotation: Math.PI,
      circumference: Math.PI,
    },
  });
}

function updateScores(scores, chart) {
  chart.data.datasets[0].data = [scores.p, scores.c];
  chart.update();
}

function displayStats(stats, ctx) {
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Rock", "Paper", "Scissors"],
      datasets: [
        {
          label: "Throws",
          data: [stats.r, stats.p, stats.s],
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
          ],
        },
      ],
    },
    options: {
      scales: { yAxes: [{ ticks: { beginAtZero: true, stepSize: 1 } }] },
    },
  });
}

function updateStats(stats, chart) {
  chart.data.datasets[0].data = [stats.r, stats.p, stats.s];
  chart.update();
}

function displayText(output, round, history) {
  output.append(`You threw ${getThrowLabel(round.pthrow)}\n`);
  output.append(`Computer threw ${getThrowLabel(round.cthrow)}\n`);
  output.append(`You ${getResultLabel(round.winner)}\n`);
  output.append(`${getTaunt(history)}\n`);
  output.scrollTop = output.scrollHeight;
}

function getTaunt(history) {
  // TODO: need better taunts. Streaks and things would be fun
  const index = history.length - 1;
  const lastWin = getLastPlayerWin(history);
  if (lastWin && history[index].winner === "c")
    return `Your last win, you threw ${getThrowLabel(lastWin.pthrow)}`;
  if (history[index - 1]?.winner !== "p" && history[index].winner === "p")
    return "Finally!";
  return "";
}

function getLastPlayerWin(history) {
  let index = history.length;
  while (--index >= 0) {
    const round = history[index];
    if (round.winner === "p") return round;
  }
}

function chooseThrow(_history) {
  // TODO: use history to choose a better throw?

  // pick one at random
  return ["r", "p", "s"][~~(Math.random() * 3)];
}
