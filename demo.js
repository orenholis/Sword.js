/**
 * Vykresluje tlačítko
 *
 * @fires @event click - při kliknutí
 * @class Widget.Button
 */
class WidgetButton extends S {
    /**
     * Text tlačítka
     * @type {string}
     */
    text;

    /**
     * CSS třída tlačítka (nad rámec základní třídy 'button')
     * @type {string}
     */
    className;

    render() {
        this.el = this.createElement({
            nodeName: 'button',
            className: 'button ' + (this.className || ''),
            ref: 'button',
            children: [{
                nodeName: 'span',
                className: 'icon'
            },{
                nodeName: 'span',
                className: 'text',
                textContent: this.text
            }],
        }, this);
    }
}

/**
 * Examples
 */

class HelloWorld extends S {
    render() {
        this.el = this.createElement({
            textContent: 'Hello World!!'
        });
    }
}

class HelloWorldChange extends S {
    render() {
        this.el = this.createElement({
            children: [{
                textContent: 'Hello World!!',
                ref: 'helloWorld'
            },{
                nodeName: 'input',
                placeholder: 'Fill your name',
                ref: 'input'
            },{
                nodeName: 'button',
                textContent: 'After filling your name press',
                'on:click': () => this.helloWorld.textContent = 'Hello ' + this.input.value
            }]
        }, this);
    }
}

class HelloWorldButton extends WidgetButton {
    beforeRender() {
        this.text = 'After filling your name press';
    }
}

class HelloWorld2 extends HelloWorld {
    afterRender() {
        this.addChild({
            textContent: 'Hello world 2!!'
        });
    }
}

/**
 * Code on page
 */

class DemoShowClassesResult extends S {
    render() {
        this.el = this.createElement();
    }

    showResult(className) {
        this.el.innerHTML = '';
        this.addChild({
            class: className
        });
    }
}

class DemoShowClasses extends S {
    render() {
        this.el = this.createElement();
    }

    setExample(example) {
        this.el.innerHTML = '';
        example.forEach(row => {
            this.addChild({
                textContent: row
            });
        });
    }
}

class DemoButtons extends WidgetButton {
    beforeRender() {
        this.text = 'Next example';
        this.className = 'startDemo';
    }
}

class DemoMain extends S {
    beforeRender() { //TODO change it you dont have to use beforeRender
        this.examples = [{
            title: 'creating class',
            classCode: [
                "class HelloWorld extends S {",
                "render() {",
                "this.el = this.createElement({",
                "textContent: 'Hello World!!'",
                "});",
                "}",
                "}",
            ],
            class: HelloWorld
        },{
            title: 'using references',
            classCode: [
                "class HelloWorldChange extends S {",
                "render() {",
                "this.el = this.createElement({",
                "children: [{",
                "textContent: 'Hello World!!',",
                "ref: 'helloWorld'",
                "},{",
                "nodeName: 'input',",
                "placeholder: 'Fill your name',",
                "ref: 'input'",
                "},{",
                "nodeName: 'button',",
                "textContent: 'After filling your name press',",
                "'on:click': () => this.helloWorld.textContent = 'Hello ' + this.input.value",
                "}]",
                "}, this);",
                "}",
                "}"
            ],
            class: HelloWorldChange
        },{
            title: 'creating predefined values for widgets',
            classCode: [
                "class WidgetButton extends S {",
                "text;",
                "",
                "className;",
                "",
                "render() {",
                "this.el = this.createElement({",
                "nodeName: 'button',",
                "className: 'button ' + (this.className || ''),",
                "ref: 'button',",
                "children: [{",
                "nodeName: 'span',",
                "className: 'icon'",
                "},{",
                "nodeName: 'span',",
                "className: 'text',",
                "textContent: this.text",
                "}],",
                "}, this);",
                "}",
                "}",
                "",
                "class HelloWorldButton extends WidgetButton {",
                "beforeRender() {",
                "this.text = 'After filling your name press';",
                "}",
                "}"
            ],
            class: HelloWorldButton
        },{
            title: 'adding children',
            classCode: [
                "class HelloWorld2 extends HelloWorld {",
                "afterRender() {",
                "this.addChild({",
                "textContent: 'Hello world 2!!'",
                "});",
                "}",
                "}"
            ],
            class: HelloWorld2
        }];

        this.exampleNumber = 0;
    }

    render() {
        this.singleton = true;
        this.el = this.createElement({
            children: [{
                nodeName: 'h1',
                textContent: 'Welcome at Sword.js Demo',
                className: 'title'
            },{
               textContent: 'This is small demo showing Sword.js functionality and working.'
            },{
                ref: 'exampleTitle'
            },{
                className: 'example-code-boxes',
                children: [{
                    class: DemoShowClasses,
                    ref: 'showExampleClassCode'
                },{
                    class: DemoShowClassesResult,
                    ref: 'showExampleClassResult'
                }]
            },{
                class: DemoButtons,
                'on:click': () => this.nextExample()
            }]
        }, this);
    }

    afterRender() {
        this.nextExample();
    }

    nextExample() {
        if (this.exampleNumber === this.examples.length) {
            this.el.innerHTML = 'Congratulation you have successfully completed demo!!!';
        }
        const example = this.examples[this.exampleNumber];
        this.exampleTitle.textContent = 'Example showing ' + example.title;
        this.showExampleClassCode.setExample(example.classCode);
        this.showExampleClassResult.showResult(example.class);
        this.exampleNumber++;
    }
}

SW.start(() => {
    new DemoMain(document.body);
});