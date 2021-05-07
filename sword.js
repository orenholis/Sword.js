/** Sword is an framework with many utils for easier work enjoy :)
 *
 *
 *
 */
/**
 * Main component for rendering in framework Sword.js in S
 * You must extend from it
 * .... todo
 */
class S {
	/**
	 * Your main rendered element in component
	 */
	el;

	/**
	 * Every rendered child is saved into array for easy access and
	 * adding more.
	 */
	children = [];

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
	 *          }
	 *      }
	 *
	 *      class Initialization extends S {
	 *          render() {
	 *              this.el = this.createElement({
	 *                  textContent: 'Showing demo',
	 *                  children: [{
	 *                      class: HelloWorld,
	 *                      text: 'World'
	 *                  }]
	 *              })
	 *          }
	 *      }
	 *
	 * @param {function} conf.class     - Name of rendered class
	 *        {class}    conf.ref       -
	 *                   conf.*         - Name of any property you need to pass to class (Note it must be in same children as conf.class)
	 *
	 * @param {object} refs -
	 * @returns {HTMLDivElement|HTMLParagraphElement|HTMLHeadingElement|*}
	 */
	createElement(conf, refs) {
		const el = document.createElement(conf.nodeName || 'div');

		for (const key in conf) { //const [key, value] in Object.entries(conf)
			if (key === 'children' || key === 'nodeName' || conf[key] === undefined) {
				continue;
			}

			if (key === 'class') {
				const newClass = new conf[key](el, conf);
				if (conf.ref && refs) {
					refs[conf.ref] = newClass;
				}
				return newClass.el;
			}

			if ((/^on:/).exec(key)) {
				el.addEventListener(key.split('on:').join(''), conf[key]);
				continue;
			}

			if (key === 'className') {
				el.className = conf[key];
				continue;
			}

			if (key === 'invisible' && conf[key] === true) {
				el.style.display = 'none';
				continue;
			}

			if (key === 'textContent') {
				el.textContent = conf[key];
				continue;
			}

			el.setAttribute(key, conf[key]);
		}

		if (conf.ref && refs) {
			refs[conf.ref] = el;
		}

		if (conf.children) {
			conf.children.forEach(child => {
				const childRender = this.createElement(child, refs);
				el.appendChild(childRender);
				this.children.push(childRender);
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
	 * @param {HTMLElement} parent - place where component will be rendered
	 * @param {object} properties - any variables needed to pass to component in this
	 * @throws Error If this.el is missing in error is written possible solutions and class which don´t have this.el
	 */
	constructor(parent, properties) {
		if (properties) {
			for (const key in properties) {
				if (key === 'class') {
					continue;
				}

				if ((/^on:/).exec(key)) {
					continue;
				}

				this[key] = properties[key];
			}
		}

		//TODO comments
		if (S.prototype.beforeRender !== this.beforeRender) {
			this.beforeRender();
		}

		if (S.prototype.render === this.render) {
			throw new Error(
				'In ' + properties.class + ' is not defined this.render or this.beforeRender'
			);
		}

		this.render();

		if (!this.el) {
			throw new Error(
				'Main element is not specified. ' +
				'Try to check you have in your function this.render() this.el or ' +
				'change your extension from S to SData which don´t have this.el.' +
				'Error occurred in ' + properties.class + ' render.'
			);
		}

		this.renderWithParent(this.el, parent);

		//TODO comments
		if (S.prototype.afterRender !== this.afterRender) {
			this.afterRender();
		}
	}

	/**
	 * Fires an event with data if necessary
	 * @param {string} eventName - name of event
	 * @param {object} data - Any data which is necessary to pass with event to listener
	 */
	event(eventName, data) {
		const event = new CustomEvent(eventName, {
			bubbles: true,
			detail: data
		});
		this.el.dispatchEvent(event);
	}

	/**
	 * Renders child into your classes DOM
	 * @param child
	 */
	addChild(child) {
		const newChild = this.createElement(child);
		this.children.push(newChild);
		this.el.appendChild(newChild);
	} //TODO

	/**
	 * If this function is specified it is ran before render.
	 * Often used for defining properties for widgets.
	 */
	beforeRender() {} //TODO

	/**
	 * If this function is specified it is immediately ran after render.
	 */
	afterRender() {} //TODO
}
