# easy-pdf
### Create pdf reports from different sources

## Usage
    var pdf = require('easy-pdf');
    var report = pdf.init(options);
    var file = report.write(destination, name);
## Options
```fileName``` - Report fileName (default: generated) <br/>
```title``` - Report title (default: 'No title') <br/>
```desc```- Report description (default: 'No description') <br/>
```records``` - Report data <br/>
```names``` - Report column names <br/>
```fontSize``` - Report data font size (default: '12px') <br/>
```mode``` - Report orientaton (default: 'portrait') <br/>
## Current version
0.1.4