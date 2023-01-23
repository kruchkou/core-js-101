/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */

function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const object = Object.create(proto);
  const jsonToObject = JSON.parse(json);
  Object.assign(object, jsonToObject);
  return object;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MySuperBaseElementSelector {
  constructor() {
    this.selector = '';
    this.combinator = '';
    this.isElement = false;
    this.isId = false;
    this.isClass = false;
    this.isAttr = false;
    this.isPseudoClass = false;
    this.isPseudoElement = false;
  }

  // eslint-disable-next-line class-methods-use-this
  throwOrderError() {
    throw new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
  }

  // eslint-disable-next-line class-methods-use-this
  throwMoreThenOneError() {
    throw new Error(
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    );
  }

  element(value) {
    if (this.isElement) this.throwMoreThenOneError();

    if (this.isId || this.isClass || this.isAttr
      || this.isPseudoClass || this.isPseudoElement) this.throwOrderError();

    this.selector += value;
    this.isElement = true;
    return this;
  }

  id(value) {
    if (this.isId) this.throwMoreThenOneError();

    if (this.isClass || this.isAttr || this.isPseudoClass
      || this.isPseudoElement) this.throwOrderError();

    this.selector += `#${value}`;
    this.isId = true;
    return this;
  }

  class(value) {
    if (this.isAttr || this.isPseudoClass || this.isPseudoElement) this.throwOrderError();
    this.selector += `.${value}`;
    this.isClass = true;
    return this;
  }

  attr(value) {
    if (this.isPseudoClass || this.isPseudoElement) this.throwOrderError();
    this.selector += `[${value}]`;
    this.isAttr = true;
    return this;
  }

  pseudoClass(value) {
    if (this.isPseudoElement) this.throwOrderError();
    this.selector += `:${value}`;
    this.isPseudoClass = true;
    return this;
  }

  pseudoElement(value) {
    if (this.isPseudoElement) this.throwMoreThenOneError();
    this.selector += `::${value}`;
    this.isPseudoElement = true;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combinator = combinator;
    this.selector = `${selector1.stringify()} ${this.combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.selector;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new MySuperBaseElementSelector().element(value);
  },

  id(value) {
    return new MySuperBaseElementSelector().id(value);
  },

  class(value) {
    return new MySuperBaseElementSelector().class(value);
  },

  attr(value) {
    return new MySuperBaseElementSelector().attr(value);
  },

  pseudoClass(value) {
    return new MySuperBaseElementSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MySuperBaseElementSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new MySuperBaseElementSelector().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
