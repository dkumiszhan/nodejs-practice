// let propertyId = 309400325;
//let propertyId = 307224650;
let defaultPropertyId = 270599279;

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

function getData(req, res) {
  if (!req.query["startDate"]) {
    res.status(400).json({
      success: false,
      message: "No startDate provided",
    });
    return;
  }

  if (!req.query["endDate"]) {
    res.status(400).json({
      success: false,
      message: "No endDate provided",
    });
    return;
  }

  if (!req.query["propertyId"]) {
    res.status(400).json({
      success: false,
      message: "No propertyId provided",
    });
    return;
  }

  let startDate = req.query["startDate"];
  let endDate = req.query["endDate"];
  let propertyId = req.query["propertyId"];
  let metrics = ["activeUsers"];
  let dimensions = ["city"];

  if (req.query.metrics) {
    metrics = req.query.metrics;
    if (typeof metrics == "string") {
      metrics = [metrics];
    }
  }

  if (req.query.dimensions) {
    dimensions = req.query.dimensions;

    if (typeof dimensions == "string") {
      dimensions = [dimensions];
    }
  }
  console.log("query string " + JSON.stringify(req.query));

  console.log(startDate);
  analyticsDataClient
    .runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: dimensions.map((name) => ({
        name: name,
      })),
      metrics: metrics.map((name) => ({
        name: name,
      })),
    })
    .then((report) => {
      console.log("Report result:");
      console.log(JSON.stringify(report, null, 2));
      res.json(report[0]);

      /*
      let cities = [],
        data = [];
      report[0].rows.forEach((row) => {
        console.log(row.dimensionValues[0], row.metricValues[0]);
        cities.push(row.dimensionValues[0].value);
        data.push(parseInt(row.metricValues[0].value));
      });

      console.log("here is the result");
      res.json({
        cities: cities,
        activeUsers: data,
      });
      */
    })
    .catch((error) => {
      res.status(500);
      res.json(error);
    });
}

module.exports = {
  getData,
};
