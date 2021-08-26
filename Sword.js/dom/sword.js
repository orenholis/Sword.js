/** Sword.js is an framework for easier webapp development.
 * Sword.js is written in ES9 javascript standards.
 *
 * Sword - Works with DOM and every class with DOM extends from it {@link Sword}
 *
 * Created by Oren Holiš 2021
 */
/**
 * Main component for work with DOM.
 * You must extend from it and write into your function beforeRender/render.
 *
 * In render must be created this.el with this.createElement();
 * BeforeRender is used typically with widgets you extend from widget where is render.
 *
 * @example Simple class
 * 		class HelloWorld extends Sword {
 * 		 	render() {
 * 		 	  this.el = this.createElement({
 * 		 	  	textContent: 'Hello World'
 * 		 	  });
 * 		 	}
 * 		}
 *
 * @example Using widgets
 * 		class WidgetButton extends Sword {
 * 			text;
 * 			className;
 *
 * 		    render() {
 * 		        this.el = this.createElement({
 * 		            nodeName: 'div',
 * 		            className: 'button' + this.className,
 * 		            textContent: this.text
 * 		        });
 * 		    }
 * 		}
 *
 * 		class ButtonHelloWorld extends WidgetButton {
 * 		    beforeRender() {
 * 		        this.text = 'Hello World';
 * 		        this.className = 'hello-world';
 * 		    }
 * 		}
 *
 * @example References and class rendering
 * 		class HelloWorldButton extends Sword {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 		nodeName: 'button',
 * 			 		textContent: 'Say hello world'
 * 			 	});
 * 			}
 *
 * 			sayHelloWorld() {
 * 			 	alert('Hello World!!!');
 * 			}
 * 		}
 *
 * 		class HelloWorld extends Sword {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 	   children: [{
 * 			 	       textContent: 'Hello World',
 * 			 	   },{
 * 			 	       class: HelloWorldButton,
 * 			 	       ref: 'helloWorldButton',
 * 			 	       'on:click': () => this.helloWorldButton.sayHelloWorld()
 * 			 	   }]
 * 			 	});
 * 			}
 * 		}
 *
 * @example Events
 * 		class Cow extends Sword {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 	    'on:click': () => this.event('buuBuu')
 * 			 	});
 * 			}
 * 		}
 *
 * 		class Dog extends Sword {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 	 	'on:click: () => this.event('hafHaf')
 * 			 	});
 * 			}
 * 		}
 *
 * 		class Animal extends Sword {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 	    children: [{
 * 			 	        class: Cow,
 * 			 	        'on:buuBuu': () => alert('You have clicked cow')
 * 			 	    },{
 * 			 	        class: Dog,
 * 			 	        'on:hafHaf': () => alert('You have clicked dog')
 * 			 	    }]
 * 			 	});
 * 			}
 * 		}
 *
 *
 */
class Sword {
	/**
	 * Main rendered element in component.
	 * @type {HTMLElement}
	 */
	el;

	/**
	 * Every rendered child is saved into array for easier access.
	 * @type {array}
	 */
	children = [];

	/**
	 * Parent component of component.
	 * @type {Object}
	 */
	parentComponent = null;

	/**
	 * All events registered on class
	 * @type {object}
	 */
	events = {};

	/**
	 * Initialization of component.
	 *
	 * If in class which extends Sword is not specified constructor this constructor will be triggered.
	 * No one with high knowledge of working Sword.js is not recommended to change constructor.
	 *
	 * Constructor sets on class properties and render class.
	 *
	 * @param {HTMLElement} parent - place where component will be rendered
	 * @param {object} properties  - any variables needed to pass to component in this
	 * @param {object} parentComponent - parent class of class
	 *
	 * @throws Error if this.render and this.beforeRender are missing
	 * @throws Error If this.el is missing
	 * @throws Error If this.el is different type from HTMLElement|Object
	 * @throws Error If parent is not specified
	 */
	constructor(parent, properties, parentComponent) {
		this.parentComponent = parentComponent;
		this.applyClassConfig(properties);

		if (Sword.prototype.beforeRender !== this.beforeRender) {
			this.beforeRender();
		}

		if (Sword.prototype.render === this.render) {
			throw new Error(
				'In ' + new.target.name + ' is not defined this.render or this.beforeRender'
			);
		}

		this.render();

		if (!this.el) {
			throw new Error(
				'Main element is not specified. ' +
				'Try to check you have in your function this.render() this.el' +
				'Error occurred in ' + new.target.name + ' render.'
			);
		} else if (typeof this.el !== 'object') {
			throw new Error(
				'Main element is not object in class ' + new.target.name
			);
		}

		if (!parent) {
			throw new Error(
				'Parent is not specified in class ' + new.target.name + '.' +
				'It is often caused in the SW.start creating new starting class is not defined parent.'
			);
		}

		parent.appendChild(this.el);

		if (Sword.prototype.afterRender !== this.afterRender) {
			this.afterRender();
		}
	}

	/**
	 * This is function is automatically started in constructor and starts class.
	 * In this function must be declared this.el.
	 *
	 * @Override
	 */
	render() {}

	/**
	 * If this function is specified it is ran before render.
	 * Often used for defining properties for widgets.
	 *
	 * @Override
	 */
	beforeRender() {}

	/**
	 * If this function is specified it is immediately ran after render.
	 *
	 * @Override
	 */
	afterRender() {}

