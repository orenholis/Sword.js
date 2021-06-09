/** Sword.js is an framework for easier webapp development.
 * Sword.js is written in ES9 javascript standards.
 * Sword.js is split into 4 main parts:
 *
 * S - Works with DOM and every class with DOM extends from it {@link S}
 * SData - Works with data class and helps with work with data {@link SData}
 * SW - Useful functions and main function SW.start which starts application {@link SW}
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
 * 		class HelloWorld extends S {
 * 		 	render() {
 * 		 	  this.el = this.createElement({
 * 		 	  	textContent: 'Hello World'
 * 		 	  });
 * 		 	}
 * 		}
 *
 * @example using widgets
 *
 * 		class WidgetButton extends S {
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
 * @example references and class rendering
 * 		class HelloWorldButton extends S {
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
 * 		class HelloWorld extends S {
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
 *
 *
 * @example events
 * 		class Cow extends S {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 	    'on:click': () => this.event('buuBuu')
 * 			 	});
 * 			}
 * 		}
 * 		class Dog extends S {
 * 			render() {
 * 			 	this.el = this.createElement({
 * 			 	 	'on:click: () => this.event('hafHaf')
 * 			 	});
 * 			}
 * 		}
 *
 * 		class Animal extends S {
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
	 *        {class}    conf.ref       - Name of reference on class
	 *        {function} conf.'on:...'  - Registers event on class (name of listener is specified after 'on:')
	 *        {*}          conf.*       - Name of any property you need to pass to class (Note it must be in same children as conf.class)
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
	 */
	constructor(parent, properties) {
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
	 * Deletes child or child with reference
	 *
	 * @param {string|HTMLElement} child - child or child's reference
	 */
	removeChild(child) {
		const el = typeof(child) === 'string' ? this.getElementWithReference(child) : child;
		for (let i = 0, child; i < this.children.length; i++) {
			child = this.children[i];
			if (child === el) {
				child.remove();
				this.children.splice(i, 1);
				if (typeof(child) === 'string') {
					delete this[child];
				}
				break;
			}
		}
	}

	/**
	 * Get element with reference
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
	 * Makes element visible with reference or el.
	 * Every other children will be hidden.
	 *
	 * @param {string|HTMLElement} child - Reference on element or element directly
	 */
	setVisibleWithReference(child) {
		const el = typeof(child) === 'string' ? this.getElementWithReference(child) : child;
		for (const child of this.children) {
			child.setVisible(el === child);
		}
	}

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
});

/**
 * Creates template for Data classes.
 * You must extend from it and this data class can be only used once in project.
 *
 * Implements listening on data class.
 *
 * @example
 *
 * 		class DataManager extends SData {
 * 		 	async login(formData) {
 *				const resp = await REST.POST('login', formData);
 * 		 		this.event('login');
 * 		 		return resp;
 * 		 	}
 * 		}
 *
 * 		class LoginScreen extends S {
 *			render() {
 *			 	this.el = this.createElement({
 *			 	    children: [{
 *			 	        nodeName: 'h1',
 *			 	        textContent: 'Login screen'
 *			 	    },{
 *			 	        nodeName: 'input',
 *			 	        placeholder: 'email',
 *			 	        ref: 'email'
 *			 	    },{
 *			 	        nodeName: 'input',
 *			 	        placeholder: 'password',
 *			 	        ref: 'password'
 *			 	    },{
 *			 	        nodeName: 'button',
 *			 	        textContent: 'Login',
 *			 	        'on:click': () => DataManager.login({
 *			 	        			email: this.email.value,
 *			 	        			password: this.password.value
 *			 	        		})
 *			 	    },{
 *			 	       ref: 'message'
 *			 	    }]
 *			 	}, this);
 *
 *			 	DataManager.registerOnEvent('login', () => {
 *			 		this.message.setTextContent = 'You have successfully logged in.';
 *			 	});
 *			}
 * 		}
 *
 * 		const DataManager =	new DataManager(); //this is important every data class must be initialized before main DOM component
 * 		const App =	new LoginScreen(document.body);
 */
class SData {
	/**
	 * All registered events
	 * @type {object}
	 */
	events = {};

	/**
	 * Registers new event with function on Data class
	 *
	 * @param {string} event - Name of event
	 * @param {function} fun - Function which will be registered on event
	 */
	registerOnEvent(event, fun) {
		if (this.events[event]) {
			this.events[event].push(fun);
			return;
		}
		this.events[event] = [fun];
	}

	/**
	 * Fires new event in component which triggers all registered event functions
	 *
	 * @param {string} event - Name of event
	 * @param {*} data - Any data needed to pass to functions
	 */
	event(event, data) {
		this.events[event].forEach(fun => {
			fun(data);
		});
	}
}

/**
 * In SW object are stored all functions which are available immediately
 */
const SW = {
	/**
	 * Starts whole application
	 * Note App must have this function if scripts are defined in header.
	 * If you have data classes {@link SData} you must declare them first.
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
	}
}