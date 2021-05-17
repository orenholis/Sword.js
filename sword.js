/** Sword.js is an framework for easier work with DOM:
 * Sword.js is split into 3 main parts:
 *
 * S - Works with DOM and every class with DOM extends from it
 * SW - Useful functions and main function SW.start which starts application
 * SMath - Math functions like random number or random element from array
 *
 * Created by Oren Holiš 2021
 */
/**
 * Main component for rendering in framework Sword.js in S
 * You must extend from it
 * .... todo
 */
class S {
	/**
	 * Your main rendered element in component.
	 * @type {HTMLElement}
	 */
	el;

	/**
	 * Every rendered child is saved into array for easier access.
	 * @type {array}
	 */
	children = [];

	/**
	 * Events registered on main element.
	 * @type {object}
	 */
	elEvents = {};

	/**
	 * If singleton is set to true class is available globally and can be used only once
	 * @type {boolean}
	 */
	singleton = false;

	/**
	 * Creates element with assigned configuration
	 *
	 * @example
	 *      this.createElement({
	 *         textContent: 'Hello world!!',
	 *         className: 'hello-world',
	 *         children: [{
	 *             nodeName: 'p',
	 *             textContent: 'This is example of this.createElement',
	 *             'on:click': () => alert('Hello World'),
	 *             ref: 'example'
	 *         },{
	 *             class: HelloWorld
	 *             data: 'Welcome user'
	 *         }]
	 *      });
	 *
	 * Configuration for any element except of classes
	 *
	 * @param {object} conf             - configuration of element
	 * @param {string} conf.nodeName    - Node name of element (if nodeName is empty default is div)
	 * @param {[{}]} conf.children      - Children elements with configuration (They are array of objects)
	 * @param {string} conf.'on:...'    - Adding addEventListener on element name of listener is specified after 'on:'
	 * @param {string} conf.className   - Sets className on element
	 * @param {boolean} conf.invisible  - If it is true sets element invisible
	 * @param {string} conf.ref         - Sets reference on element so you can directly point on it with this
	 * @param {boolean} conf.render     - Determines if element will be rendered
	 * @param {string} conf.*           - Any other configuration properties will be passed as attribute
	 *
	 * Configuration for classes.
	 * In example you can see passing variable text to class HelloWorld.
	 *
	 * @example
	 *      class HelloWorld extends S {
	 *          render() {
	 *              this.el = this.createElement({
	 *                  textContent: 'Hello ' + this.text
	 *              });
	 *          },
	 *
	 *          deleteText() {
	 *              this.el.textContent = '';
	 *          }
	 *      }
	 *
	 *      class Initialization extends S {
	 *          render() {
	 *              this.el = this.createElement({
	 *                  textContent: 'Showing demo',
	 *                  children: [{
	 *                      class: HelloWorld,
	 *                      text: 'World',
	 *                      ref: 'helloWorld'
	 *                  }]
	 *              })
	 *
	 *              // using reference from render to access function on HelloWorld class
	 *              this.helloWorld.deleteText();
	 *          }
	 *      }
	 *
	 * @param {function} conf.class     - Name of rendered class
	 *        {class}    conf.ref       - Name of reference on class
	 *                   conf.*         - Name of any property you need to pass to class (Note it must be in same children as conf.class)
	 *
	 * @param {object} refs - object where you want to store references (often it is this)
	 * @returns {HTMLDivElement} Rendered element
	 */
	createElement(conf, refs) {
		if (conf === undefined) {
			return document.createElement('div');
		}

		if (conf.render === false) {
			return;
		}

		const el = document.createElement(conf.nodeName || 'div');

		for (const [key, value] of Object.entries(conf)) {
			if (key === 'children' || key === 'nodeName' || key === 'ref' || value === undefined || value === null) {
				continue;
			}

			if (key === 'class') {
				const newClass = new value(el, conf);
				if (conf.ref && refs) {
					refs[conf.ref] = newClass;
				}
				return newClass.el;
			}

			if (key === 'textContent') {
				el.textContent = value;
				continue;
			}

			if (key === 'className') {
				el.className = value;
				continue;
			}

			if ((/^on:/).exec(key)) {
				el.addEventListener(key.split('on:').join(''), value);
				continue;
			}

			if (key === 'invisible' && value === true) {
				el.style.display = 'none';
				continue;
			}

			el.setAttribute(key, value);
		}

		if (conf.ref && refs) {
			refs[conf.ref] = el;
		}

		if (conf.children) {
			conf.children.forEach(child => {
				this.addChild(child, refs, el);
			});
		}

		return el;
	}

