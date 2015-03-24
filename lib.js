/**
 *
 * Easy-pdf library
 * Make pdf reports, based on different source type
 *
 * Created by Andriy Ermolenko on 2/24/15.
 */

(function() {
    // import dependencies
    var fs = require('fs');
    var pdf = require('html-pdf');
    var shortid = require('shortid');
    var jade  = require('jade');
    var path = require('path');
    // defaults
    var DEFAULT_TPL = path.join(__dirname, './templates/main.jade');
    // library
    module.exports = {
        // attributes section
        _id: 0,
        columns: [],
        names: [],
        title: '',
        desc: '',

        // methods section

        /**
         * init report structure
         * @param data
         */
        init: function(data) {
            this._id = data.id || shortid.generate();
            this.records = data.records;
            this.names = data.names;
            this.title = data.title || 'No name';
            this.desc = data.desc || 'No description';
            return this;
        },

        /**
         * Get list of columns
         * @return {*}
         */
        getColumns: function() {
            return this.columns;
        },

        /**
         * Get title
         * @return {string}
         */
        getTitle: function() {
            return this.title;
        },

        /**
         * Generate HTML from data
         */
        generateHTML: function() {
            var fn = jade.compileFile(DEFAULT_TPL);
            return fn({
                css: './main.css',
                title: this.title,
                description: this.desc,
                names: this.names,
                records: this.records
            });
        },

        /**
         * Write result data to stream
         * @param dist (optional)
         */
        write: function(dist) {
            var fileName = path.join(dist || '',  this._id + '.pdf');
            var ws = fs.createWriteStream(fileName);
            var html = this.generateHTML();
            pdf.create(html, {
                border: '5mm'
            }).toStream(function(err, stream) {
                if (!err) stream.pipe(ws);
                else console.log(err);
            });
        }
    };
}());