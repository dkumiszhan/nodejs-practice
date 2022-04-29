let propertyId = 309400325;

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

const url = require("url");

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

exports.getData = function (req, res) {
  const queryObject = url.parse(req.url, true).query;
  console.log(queryObject);

  if (!queryObject["startDate"]) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "No startDate provided",
      })
    );
    return;
  }

  if (!queryObject["endDate"]) {
    res.writeHead(400, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message: "No endDate provided",
      })
    );
    return;
  }

  let startDate = queryObject["startDate"];
  let endDate = queryObject["endDate"];

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
      dimensions: [
        {
          name: "city",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    })
    .then((report) => {
      console.log("Report result:");
      console.log(JSON.stringify(report));

      let cities = [],
        data = [];
      report[0].rows.forEach((row) => {
        console.log(row.dimensionValues[0], row.metricValues[0]);
        cities.push(row.dimensionValues[0].value);
        data.push(parseInt(row.metricValues[0].value));
      });

      console.log("here is the result");
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          cities: cities,
          activeUsers: data,
        })
      );
    });
};
