const MainDisplay = require('MainDisplay').MainDisplay;
const MainButton = require('MainButton').MainButton;

// Define the MainCounter class

function MainCounter() {
    const [count, setCount] = useState(0);
    
    const increment = () => {
        setCount(count + 1);
    };
    
    return createElement('div', null, 
        createElement(MainDisplay, {count: count}),
        createElement(MainButton, {onClick: increment}),
    );
}
