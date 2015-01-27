'use strict';

/**
 * Module dependencies
 */

var calc = require('rework-calc');
var color = require('rework-color-function');
var conformance = require('rework-suit-conformance');
var customMedia = require('rework-custom-media');
var inherit = require('rework-inherit');
var inliner = require('rework-npm');
var limits = require('rework-ie-limits');
var remFallback = require('rework-rem-fallback');
var rework = require('rework');
var vars = require('rework-vars');

/**
 * Module exports
 */

module.exports = suit;

/**
 * Apply rework plugins to a rework instance; export as a rework plugin
 *
 * @param {String} ast Rework AST
 * @param {Object} reworkObj Rework instance
 */

function suit(options) {
  options = options || {};
  // for backwards compatibility with rework-npm < 1.0.0
  options.root = options.root || options.dir;
  // base font-size for rem fallback

  var remMultiplier = options.remMultiplier || 16;

  return function (ast, reworkObj) {
    reworkObj
      // inline imports
      .use(inliner({
        alias: options.alias,
        prefilter: function (css) {
          // per-file conformance checks
          return rework(css).use(conformance).toString();
        },
        root: options.root,
        shim: options.shim,
      }))
      // inherits
      .use(inherit())
      // check if the number of selectors exceeds the IE limit
      .use(limits)
      // custom media queries
      .use(customMedia)
      // variables
      .use(vars())
      // calc
      .use(calc)
      // color functions
      .use(color)
      // rem fallback
      .use(remFallback(remMultiplier));
  };
}
