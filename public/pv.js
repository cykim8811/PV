
const _imports = {};

function require(name){
    if (_imports[name]) {
        return _imports[name];
    }
    else {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'templates/' + name + '.js', false);
        xhr.send();
        const module = {exports: {}};
        let exports = module.exports;
        eval(xhr.responseText);
        _imports[name] = exports;
        return exports;
    }
}


const _context = [];

function createElement(type, config, ...children) {
    if (config == null) config = {};

    if (children.length === 1 && Array.isArray(children[0])) {
        children = children[0];
    }

    const key = config.key;
    const ref = config.ref;


    if (_context.length > 0) {
        const parent = _context[_context.length - 1];
        if (key !== null) {
            for (const child of parent.children) {
                if (child.key === key) {
                    return child;
                }
            }
        }
    }

    const props = {...config, children};
    const elem = {
        type,
        props,
        key: config.key? '' + config.key : null,
        ref: config.ref || null,
        state: null,
        _stateIndex: 0,
        children: []
    };

    if (_context.length > 0) {
        const parent = _context[_context.length - 1];
        parent.children.push(elem);
    }

    return elem;
}

function _render(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    const type = node.type;
    const props = node.props;

    if (typeof type === 'function') {
        _context.push(node);
        node._stateIndex = 0;
        const element = type(props);
        const rendered = _render(element);
        _context.pop();
        node.ref = element.ref;
        return rendered;
    } else {
        const element = document.createElement(type);
        node.ref = element;
        for (const [key, value] of Object.entries(props)) {
            if (key === 'children') {
                for (const child of value) {
                    element.appendChild(_render(child));
                }
            } else if (key === 'className') {
                element.setAttribute('class', value);
            } else if (key === 'style') {
                for (const [k, v] of Object.entries(value)) {
                    element.style[k] = v;
                }
            } else if (key.startsWith('on')) {
                const eventName = key.substring(2).toLowerCase();
                element.addEventListener(eventName, value);
            } else {
                element.setAttribute(key, value);
            }
        }
        return element;
    }
    
}

function useState(initialValue) {
    const context = _context[_context.length - 1];
    if (!context.state) {
        context.state = [];
    }
    const stateIndex = context._stateIndex;
    if (context.state[stateIndex] === undefined) {
        context.state[stateIndex] = initialValue;
    }
    const setState = (newValue) => {
        context.state[stateIndex] = newValue;
        context.ref.replaceWith(_render(context)); // Testing
        console.log(context.ref);
    }
    context._stateIndex++;
    return [context.state[stateIndex], setState];
}

function render(element, container) {
    console.log(element);
    container.appendChild(_render(element));
}
