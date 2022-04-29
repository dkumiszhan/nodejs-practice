const socket = io("ws://localhost:3000");

// send a message to the server
socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

// receive a message from the server
socket.on("hello from server", (...args) => {
  console.log("recieved hello from backend: " + JSON.stringify(args));
  // ...
});

// socket.on("new-number", (...args) => {
//   console.log("received new number " + args[0]);

//   document.querySelector("#number").innerHTML = args[0];
// });

console.log("Hello from frontend JS");

const config = {
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

const configHistoric = {
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

const configHistoricCities = {
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

let myChart;
let myChartHistoric;
let myChartHistoricCities;

const startDate = document.querySelector(".start-date");
const endDate = document.querySelector(".end-date");

function initChart() {
  myChart = new Chart(document.getElementById("myChart"), config);
  myChartHistoric = new Chart(
    document.getElementsByClassName("historic-view"),
    configHistoric
  );
  myChartHistoricCities = new Chart(
    document.getElementsByClassName("historic-view-cities"),
    configHistoricCities
  );
}

initChart();

const totalUsers = document.querySelector(".totalUsers");
console.log(totalUsers);
function updateChart(cities, activeUsers) {
  console.log(activeUsers);
  const usersCount = activeUsers.reduce(
    (accumulator, curr) => accumulator + curr,
    0
  );
  console.log(usersCount);
  totalUsers.textContent = usersCount;
  config.data.labels = cities;
  config.data.datasets[0].data = activeUsers;
  myChart.update();
}

startDate.addEventListener("change", function () {
  console.log(this);
  //startDate.value = this;
  startDate.onchange = dateChanged(this);
});

endDate.addEventListener("change", function () {
  endDate.onchange = dateChanged(this);
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

function dateChanged(target) {
  console.log("date changed ", target.value);
  let date = target.value;

  let httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", "/api/active_users.json?date=" + date, true);
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      // Everything is good, the response was received.
      if (httpRequest.status === 200) {
        alert(httpRequest.responseText);
        let parsed = JSON.parse(httpRequest.responseText);
        updateChart(parsed.cities, parsed.activeUsers);
      } else {
        alert("There was a problem with the request.");
      }
    } else {
      // Not ready yet.
    }
  };

  httpRequest.send();
}
