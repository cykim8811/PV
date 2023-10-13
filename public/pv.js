
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
    

    const key = (config.key !== null && config.key !== undefined)? ('' + config.key) : null;
    const ref = config.ref;


    const props = {...config, children};
    const elem = {
        type,
        props,
        key,
        ref,
        state: null,
        _stateIndex: 0,
        children: [],
        _remaining: true
    };

    if (_context.length > 0) {
        const parent = _context[_context.length - 1];
        // Check if parent has child with key
        if (key !== null) {
            for (const childIndex in parent.children) {
                const child = parent.children[childIndex];
                console.log("Child key: ", child.key, ", key: ", key)
                if (child.key == key) {
                    child.props = props;
                    child.children = children;
                    // TODO: Call destructor on old child recursively
                    child._remaining = true;
                    return child;
                }
            }
        }
    }

    if (_context.length > 0) {
        const parent = _context[_context.length - 1];
        parent.children.push(elem);
    }
    return elem;
}
// TODO: Remove nodes whose key is null on re-render
function _render(node) {
    if (typeof node === 'string') {
        return document.createTextNode(node);
    }

    const type = node.type;
    const props = node.props;
    if (typeof type === 'function') {
        _context.push(node);
        node._stateIndex = 0;
        for (const child of node.children) {
            child._remaining = false;
        }
        const element = type(props);
        const rendered = _render(element);
        node.children = node.children.filter(child => child._remaining);
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
// For debugging
(function() {
    if ( typeof Object.id != "undefined" ) return;

    var id = 100000;

    Object.id = function(o) {
        if ( typeof o.__uniqueid != "undefined" ) {
            return o.__uniqueid;
        }

        Object.defineProperty(o, "__uniqueid", {
            value: ++id,
            enumerable: false,
            // This could go either way, depending on your 
            // interpretation of what an "id" is
            writable: false
        });

        return o.__uniqueid;
    };
})();

function useState(initialValue) {
    const context = _context[_context.length - 1];
    // console.log("[useState] useState called with unique context ID: ", Object.id(context));
    // console.log("[useState] State: ", context.state)
    // console.log("[useState] State index: ", context._stateIndex)
    if (!context.state) {
        context.state = [];
    }
    const stateIndex = context._stateIndex;
    if (context.state[stateIndex] === undefined) {
        context.state[stateIndex] = initialValue;
    }
    const setState = (newValue) => {
        context.state[stateIndex] = newValue;
        console.log(context);
        context.ref.replaceWith(_render(context)); // Testing
        console.log("[setState] setState called with unique context ID: ", Object.id(context), ", stateIndex: ", stateIndex, ", newValue: ", newValue);
    }
    context._stateIndex++;
    console.log("[useState] Returning state", context.state[stateIndex])
    return [context.state[stateIndex], setState];
}

function render(element, container) {
    console.log(element);
    container.appendChild(_render(element));
}
