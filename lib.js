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
    var _ = require('underscore');
    // defaults
    var DEFAULT_TPL = path.join(__dirname, './templates/main.jade');
    // library
    module.exports = {
        // attributes section
        _id: 0,
        //cssFile: 'style.css',
        author: 'Default author',
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
        type: 'pdf',
        format: 'A4',

        // methods section

        /**
         * init report structure
         * @param data
         */
        init: function(data) {
            this._id = data.fileName || shortid.generate();
            data.author && (this.author = data.author);
            this.header.contents = '<div style="text-align: center;">Author: ' + this.author + '</div>';
            this.footer.contents = '<div style="font-size: 12px"><span>page {{page}}</span>of <span>{{pages}}</span>' +
            '<span style="float: right;">'+ new Date().toLocaleDateString() + '</span></div>';
            data.headerHeight && (this.header.height = data.headerHeight);
            data.footerHeight && (this.footer.height = data.footerHeight);
            data.records && (this.records = data.records);
            data.names && (this.names = data.names);
            // fix names if they were not selected by default
            data.names || (this.names = _.map(data.columns, function(el) {
                return {
                    name: el,
                    title: el
                }
            }));
            data.columns && (this.columns = data.columns);
            data.title && (this.title = data.title);
            data.desc && (this.description = data.desc);
            data.fontSize && (this.fontSize = data.fontSize);
            data.mode && (this.orientation = data.mode);
            data.type && (this.type = data.type);
            //data.cssFile && (this.cssFile = data.cssFile);
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
         * @param options - additional options
         * @return {*}
         */
        generateHTML: function(options) {
            var object = _.extend(this, options);
            return jade.compileFile(DEFAULT_TPL)(object);
        },

        /**
         * Generate HTML without Doctype
         * @return {*}
         */
        generateInnerHTML: function() {
            return this.generateHTML({excludeLayout: true});
        },

        /**
         * Write result data to stream
         * @param dist (optional)
         * @param name (optional)
         */
        write: function(dist, name) {
            var obj = this;
            var fileName = path.join(dist || '', name || this._id + '.' + this.type);
            var ws = fs.createWriteStream(fileName);
            var html = this.generateHTML();
            pdf.create(html, {
                border: obj.border,
                orientation: obj.orientation,
                header: obj.header,
                footer: obj.footer,
                type: obj.type,
                format: obj.format
            }).toStream(function(err, stream) {
                if (!err) stream.pipe(ws);
                else console.log(err);
            });
        }
    };
}());