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
	showEl() {
		this.setVisibleWithReference('click');
	}

	render() {
		this.singleton = true;
		this.el = this.createElement({
			nodeName: 'div',
			textContent: 'HAHHAHA',
			className: 'app',
			'on:clicked': () => {
				this.setVisibleWithReference(this['click'].style.display === 'none' ? 'click' : 'test');
				//this.deleteAllChildren();
			},
			children: [{
				class: Hello,
				lol: 'works',
			},{
				class: Hello,
				lol: 'haha',
				ref: 'hello2',
				'on:rendered': data => {
					this.removeChild('click');
					this[data.screen].addMoText(data.text);
				}
			},{
				textContent: 'CLICK',
				ref: 'click',
				'on:click': () => this.event('clicked'),
			},{
				class: XX,
			},{
				textContent: 'test',
				ref: 'test',
				'on:click': () => this.event('clicked')
			}],
			ref: 'hahha'
		}, this);
	}
}

SW.start(() => {
	new x(document.body);
});
