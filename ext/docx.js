const fs = require('fs');

const docx = require('html-docx-js');

module.exports = {
  types: ['docx'],
  generate: function(html, options, fileName) {
    const docxObj = docx.asBlob(html);
    fs.writeFile(fileName, docxObj, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};
