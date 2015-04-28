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
    var util = require('util');
    var pdf = require('html-pdf');
    var idGenerator = require('shortid');
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
        fontSize: '12px',
        records: [],
        orientation: 'portrait',
        border: '7mm',
        header: {
            height: '10mm'
        },
        footer: {
            height: '5mm'
        },
        type: 'pdf',
        format: 'A4',

        /**
         * init report structure
         * @param data
         */
        init: function(data) {
            // static data
            var headerContent = '<div style="text-align: center;">Author: %s</div>';
            var footerContent = '<div style="font-size: 12px">%s</div>';
            // default paging and time templates
            var paging = '<span>page {{page}}</span>of <span>{{pages}}</span>';
            var time = '<span style="float: right;"> %s </span>';
            var defaultFooterContent = '';
            // set doc id (fileName)
            this._id = data.fileName || idGenerator.generate();
            // set footer data (author)
            data.author && (this.header.contents = util.format(headerContent, data.author));
            // set header data
            data.paging && (defaultFooterContent += paging);
            data.time && (defaultFooterContent += util.format(time, (new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString())));
            '' !== defaultFooterContent && (this.footer.contents = util.format(footerContent, defaultFooterContent));
            // set header height
            data.headerHeight && (this.header.height = data.headerHeight);
            // set footer height
            data.footerHeight && (this.footer.height = data.footerHeight);
            // set report data ([[]])
            data.records && (this.records = data.records);
            // set selected names of columns
            data.names && (this.names = data.names);
            // fix names if they were not selected by default
            data.names || (this.names = _.map(data.columns, function(el) {
                return {
                    name: el,
                    title: el
                }
            }));
            // set ALL list of columns
            data.columns && (this.columns = data.columns);
            // set report title
            data.title && (this.title = data.title);
            // set report description (optional parameter)
            data.desc && (this.description = data.desc);
            // set global document font size
            data.fontSize && (this.fontSize = data.fontSize);
            // set report mode
            data.mode && (this.orientation = data.mode);
            // set output format
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
        },

        /**
         * Express middleware for handling easy-pdf styles
         * @return {Function}
         */
        style: function() {
            return function(req, res, next) {
                if ('/report-style.css' == req.url) res.send(__dirname + 'templates/style.css');
                else next();
            }
        }
    };
}());