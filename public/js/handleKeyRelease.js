export function handleKeyRelease(keys) {
    return function (event) {
        keys[event.key] = false;
    };
}
