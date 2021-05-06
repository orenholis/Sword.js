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

		for (const key in conf) {
			if (key === 'children' || key === 'nodeName' || conf[key] === undefined || !key.hasOwnProperty()) {
				continue;
			}

			if (key === 'class') {
				console.log(typeof conf[key]);
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
				console.log(child);
				const childRender = this.createElement(child, refs);
				el.appendChild(childRender);
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
}

/**
 * Zajímavé nápady
 */
class XXName {
	/**visibility(el, visibility) {
		el.style.disply = visibility ? '' : null;
	}, //TODO ? needed ???*/

	/**css(el, conf) {
		if (!conf) {
			return;
		}

		for (let s in conf) {
			el.style[s] = conf[s];
		}
	},*/
}

const SW = {
	/**
	 * Starts whole application //TODO popis
	 * @param fun
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
	 */
	getUrlToken: (tokenName) => {
		const urlParams = new URLSearchParams(document.location.search.substring(1));
		return urlParams.get(tokenName);
	},

	/**
	 * Čte položku z localStorage.
	 *
	 * Položka je automaticky konvertovaná pomocí JSON.parse().
	 *
	 * @param {string} key - Klíč v localStorage
	 * @param {*} defaultValue - Výchozí hodnota pro případ, že zadaný klíč v localStorage zatím neexistuje
	 * @return {*} Načtená nebo výchozí hodnota
	 */
	getLocalStorageItem(key, defaultValue) {
		const item = localStorage.getItem(key);
		return item != null ? JSON.parse(item) : defaultValue;
	},

	/**
	 * Saves
	 * //TODO popis
	 * @param key
	 * @param data
	 */
	setLocalStorageItem(key, data) {
		localStorage.setItem(
			key,
			JSON.stringify(data)
		);
	},

	/**
	 * Object for math calculations and functions
	 */
	Math: {}
};


Object.assign(SW.Math, {
	randomNumber(multiplier) {
		return Math.floor(Math.random() * multiplier);
	},

	randomArrayItem(array) {
		const randomIndex = S.randomNumber(array.length);
		return array[randomIndex];
	},

	/**
	 * Vypočítává procento
	 *
	 * @param {int} numerator - Čitatel
	 * @param {int} denominator - Jmenovatel
	 * @return {int} Zlomek čitatel/jmenovatel vyjádřený jako procento
	 */
	calculatePercentage(numerator, denominator) {
		return Math.floor(100 * numerator / denominator) || 0;
	}
});

/**
 * Merge 2 array with objects based on their id
 * @param array1
 * @param array2
 * @return {*}
 */
SW.mergeArrayObjectsById = (array1, array2) => {
	array1 = array1.map(item => {
		const word = array2.find(word => word.id === item.id);
		return {...item, ...word};
	});
	return array1;
};

SW.validateEmail = (email) => {
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
