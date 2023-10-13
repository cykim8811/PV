const MainDisplay = require('MainDisplay').MainDisplay;
const MainButton = require('MainButton').MainButton;

// Define the MainCounter class

function MainCounter() {
    console.log('MainCounter called with context', Object.id(_context[_context.length - 1]));
    console.log('State: ', _context[_context.length - 1].state);
    const [count, setCount] = useState(0);

    console.log("Got count: ", count)
    
    const increment = () => {
        setCount(count + 1);
    };
    const decrement = () => {
        setCount(count - 1);
    };

    const displays = [];
    for (let i = 0; i < count; i++) {
        displays.push(createElement(MainDisplay, {count: count, key: i}));
    }
    displays.push(createElement(MainButton, {onClick: increment, key: 'button1'}));
    displays.push(createElement(MainButton, {onClick: decrement, key: 'button2'}));
    return createElement('div', null, displays);
}
