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
const UNIT_ALLTIME = 3;

let currentUnit = UNIT_DAY;
let byTimeData = [];

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

const byTimeChartConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Historic View",
        backgroundColor: "#FEC414",
        borderColor: "#FEC414",
        data: [],
        stepped: true,
      },
    ],
  },
  options: {
    scales: {
      x: {
        min: "2020",
        type: "time",
        time: {
          unit: "year",
        },
      },
    },
  },
};

let byTimeChart;
let byCityChart;

function getStartDate() {
  return $("#reportrange")
    .data("daterangepicker")
    .startDate.format("YYYY-MM-DD");
}

function getEndDate() {
  return $("#reportrange").data("daterangepicker").endDate.format("YYYY-MM-DD");
}

// const chooseDateButton = document.querySelector(".choose-date");
const boardsTitle = document.querySelector(".boards__title");

function initCharts() {
  byTimeChart = new Chart(
    document.getElementsByClassName("by_time_chart"),
    byTimeChartConfig
  );
  byCityChart = new Chart(
    document.getElementsByClassName("by_city_chart"),
    byCityChartConfig
  );
}

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
}

// chooseDateButton.addEventListener("click", function () {
//   console.log("you clicked");
//   dateChosen();
// });

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
  let startDate = getStartDate();
  let endDate = getEndDate();

  refreshByTimeChart(startDate, endDate);
  refreshByCityChart(startDate, endDate);

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

function updateByCityUnit(parser, unit, startDate, endDate) {
  let result = {};
  result[parser(getStartDate().replaceAll("-", ""))] = 0;
  result[parser(getEndDate().replaceAll("-", ""))] = 0;

  byTimeData.forEach((row) => {
    let label = row[0];
    let value = row[1];
    let parsed = parser(label);
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
    data.push({
      x: label,
      y: nextValue,
    });
  });

  console.log(data);

  // byTimeChartConfig.data.labels = labels;
  byTimeChartConfig.data.datasets[0].data = data;
  byTimeChartConfig.options.scales.x.min = startDate;
  byTimeChartConfig.options.scales.x.max = endDate;
  byTimeChartConfig.options.scales.x.time.unit = unit;
  console.log(byTimeChartConfig.data);
  byTimeChart.update();
}

function handleUnitButton(newUnit) {
  console.log("handleUnitButton()");
  currentUnit = newUnit;

  switch (currentUnit) {
    case UNIT_DAY:
      updateByCityUnit(
        (day) =>
          `${day.substring(0, 4)}-${day.substring(4, 6)}-${day.substring(
            6,
            8
          )}`,
        "day"
      );
      break;
    case UNIT_MONTH:
      updateByCityUnit(
        (day) => `${day.substring(0, 4)}-${day.substring(4, 6)}`,
        "month"
      );
      break;
    case UNIT_YEAR:
      updateByCityUnit((day) => day.substring(0, 4), "year");
      break;
    case UNIT_ALLTIME:
      updateByCityUnit((day) => day.substring(0, 4));
      break;
    default:
      console.log("default");
  }
}

window.handleUnitButton = handleUnitButton;

function refreshByTimeChart(startDate, endDate) {
  fetchActiveUsers(startDate, endDate, ["date"]).then((response) => {
    // chartConfig.data.labels = response.cities;
    // chartConfig.data.datasets[0].data = response.activeUsers;
    byTimeData = response.rows.map((row) => [
      row.dimensionValues[0].value,
      parseInt(row.metricValues[0].value),
    ]);

    handleUnitButton(currentUnit);

    console.log(response);
    // chart.update();
  });
}

function refreshByCityChart(startDate, endDate) {
  fetchActiveUsers(startDate, endDate, ["city"]).then((response) => {
    // chartConfig.data.labels = response.cities;
    // chartConfig.data.datasets[0].data = response.activeUsers;
    byCityChartConfig.data.labels = [];
    byCityChartConfig.data.datasets[0].data = [];
    response.rows.map((row) => {
      byCityChartConfig.data.labels.push(row.dimensionValues[0].value);
      byCityChartConfig.data.datasets[0].data.push(
        parseInt(row.metricValues[0].value)
      );
    });
    //byCityChartConfig.data.labels = byTimeData[0];
    //byCityChartConfig.data.datasets[0].data = byTimeData[1];

    //handleUnitButton(currentUnit);

    console.log(response);
    byCityChart.update();
  });
}

function initializeDatepicker() {
  function cb(start, end) {
    $("#reportrange span").html(
      start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY")
    );
  }

  $("#reportrange").daterangepicker(
    {
      startDate: moment().subtract(5, "days"),
      endDate: moment(),
      ranges: {
        "Quarter 1": [
          moment().startOf("year"),
          moment().startOf("year").add(2, "month").endOf("month"),
        ],
        "Quarter 2": [
          moment().startOf("year").add(3, "month"),
          moment().startOf("year").add(5, "month").endOf("month"),
        ],
        "Quarter 3": [
          moment().startOf("year").add(6, "month"),
          moment().startOf("year").add(8, "month").endOf("month"),
        ],
        "Quarter 4": [
          moment().startOf("year").add(9, "month"),
          moment().startOf("year").add(11, "month").endOf("month"),
        ],
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
    },
    cb
  );

  cb(moment().subtract(5, "days"), moment());

  $("#reportrange").on("apply.daterangepicker", function (ev, picker) {
    //do something, like clearing an input
    // console.log($("#daterange").val());
    // console.log(ev);
    // console.log(picker);
    dateChosen();
  });
}

initCharts();
initializeDatepicker();
