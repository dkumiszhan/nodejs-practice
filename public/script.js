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

const UNIT_DAY = 0;
const UNIT_MONTH = 1;
const UNIT_YEAR = 2;

let currentUnit = UNIT_DAY;
let byCityData = [];

const dayChartConfig = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Single Day View",
        backgroundColor: "#2E5681",
        borderColor: "#2E5681",
        data: [],
      },
    ],
  },
  options: {},
};

const byDayChartConfig = {
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

const byCityChartConfig = {
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

function fetchActiveUsers(startDate, endDate, dimensions) {
  let dimensionsQuery = dimensions
    .map((name) => `dimensions=${name}`)
    .join("&");
  return makeRequest(
    "GET",
    `/api/active_users.json?startDate=${startDate}&endDate=${endDate}&${dimensionsQuery}`
  ).then((value) => JSON.parse(value)); // TODO possibly parse responseText instead
}

function refreshDailyChart(startDate) {
  refreshByCityHelperChart(dayChart, dayChartConfig, startDate, startDate);
}

function updateByCityUnit(extractor) {
  let result = {};
  byCityData.forEach((row) => {
    let label = row[0];
    let value = row[1];
    let parsed = extractor(label);
    if (result[parsed]) {
      result[parsed] += value;
    } else {
      result[parsed] = value;
    }
  });

  let labels = Object.keys(result).sort();
  let data = [];
  let acc = 0;
  labels.forEach((label) => {
    let nextValue = acc + result[label];
    acc = nextValue;
    data.push(nextValue);
  });

  byCityChartConfig.data.labels = labels;
  byCityChartConfig.data.datasets[0].data = data;
  byCityChart.update();
}

function handleUnitButton(newUnit) {
  console.log("I am here");
  currentUnit = newUnit;

  switch (currentUnit) {
    case UNIT_DAY:
      updateByCityUnit((day) => day);
      break;
    case UNIT_MONTH:
      updateByCityUnit((day) => day.substring(0, 6));
      break;
    case UNIT_YEAR:
      updateByCityUnit((day) => day.substring(0, 4));
      break;
    default:
      console.log("default");
  }
}

window.handleUnitButton = handleUnitButton;

function refreshByCityChart(startDate, endDate) {
  fetchActiveUsers(startDate, endDate, ["date"]).then((response) => {
    // chartConfig.data.labels = response.cities;
    // chartConfig.data.datasets[0].data = response.activeUsers;
    byCityData = response.rows.map((row) => [
      row.dimensionValues[0].value,
      row.metricValues[0].value,
    ]);

    handleUnitButton(currentUnit);

    console.log(response);
    // chart.update();
  });
}

function refreshByDayChart(startDate, endDate) {}

function refreshByCityHelperChart(chart, chartConfig, startDate, endDate) {
  // TODO
}
