
function MainDisplay(props) {
    const [value, setValue] = useState(Math.floor(Math.random() * 100));
    return createElement('div', null, 
        createElement('h1', null, 'Count: ' + props.count + ', Value: ' + value),
    );
}
exports = {
    MainDisplay: MainDisplay
};