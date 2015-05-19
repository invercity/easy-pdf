/**
 *
 * Easy-pdf library
 * Make pdf reports, based on different source type
 *
 * Created by Andriy Ermolenko on 2/24/15.
 */

(function() {

    /**
     * Import deps
     */

    var fs = require('fs');
    var util = require('util');
    var pdf = require('html-pdf');
    var idGenerator = require('shortid');
    var jade  = require('jade');
    var path = require('path');
    var _ = require('underscore');

    /**
     * Defines
     */

    // path to template
    var DEFAULT_TPL = path.join(__dirname, './templates/main.jade');

    /**
     * Additional functions
     */

    /**
     * Make 2powX
     *
     * @param val
     * @return {number}
     */
    var bin = function (val) {
        return Math.pow(2, val);
    };

    /**
     * Parse style value to real params
     *
     * @param pos
     * @param width
     * @return {number}
     */
    var parseBorderWidth = function (pos, width) {
        var value = 0, wValue = width + "px";
        // check if NONE-border
        if (0 != pos % bin(4)) {
            var borders = [];
            // TOP, RIGHT, BOTTOM, LEFT
            for (var i = 0; i < 4; i++) borders[i] = (pos & bin(i)) ? wValue : 0;
            value = borders.join(' ');
        }
        return value;
    };

    /**
     * Replace object.style with real style
     * @param obj
     * @return {*}
     */
    var parseStyle = function (obj) {
       if (obj.style) {
            var style = obj.style;
            obj.style = {
                "font-family": style.fontFamily,
                "font-size": style.fontSize + "px",
                "font-weight": (style.mask & bin(4)) ? "bold" : "normal",
                "font-style": (style.mask & bin(5)) ? "italic" : "normal",
                "text-decoration": (((style.mask & bin(6)) ? "underline " : "") + ((style.mask & bin(7)) ? "line-through" : "")),
                "text-align": style.textAlign,
                "color": style.color,
                "background-color": style.backgroundColor,
                "border-style": style.borderStyle,
                "border-color": style.borderColor,
                "border-width": parseBorderWidth(style.mask, style.borderWidth)
            };
        }
        return obj;
    };

    /**
     * Main Library
     */

     module.exports = {
        // attributes section
        _id: 0,
        author: 'Default author',
        columns: [],
        names: [],
        records: [],
        border: '7mm',
        header: {
            height: '10mm'
        },
        footer: {
            height: '5mm'
        },
        options: {
            fontSize: '12px',
            columns: {
                style: {}
            },
            orientation: 'portrait',
            type: 'pdf',
            format: 'A4'
        },

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
            data.options.paging && (defaultFooterContent += paging);
            data.options.time && (defaultFooterContent += util.format(time, (new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString())));
            '' !== defaultFooterContent && (this.footer.contents = util.format(footerContent, defaultFooterContent));
            // set header height
            data.headerHeight && (this.header.height = data.headerHeight);
            // set footer height
            data.footerHeight && (this.footer.height = data.footerHeight);
            // set report data ([[]])
            data.records && (this.records = data.records);
            // set selected names of columns
            data.names && (this.names = _.map(data.names, parseStyle));
            // fix names if they were not selected by default
            data.names || (this.names = _.map(data.columns, function(el) {
                return {
                    name: el,
                    value: el
                }
            }));
            // set ALL list of columns
            data.columns && (this.columns = data.columns);
            // set report title
            data.title && (this.title = parseStyle(data.title));
            // set report description (optional parameter)
            data.desc && (this.description = data.desc);
            // set report mode
            data.options.mode && (this.options.orientation = data.options.mode);
            // set output format
            data.options.type && (this.options.type = data.options.type);
            // set font size
            data.options.fontSize && (this.options.fontSize = data.options.fontSize);
            // set columns style
            data.options.columns && (this.options.columns = data.options.columns);
            // return initialized
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
            var fileName = path.join(dist || '', name || this._id + '.' + this.options.type);
            var ws = fs.createWriteStream(fileName);
            var html = this.generateHTML();
            pdf.create(html, {
                border: obj.border,
                orientation: obj.options.orientation,
                header: obj.header,
                footer: obj.footer,
                type: obj.options.type,
                format: obj.options.format
            }).toStream(function(err, stream) {
                if (!err) stream.pipe(ws);
                else console.log(err);
            });
        }
    };
}());