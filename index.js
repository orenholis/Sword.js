/**class HelloWorld extends S {
	render() {
		this.el = this.createElement({
			textContent: 'Hello World!!!'
		});
		Will show error because this.el is not specified
	}
}*/

class Template extends S {
	render() {
		this.el = this.createElement({
			textContent: this.text
		});
	}
}

class XX extends Template {
	beforeRender() {
		this.text = 'HEllo';
	}

	afterRender() {
		alert('Hello');
	}
}


class Hello extends S {
	render() {
		this.el = this.createElement({
			nodeName: 'div',
			textContent: 'hahahha' + this.lol,
			'on:click': () => this.event('rendered', {
				screen: 'hello2',
				text: ' More text appeared.'
			}),
			children: [{
				textContent: 'lol'
			}]
		}, this);
	}

	addMoText(text) {
		this.el.textContent += text;
		this.addChild({
			textContent: 'New Child'
		});
	}
}

class x extends S {
	render() {
		this.el = this.createElement({
			nodeName: 'div',
			textContent: 'HAHHAHA',
			className: 'app',
			'on:rendered': (data) => this[data.detail.screen].addMoText(data.detail.text), //TODO chyba děti se renderují i po kliku na 1. Hello a renderují se do 2. Hello
			'on:clicked': () => alert('clicked'),
			children: [{
				class: Hello,
				lol: 'works'
			},{
				class: Hello,
				lol: 'haha',
				ref: 'hello2'
			},{
				textContent: 'CLICK',
				'on:click': () => this.event('clicked'),
				invisible: true
			},{
				class: XX
			}],
			ref: 'hahha'
		}, this);
	}
}

SW.start(() => {
	new x(document.body);
});