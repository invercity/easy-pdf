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
    // library
    module.exports = {
        // attributes section
        _id: 0,
        columns: [],
        names: [],
        defaultTmpl: 'h1 #{reportTitle}\n' +
                     'h2 #{reportDesc}',

        // methods section

        /**
         * init report structure
         * @param data
         */
        init: function(data) {
            this._id = data.id || shortid.generate();
            this.columns = data.columns;
            this.names = data.names;
            this.title = data.title || 'No name';
            this.desc = data.desc || 'No description';
        },
        /**
         * Get list of columns
         * @return {*}
         */
        getColumns: function() {
            return this.columns;
        },

        getData: function() {
            return this.title;
        },

        /**
         * Write result data to stream
         * @param stream (optional)
         */
        write: function(stream) {
            var ws = stream || fs.createWriteStream(this._id + '.pdf');
            var fn = jade.compile(this.defaultTmpl);
            var html = fn({
                reportTitle: this.title,
                reportDesc: this.desc
            });
            console.log(html);
        }
    };
}());