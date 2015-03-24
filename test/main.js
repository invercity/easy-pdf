/**
 * Created by invercity on 24.03.15.
 */
var easyreport = require('../lib');
var report = easyreport.init({
    title: 'Report1',
    desc: 'Report for testing',
    names: ['List1', 'List2'],
    records: [[1, 2, 3], [2, 3, 4]]
});
var file = report.write('../');
console.log(report.generateHTML());