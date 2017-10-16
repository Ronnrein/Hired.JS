import * as React from "react";

class FetchError extends Error {
    response: any
}

export function convertNewLine(str: string) {
    return str.split("\n").map((i, k) => <p key={k}>{i}</p>);
}

export function convertCode(str: string) {
    return str.replace(/\|(.*?)\|/g, (a, b) => `<p class='code-snippet'>${b}</p>`);
}

export function checkFetchStatus(response: any) {
    if(response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new FetchError(response.statusTest);
    error.response = response;
    throw error;
}

export function beforeEvent(obj: any, method: string, wrapper: Function) {
    const orig = obj[method];
    obj[method] = function() {
        var args = Array.prototype.slice.call(arguments);
        return wrapper.call(this, () => orig.apply(obj, args), args);
    }
    return obj[method];
}
