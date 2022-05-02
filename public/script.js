// const socket = io("ws://localhost:3000");

// send a message to the server
// socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// receive a message from the server
// socket.on("hello from server", (...args) => {
//   console.log("recieved hello from backend: " + JSON.stringify(args));
//   // ...
// });

// socket.on("new-number", (...args) => {
//   console.log("received new number " + args[0]);

//   document.querySelector("#number").innerHTML = args[0];
// });

console.log("Hello from frontend JS");

const dayChartConfig = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Day View",
        backgroundColor: "#2E5681",
        borderColor: "#2E5681",
        data: [],
      },
    ],
  },
  options: {},
};

const byDayChartConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Historic View",
        backgroundColor: "#FEC414",
        borderColor: "#FEC414",
        data: [],
      },
    ],
  },
  options: {},
};

const byCityChartConfig = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Historic View",
        backgroundColor: "#FEC414",
        borderColor: "#FEC414",
        data: [],
      },
    ],
  },
  options: {},
};

let dayChart;
let byCityChart;
let byDayChart;

const startDateInput = document.querySelector(".start-date");
const endDateInput = document.querySelector(".end-date");
const chooseDateButton = document.querySelector(".choose-date");
const boardsTitle = document.querySelector(".boards__title");

function initCharts() {
  dayChart = new Chart(
    document.getElementsByClassName("daily_chart"),
    dayChartConfig
  );
  byCityChart = new Chart(
    document.getElementsByClassName("by_city_chart"),
    byCityChartConfig
  );
  byDayChart = new Chart(
    document.getElementsByClassName("by_day_chart"),
    byDayChartConfig
  );
}

initCharts();

const totalUsers = document.querySelector(".totalUsers");
console.log(totalUsers);

function updateCharts(cities, activeUsers) {
  console.log(activeUsers);
  const usersCount = activeUsers.reduce(
    (accumulator, curr) => accumulator + curr,
    0
  );
  console.log(usersCount);
  totalUsers.textContent = usersCount;
  boardsTitle.classList.add("boards__title_visible");
  dayChartConfig.data.labels = cities;
  dayChartConfig.data.datasets[0].data = activeUsers;
  dayChart.update();
}

chooseDateButton.addEventListener("click", function () {
  console.log("you clicked");
  dateChosen();
});

function collectData(dateStart, dateEnd) {
  // let httpRequest = new XMLHttpRequest();
  // httpRequest.open("GET", "/api/active_users.json?date=" + date, true);
  // httpRequest.onreadystatechange = function () {
  //   if (httpRequest.readyState === XMLHttpRequest.DONE) {
  //     // Everything is good, the response was received.
  //     if (httpRequest.status === 200) {
  //       alert(httpRequest.responseText);
  //       let parsed = JSON.parse(httpRequest.responseText);
  //       updateChart(parsed.cities, parsed.activeUsers);
  //     } else {
  //       alert("There was a problem with the request.");
  //     }
  //   } else {
  //     // Not ready yet.
  //   }
  // };
}

function dateChosen() {
  let startDate = startDateInput.value;
  let endDate = endDateInput.value;

  refreshByCityChart(startDate, endDate);
  refreshByDayChart(startDate, endDate);
  refreshDailyChart(startDate);

  /*
  let httpRequest = new XMLHttpRequest();
  httpRequest.open(
    "GET",
    `/api/active_users.json?startDate=${startDate}&endDate=${endDate}`,
    true
  );
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      // Everything is good, the response was received.
      if (httpRequest.status === 200) {
        alert(httpRequest.responseText);
        let parsed = JSON.parse(httpRequest.responseText);
        updateCharts(parsed.cities, parsed.activeUsers);
      } else {
        alert("There was a problem with the request.");
      }
    } else {
      // Not ready yet.
    }
  };

  httpRequest.send();
  */
}

/**
 * Copied from https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
 */
function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}

function fetchActiveUsers(startDate, endDate) {
  return makeRequest(
    "GET",
    `/api/active_users.json?startDate=${startDate}&endDate=${endDate}`
  ).then((value) => JSON.parse(value)); // TODO possibly parse responseText instead
}

function refreshDailyChart(startDate) {
  refreshByCityHelperChart(dayChart, dayChartConfig, startDate, startDate);
}

function refreshByCityChart(startDate, endDate) {
  refreshByCityHelperChart(byCityChart, byCityChartConfig, startDate, endDate);
}

function refreshByDayChart(startDate, endDate) {}

function refreshByCityHelperChart(chart, chartConfig, startDate, endDate) {
  fetchActiveUsers(startDate, endDate).then((response) => {
    chartConfig.data.labels = response.cities;
    chartConfig.data.datasets[0].data = response.activeUsers;
    chart.update();
  });
}
