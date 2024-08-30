export function handleKeyPress(keys) {
    return function (event) {
        keys[event.key] = true;
    };
}
