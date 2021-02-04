/**
 *
 * Easy-pdf library
 * Make pdf reports, based on different source type
 *
 * Created by Andrii Yermolenko on 2/24/15.
 */

/**
 * Import dependencies
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const idGenerator = require('shortid');
const pug  = require('pug');
const _ = require('underscore');

/**
 * Defines
 */

  // path to template
const DEFAULT_TPL = path.join(__dirname, './templates/main.pug');

/**
 * Additional functions
 */

/**
 * Make 2powX
 *
 * @param val
 * @return {number}
 */
const bin = (val) => Math.pow(2, val);

/**
 * Exclude borders with 'none-border
 *
 * @param mask
 * @return {{}}
 */
const checkBorder = (mask) => {
  const borders = ['border-top','border-right', 'border-bottom', 'border-left'];
  const res = {};
  for (let i = 0; i < 4; i++) {
    if (!(mask & bin(i))) {
      res[borders[i]] = 'none';
    }
  }
  return res;
};

/**
 * Replace object.style with real style
 * @param obj
 * @return {*}
 */
const parseStyle = (obj) => {
  const clone = _.clone(obj);
  if (obj.style) {
    const style = obj.style;
    clone.style = {
      'font-family': style.fontFamily,
      'font-size': style.fontSize + 'px',
      'font-weight': (style.mask & bin(4)) ? 'bold' : 'normal',
      'font-style': (style.mask & bin(5)) ? 'italic' : 'normal',
      'text-decoration': (((style.mask & bin(6)) ? 'underline ' : '') + ((style.mask & bin(7)) ? 'line-through' : '')),
      'text-align': style.textAlign,
      'color': style.color,
      'background-color': style.backgroundColor,
      'border': [style.borderWidth + 'px', style.borderStyle, style.borderColor].join(' '),
      'padding': style.padding.join('px ') + 'px'
    };
    _.extend(clone.style, checkBorder(style.mask));
  }
  // init style if null
  clone.style || (clone.style = {});
  return clone;
};

/**
 * Main Library
 */

class Reporter {
  constructor() {
    // attributes section
    this._id = 0;
    this.author = 'Default author';
    this.columns = [];
    this.names = [];
    this.records = [];
    this.border = '7mm';
    this.header = {
      height: '10mm'
    };
    this.footer = {
      height: '5mm'
    };
    this.options = {
      fontSize: '12px',
      columns: {
        style: {}
      },
      orientation: 'portrait',
      types: ['pdf'],
      format: 'Letter'
    };
  }

  /**
   * init report structure
   * @param data
   */
  init(data) {
    // static data
    const headerContent = '<div style="text-align: center;">Author: %s</div>';
    const footerContent = '<div style="font-size: 12px">%s</div>';
    // default paging and time templates
    const paging = '<div style="float: right"><span>page {{page}}</span>of <span>{{pages}}</span></div> ';
    const time = '<span style="float: left;"> %s </span>';
    let defaultFooterContent = '';
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
    data.options.types && (this.options.types = data.options.types);
    // set font size
    data.options.fontSize && (this.options.fontSize = data.options.fontSize);
    // set columns style
    data.options.columns && (this.options.columns = parseStyle(data.options.columns));
    // init file extension adaptors
    this.initAdaptors();
    // return initialized
    return this;
  };

  initAdaptors() {
    this.types = [];
    const adaptors = fs.readdirSync(path.join(__dirname, 'ext'));

    adaptors.map((el) => {
      const p = path.resolve(__dirname, 'ext', el);
      const modulePath = '.' + path.sep + path.relative(__dirname, p).replace('.js', '');
      const module = require(modulePath);
      if (module.types && module.types.length > 0) {
        module.types.forEach(type => {
          this.types.push({
            name: type,
            module
          });
        });
      }
    });
  };

  /**
   * Get list of columns
   * @return {*}
   */
  getColumns() {
    return this.columns;
  };

  /**
   * Get title
   * @return {string}
   */
  getTitle() {
    return this.title;
  };

  /**
   * Generate HTML from data
   * @param {object } options - additional options
   * @return {*}
   */
  generateHTML(options) {
    const object = _.extend(this, options);
    return pug.compileFile(DEFAULT_TPL, object);
  };

  /**
   * Generate HTML without Doctype
   * @return {string}
   */
  generateInnerHTML() {
    return this.generateHTML({ excludeLayout: true });
  };

  /**
   * Get adaptor for selected type
   * @param {string} name
   * @return {object}
   */
  getAdaptor(name) {
    const o = this.types.find(type => type.name === name);
    if (o) {
      return o.module;
    }
    return null;
  };

  /**
   * Write result data to file
   * @param [dist] {string}
   * @param [name] {string}
   * @return {object[]}
   */
  write(dist = '', name) {
    const html = this.generateHTML();
    // fix if not array
    const types = Array.isArray(this.types) ? this.types : [this.types];
    return types.map((t) => {
      const fileName = path.join(dist, name || this._id + '.' + t.name);
      const module = this.getAdaptor(t.name);
      if (!module) {
        throw 'Unsupported output type';
      }
      else {
        const options = _.extend(this, {
          type: t
        });
        module.generate(html, options, fileName);
      }
      return {
        name: this._id,
        type: t
      };
    });
  };

  /**
   * Generate all supported reports
   * @param {string} [dist]
   * @param {string} [name]
   * @returns {object[]}
   */
  writeAll(dist, name) {
    this.options.types = this.types.map((t) => t.name);
    return this.write(dist, name);
  };
}

module.exports = new Reporter();