	/**
	 * This renders element with parent which is automatically used in constructor after render.
	 * But you can use it if you need but don´t touch with it children of another classes.
	 *
	 * @param {HTMLElement} el - Element which will be displayed in page
	 * @param {HTMLElement} parent - Parent of el
	 */
	renderWithParent(el, parent) {
		parent.appendChild(el);
	}

	/**
	 * This is function is automatically started in constructor and starts class.
	 * Overwrite this function with your own.
	 * In this function must be declared this.el.
	 *
	 * @Override
	 */
	render() {}

	/**
	 * Initialization of component with constructor
	 *
	 * If in class which extends S is not specified constructor this constructor will be triggered.
	 * No one with high knowledge of working Sword.js is not recommended to change constructor.
	 *
	 * Constructor sets on class properties and render class.
	 *
	 * @param {HTMLElement} parent - place where component will be rendered
	 * @param {object} properties - any variables needed to pass to component in this
	 * @throws Error if this.render and this.beforeRender are missing
	 * @throws Error If this.el is missing
	 * @throws Error If this.el is different type from HTMLElement|Object
	 * @throws Error If parent is not specified
	 * @throws Error If class which is singleton is created second time
	 */
	constructor(parent, properties) {
		if (globalThis[this.constructor.name + 'G'] !== undefined) {
			throw new Error('This class is singleton you can not create it twice');
		}

		if (properties) {
			for (let [key, value] of Object.entries(properties)) {
				if (key === 'class') {
					continue;
				}

				if ((/^on:/).exec(key)) {
					this.elEvents[key] = value;
					continue;
				}

				this[key] = value;
			}
		}

		if (S.prototype.beforeRender !== this.beforeRender) {
			this.beforeRender();
		}

		if (S.prototype.render === this.render) {
			throw new Error(
				'In ' + this.constructor.name + ' is not defined this.render or this.beforeRender'
			);
		}

		this.render();

		if (!this.el) {
			throw new Error(
				'Main element is not specified. ' +
				'Try to check you have in your function this.render() this.el or ' +
				'change your extension from S to SData which don´t have this.el.' +
				'Error occurred in ' + this.constructor.name + ' render.'
			);
		} else if (typeof this.el !== 'object') {
			throw new Error(
				'Main element is not object in class ' + this.constructor.name
			);
		}

		if (!parent) {
			throw new Error(
				'Parent is not specified in class ' + this.constructor.name + '.' +
				'It is often caused in the SW.start creating new starting class is not defined parent.'
			);
		}

		this.renderWithParent(this.el, parent);

		if (properties) {
			for (const [key, value] of Object.entries(this.elEvents)) {
				this.el.addEventListener(key.split('on:').join(''), value);
			}
		}

		if (S.prototype.afterRender !== this.afterRender) {
			this.afterRender();
		}

		if (this.singleton) {
			globalThis[this.constructor.name + 'G'] = this;
		}
	}

	/**
	 * Fires an event with data
	 *
	 * @param {string} eventName - name of event
	 * @param {object} data - Any data which is necessary to pass with event to listener
	 */
	event(eventName, data) {
		if (this.elEvents['on:' + eventName]) {
			this.elEvents['on:' + eventName](data);
			return;
		}
		const event = new CustomEvent(eventName, {
			bubbles: true,
			detail: data
		});
		this.el.dispatchEvent(event);
	}

	/**
	 * Renders child into your classes DOM
	 *
	 * @param {object} childConf - same configuration as this.el as for {@link S#createElement}
	 * @param {object} refs - object where will be stored references
	 * @param {HTMLElement} parent - parent of childConf
	 */
	addChild(childConf, refs, parent) {
		const newChild = this.createElement(childConf, refs);
		if (newChild) {
			this.children.push(newChild);
			(parent || this.el).appendChild(newChild);
		}
	}

	/**
	 * Deletes child with reference
	 *
	 * @param {string|HTMLElement} childRef - child or child's reference
	 */
	removeChild(childRef) {
		const el = typeof(childRef) === 'string' ? this.getElementWithReference(childRef) : childRef;
		for (let i = 0, child; i < this.children.length; i++) {
			child = this.children[i];
			if (child === el) {
				child.remove();
				this.children.splice(i, 1);
				if (typeof(childRef) === 'string') {
					delete this[childRef];
				}
				break;
			}
		}
	}

