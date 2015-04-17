/**
 * Created by Andriy Ermolenko on 24.03.15.
 */
var easyreport = require('../lib');
var report = easyreport.init({
    title: 'Report1',
    author: 'Andrew',
    desc: 'Report for testing',
    names: [{name: 'a', title: 'AAA'},{name: 'c', title: 'Something else'}],
    columns: ['a','b','c'],
    records: [[1, 2, 3], [2, 3, 4], [3, 2, 3], [12, 45, 5], [1, 2, 3], [2, 3, 4], [3, 2, 3], [12, 45, 5]],
    fontSize: '20px',
    mode: 'landscape'
});
if (!process.env.LOG) report.write();
else console.log(report.generateHTML());