	/**
	 * Applies config on class.
	 *
	 * @param {object} conf - Initial configuration of class with listeners
	 */
	applyClassConfig(conf) {
		if (conf) {
			for (let [key, value] of Object.entries(conf)) {
				if (key === 'class' || key === 'ref') {
					continue;
				}

				if ((/^on/).exec(key) !== null) {
					this.on(key.slice(3), value, this, (/^on*:/).exec(key) !== null);
					continue;
				}

				this[key] = value;
			}
		}
	}

	/**
	 * Completely destroys component from her parent and all of her data.
	 */
	destroy() {
		this.parentComponent.removeChild(this.el);

		this.cleanThis();
	}

	/**
	 * Creates element with assigned configuration.
	 * Empty configuration creates div.
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
	 * @param {function} conf.'on:...'  - Adding addEventListener on element name of listener is specified after 'on:'
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
	 *        {class} conf.ref       	- Name of reference on class
	 *        {function} conf.'on:...'  - Registers event on class (name of listener is specified after 'on:')
	 *        {*} conf.*         		- Name of any property you need to pass to class (Note it must be in same children as conf.class)
	 *
	 * @param {object} refs - object where you want to store references (often it is this)
	 * @returns {HTMLDivElement} Rendered element
	 */
	createElement(conf, refs) {
		if (conf.render === false) {
			return;
		}

		const el = document.createElement(conf.nodeName || 'div');

		for (const [key, value] of Object.entries(conf)) {
			if (key === 'children' || key === 'nodeName' || key === 'ref' || value === undefined || value === null) {
				continue;
			}

			if (key === 'class') {
				const newClass = new value(el, conf, this);

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
				el.addEventListener(key.slice(3), value);
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
	 * Listen to events produced by this object.
	 *
	 * @param {String} name - Name of the event.
	 * @param {Function} fn - Event handler function.
	 * @param {Object} scope - Scope for the event handler
	 * @param {Boolean} captureBubbles - Listen for events on all child
	 * components in addition to this object's events.
	 * @return {Object} Event control object
	 */
	on(name, fn, scope, captureBubbles) {
		const l = {
			id: Object.keys(this.events[name] || {}).length,
			name: name,
			fn: fn,
			scope: scope,
			remove: function() {
				delete this.events[l.name][l.id];
				delete this.id;
			},
			captureBubbles: captureBubbles,
			fire: args => fn.apply(scope || this, args)
		};

		this.events[name] = this.events[name] || {};
		this.events[name][l.id] = l;

		return l;
	}

	/**
	 * Fire event.
	 *
	 * @param {String} name - Event name
	 * @param {*} args - Event arguments
	 */
	fire(name, ...args) {
		args.unshift(this);

		let target = this;
		while (target) {
			const listeners = target.events && target.events[name];
			if (listeners) {
				for (const val of Object.values(listeners)) {
					if (val.captureBubbles || target === this) {
						val.fire(args);
					}
				}
			}

			target = target.parentComponent;
		}
	}

	/**
	 * Renders child into your classes DOM.
	 *
	 * @param {object} childConf - same configuration as this.el as for {@link Sword#createElement}
	 * @param {object} refs - object where will be stored references
	 * @param {HTMLElement} parent - parent of childConf (default values is this.el)
	 */
	addChild(childConf, refs, parent) {
		const newChild = this.createElement(childConf, refs);
		if (newChild) {
			this.children.push(newChild);
			(parent || this.el).appendChild(newChild);
		}
	}

	/**
	 * Deletes child or child with reference.
	 *
	 * @param {string|HTMLElement|object} child - child or child's reference
	 */
	removeChild(child) {
		const el = this.getElement(child);

		if (typeof(child) === 'string') {
			if (this[child].el) {
				this[child].cleanThis();
			}
			delete this[child];
		}

		el?.remove();

		this.children.splice(this.children.indexOf(el), 1);
	}

	/**
	 * @private
	 * Cleans this when destroying component.
	 */
	cleanThis() {
		Object.keys(this).forEach(k => {
			k !== 'parentComponent' && this[k]?.cleanThis && !!this[k].cleanThis();
			delete this[k]
		});
	}

	/**
	 * Changes elements visibility.
	 *
	 * @param {HTMLElement|string|object} el - Element on which will be changed visibility
	 * @param {boolean|null} visible - Condition if element will be visible (not necessary,
	 * 		if visibility is not assigned its calculated on elements visibility)
	 */
	setVisible(el, visible) {
		el = this.getElement(el);
		visible = visible ?? el.style.display === 'none';
		el.style.display = visible ? 'block' : 'none';
	}

	/**
	 * Makes element visible with reference or el.
	 * Every other children will be hidden.
	 *
	 * @param {string|HTMLElement|object} child - Reference on element or element directly
	 */
	setVisibleWithReference(child) {
		const el = this.getElement(child);
		for (const child of this.children) {
			this.setVisible(child, el === child);
		}
	}

	/**
	 * Gets an element from class element.
	 *
	 * @param {string|HTMLElement|object} child - element or element's reference
	 * @returns {HTMLElement|null} Element
	 */
	getElement(child) {
		if (child?.el) {
			return child.el;
		}
		return typeof(child) === 'string' ? this.getElementWithReference(child) : child;
	}

	/**
	 * Get element with reference.
	 *
	 * @param {string|object} ref - Reference
	 * @returns {HTMLElement} Element from reference
	 */
	getElementWithReference(ref) {
		if (ref?.el) {
			return ref.el;
		} else if (this[ref].el) {
			return this[ref].el;
		} else {
			return this[ref];
		}
	}
}