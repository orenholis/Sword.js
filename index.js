/**class HelloWorld extends S {
	render() {
		this.el = this.createElement({
			textContent: 'Hello World!!!'
		});
		Will show error because this.el is not specified
	}
}*/

class Template extends Sword {
	render() {
		this.el = this.createElement({
			textContent: this.text,
			'on:click': () => {
				this.destroy()
			}
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


class Hello extends Sword {
	render() {
		this.el = this.createElement({
			nodeName: 'div',
			textContent: 'hahahha' + this.lol,
			'on:click': () => {
			//this.destroy()
			this.fire('rendered', {
				text: ' More text appeared.'
			})
		},
			children: [{
				textContent: 'lol'
			},{
				class: FFF,
				ref: '123'
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

class FFF extends Sword {
	render() {
		this.el = this.createElement({
			textContent: '123',
		});
	}
}

class x extends Sword {
	showEl() {
		this.setVisibleWithReference('click');
	}

	render() {
		this.el = this.createElement({
			nodeName: 'div',
			textContent: 'HAHHAHA',
			className: 'app',
			children: [{
				class: Hello,
				ref: 'hello1',
				lol: 'works',
			},{
				class: Hello,
				lol: 'haha',
				ref: 'hello2',
				'on:rendered': (obj, data) => {
					this.hello2.addMoText(data.text);
				}
			},{
				textContent: 'CLICK',
				ref: 'click',
				'on:click': () => {
					this.setVisibleWithReference(this['click'].style.display === 'none' ? 'click' : 'test')
				}
			},{
				class: XX,
			},{
				textContent: 'test',
				ref: 'test',
				'on:click': () => this.setVisibleWithReference(this['click'].style.display === 'none' ? 'click' : 'test')
			}],
			ref: 'hahha'
		}, this);
	}
}

new x(document.body);
