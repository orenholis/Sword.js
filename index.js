class HelloWorld extends S {
	render() {
		this.el = this.createElement({
			textContent: 'Hello World!!!'
		});
		/**Will show error because this.el is not specified*/
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
			})
		}, this);
	}

	addMoText(text) {
		this.el.textContent += text;
	}
}

class x extends S {
	render() {
		this.el = this.createElement({
			nodeName: 'div',
			textContent: 'HAHHAHA',
			className: 'app',
			'on:rendered': (data) => this[data.detail.screen].addMoText(data.detail.text),
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
				class: HelloWorld
			}],
			ref: 'hahha'
		}, this);
	}
}

SW.start(() => {
	new x(document.body);
});