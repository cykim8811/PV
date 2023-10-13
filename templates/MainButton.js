
function MainButton(props) {
    return createElement('button', {onClick: props.onClick}, 'Increment');
}


exports = {
    MainButton: MainButton
};