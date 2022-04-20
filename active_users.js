let propertyId = 309400325;

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const url = require('url');


// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

exports.getData = function (req, res) {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);
    let startDate = '2022-03-31';
    if (queryObject['date']) {
        startDate = queryObject['date'];
    }
    console.log(startDate);
    analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: startDate,
                endDate: 'today',
            },
        ],
        dimensions: [
            {
                name: 'city',
            },
        ],
        metrics: [
            {
                name: 'activeUsers',
            },
        ],
    }).then((report) => {

        console.log('Report result:');
        console.log(JSON.stringify(report));
        // console.log(JSON.stringify(response, null, 2));
        let cities = [], data = [];
        report[0].rows.forEach(row => {
            console.log(row.dimensionValues[0], row.metricValues[0]);
            cities.push(row.dimensionValues[0].value);
            data.push(parseInt(row.metricValues[0].value));
        });

        console.log('here is the result');
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({
            cities: cities,
            activeUsers: data
        }));
    });
}