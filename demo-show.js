class Footer extends S {
	render() {
		this.el = this.createElement({
			//TODO
		});
	}
}

class InteractiveShowingPanel extends S {
	render() {
		this.el = this.createElement({
			children: [{
				nodeName: 'p',
				textContent: 'This small demo shows how to use and what Sword.js can do.'
			},{

			}]
		})
	}

	swapChildren() {

	}
}

class DemoMain extends S {
	render() {
		this.el = this.createElement({
			children: [{
				nodeName: 'h1',
				textContent: 'Welcome at Sword.js framework web'
			},{
				class: InteractiveShowingPanel
			}]
		});
	}
}

/*SW.start(() => {
	new DemoMain(document.body);
});*/