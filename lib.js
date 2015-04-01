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
        css: './main.css',
        columns: [],
        names: [],
        title: 'No title',
        description: 'No description',
        fontSize: '12px',
        records: [],
        orientation: 'portrait',
        border: '5mm',
        header: {
            height: '5mm'
        },
        footer: {
            height: '7mm'
        },

        // methods section

        /**
         * init report structure
         * @param data
         */
        init: function(data) {
            this._id = data.fileName || shortid.generate();
            this.header.contents = '<div style="text-align: center;">Author: ' + data.author || 'Default author' + '</div>';
            this.footer.contents = '<div style="font-size: 12px"><span>page {{page}}</span>of <span>{{pages}}</span>' +
            '<span style="float: right;">'+ new Date().toLocaleDateString() + '</span></div>';
            data.headerHeight && (this.header.height = data.headerHeight);
            data.footerHeight && (this.footer.height = data.footerHeight);
            data.records && (this.records = data.records);
            data.names && (this.names = data.names);
            data.title && (this.title = data.title);
            data.desc && (this.description = data.desc);
            data.fontSize && (this.fontSize = data.fontSize);
            data.mode && (this.orientation = data.mode);

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
            return fn(this);
        },

        /**
         * Write result data to stream
         * @param dist (optional)
         * @param name (optional)
         */
        write: function(dist, name) {
            var obj = this;
            var fileName = path.join(dist || '', name || this._id + '.pdf');
            var ws = fs.createWriteStream(fileName);
            var html = this.generateHTML();
            pdf.create(html, {
                border: obj.border,
                orientation: obj.orientation,
                header: obj.header,
                footer: obj.footer
            }).toStream(function(err, stream) {
                if (!err) stream.pipe(ws);
                else console.log(err);
            });
        }
    };
}());