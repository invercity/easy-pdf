/**
 * Created by invercity on 24.03.15.
 */
var easyreport = require('../lib');
var report = easyreport.init({
    title: 'Report1',
    desc: 'Report for testing',
    names: ['List1', 'List2', 'OFFFFFCOURSE', 'Test4444', 'List1', 'List2', 'OFFFFFCOURSE', 'Test4444'],
    records: [[1, 2, 3], [2, 3, 4], [3, 2, 3], [12, 45, 5], [1, 2, 3], [2, 3, 4], [3, 2, 3], [12, 45, 5]]
});
var file = report.write();
//console.log(report.generateHTML());