	/**
	 * Get element threw reference
	 *
	 * @param {string} ref - reference
	 * @returns {HTMLElement} Element from reference
	 */
	getElementWithReference(ref) {
		if (this[ref].el) {
			return this[ref].el;
		} else {
			return this[ref];
		}
	}

	/**
	 * Makes element visible with reference or el
	 *
	 * @param {string|HTMLElement} ref - Reference on element or element directly
	 */
	setVisibleWithReference(ref) {
		const el = typeof(ref) === 'string' ? this.getElementWithReference(ref) : ref;
		for (const child of this.children) {
			child.setVisible(el === child);
		}
	}

	/**
	 * If this function is specified it is ran before render.
	 * Often used for defining properties for widgets.
	 */
	beforeRender() {}

	/**
	 * If this function is specified it is immediately ran after render.
	 */
	afterRender() {}
}

Object.assign(Element.prototype, {
	/**
	 * Sets element visibility
	 *
	 * @param {boolean} visible - condition if element will be visible
	 */
	setVisible(visible) {
		this.style.display = visible ? 'block' : 'none';
	}
})

/**
 * In SW object are stored all functions which are available immediately
 */
const SW = {
	/**
	 * Starts whole application
	 * Note App must have this function if scripts are defined in header
	 *
	 * @param {function} fun - Function
	 */
	start: (fun) => {
		if (document.readyState === 'loading') {
			document.addEventListener("DOMContentLoaded", () => {
				fun();
			});
		} else {
			fun();
		}
	},

	/**
	 * Gets and returns token from url in format
	 * url?{tokenName}={token}
	 *
	 * @param {string} tokenName - Name of wanted token
	 * @return {string} Token
	 */
	getUrlToken: (tokenName) => {
		const urlParams = new URLSearchParams(document.location.search.substring(1));
		return urlParams.get(tokenName);
	},

	/**
	 * Reads item from localStorage
	 * Item is automatically converted with JSON.parse();
	 *
	 * @param {string} key - Key in localStorage
	 * @param {*} defaultValue - Default value in case that assigned key is not in localStorage
	 * @return {*} Value from localStorage or default value
	 */
	getLocalStorageItem(key, defaultValue) {
		const item = localStorage.getItem(key);
		return item != null ? JSON.parse(item) : defaultValue;
	},

	/**
	 * Saves item to localStorage
	 *
	 * @param {string} key - LocalStorage key
	 * @param {*} data - Any data needed to store in localStorage
	 */
	setLocalStorageItem(key, data) {
		localStorage.setItem(
			key,
			JSON.stringify(data)
		);
	},

	/**
	 * TODO popis
	 * @param email
	 * @returns {string|boolean}
	 */
	validateEmail(email) {
		if (!email.contains('@')) {
			return 'Email is now valid';
		}

		const emailSplit = email.split('@'); //TODO change to regular expression

		if (emailSplit[0].length === 0) {
			return 'Email length before @ cannot be 0';
		}

		if (emailSplit[2].length === 0) {
			return 'Email length after @ cannot be 0';
		}

		if (!emailSplit[2].contains('.')) {
			return 'Email without suffix does not exist';
		}

		return true;
	}
}


/**
 * Object for math calculations and functions
 */
const SMath = {
	/**
	 * Generates new random number
	 *
	 * @param {number} multiplier - Number which will be used for multiplication
	 * @returns {number} - New random number
	 */
	randomNumber(multiplier) {
		return Math.floor(Math.random() * multiplier);
	},

	/**
	 *
	 * Pick random element from array
	 *
	 * @param {array} array - Array on which will be picked random element
	 * @returns {*} Random element from array
	 */
	randomArrayItem(array) {
		const randomIndex = SMath.randomNumber(array.length);
		return array[randomIndex];
	},

	/**
	 * Calculates percent
	 *
	 * @param {int} numerator - Numerator
	 * @param {int} denominator - Denominator
	 * @return {int} Percent from Numerator and denominator
	 */
	calculatePercentage(numerator, denominator) {
		return Math.floor(100 * numerator / denominator) || 0;
	}
}