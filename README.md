# easy-pdf
### Create pdf reports from different sources

## Usage
    var pdf = require('easy-pdf');
    var report = pdf.init(options);
    var file = report.write(destination, name);
## Options
```id``` - Report id (name) <br/>
```title``` - Report title <br/>
```desc```- Report description <br/>
```records``` - Report data <br/>
```names``` - Report column names <br/>
## Current version
0.1.1