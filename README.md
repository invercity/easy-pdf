# easy-pdf
### Create pdf reports from different sources
[![NPM Version][npm-image]][npm-url]

## Usage
    // import package
    var pdf = require('easy-pdf');
    // init report
    var report = pdf.init(options);
    // write report to file
    var file = report.write(destination, name);
    // generate basic HTML report
    var html = report.generateHTML(dataOptions);
    // generate HTML for include anywhere
    var innerHTML = report.generateInnerHTML();

## Options
```fileName``` - Report fileName (default: <generated id>) <br/>
```title``` - Report title (optional) <br/>
```desc```- Report description (optional) <br/>
```records``` - Report data <br/>
```names``` - Report column names, which should be displayed (Array of objects) Example object: `{name: 'user',title: 'User'}`
```columns``` - All column names of the ```records``` <br/>
```fontSize``` - Report data font size (default: '12px') <br/>
```mode``` - Report orientation (default: 'portrait') <br/>
```author``` - Report author (optional) <br/>
```headerHeight``` - Report header height (default: '5mm') <br/>
```footerHeight``` - Report footer height (default: '7mm') <br/>
```type``` - Report type, possible values: 'pdf', 'png', 'jpeg' (default: 'pdf') <br/>
```border``` - Report border (default: '5mm') <br/>
```format``` - Report format (default: 'A4') <br/>
```paging``` - Add page numbers (default: false) <br/>
```time``` - Add report date & time (default: false) <br/>

## Style class names
```pdf-column``` = column style <br/>
```pdf-list``` = list element style <br/>
```pdf-list-header``` - list element header style <br/>

## Develop
```npm test``` - run test page generator
```npm run clean``` - clean *.pdf files

## License
### MIT

[npm-image]: https://img.shields.io/npm/v/easy-pdf.svg
[npm-url]: https://npmjs.org/package/easy-pdf