const pdf = require('html-pdf');
const fs = require('fs');

module.exports = {
  types: ['pdf'],
  generate: (html, options, fileName) => {
    const obj = options;
    const ws = fs.createWriteStream(fileName);
    pdf.create(html, {
      border: obj.border,
      orientation: obj.options.orientation,
      header: obj.header,
      footer: obj.footer,
      type: obj.options.type,
      format: obj.options.format
    }).toStream((err, stream) => {
      if (!err) {
        stream.pipe(ws);
      }
      else {
        console.log(err);
      }
    });
  }
};
