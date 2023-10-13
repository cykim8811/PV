
function MainDisplay(props) {
    return createElement('div', null, 
        createElement('h1', null, 'Count: ' + props.count),
    );
}
exports = {
    MainDisplay: MainDisplay
};