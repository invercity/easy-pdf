# easy-pdf
### Create pdf reports from different sources
[![NPM Version][npm-image]][npm-url]

## Usage
    var pdf = require('easy-pdf');
    var report = pdf.init(options);
    var file = report.write(destination, name);
    var html = report.generateHTML(excludeCss);
    var css = report.getCSS();
## Options
```fileName``` - Report fileName (default: generated) <br/>
```title``` - Report title (default: 'No title') <br/>
```desc```- Report description (default: 'No description') <br/>
```records``` - Report data <br/>
```names``` - Report column names, which should be displayed (Array of objects) Example object: `{name: 'user',title: 'User'}`
```columns``` - All column names of the ```records``` <br/>
```fontSize``` - Report data font size (default: '12px') <br/>
```mode``` - Report orientaton (default: 'portrait') <br/>
```author``` - Report author (default: 'Default author') <br/>
```headerHeight``` - Report header height (default: '5mm') <br/>
```footerHeight``` - Report footer height (default: '7mm') <br/>
```type``` - Report type, possible values: 'pdf', 'png', 'jpeg' (default: 'pdf') <br/>
```border``` - Report border (default: '5mm') <br/>
```format``` - Report format (default: 'A4') <br/>

[npm-image]: https://img.shields.io/npm/v/easy-pdf.svg
[npm-url]: https://npmjs.org/package/easy-pdf