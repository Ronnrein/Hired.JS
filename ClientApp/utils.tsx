import * as React from "react";

class FetchError extends Error {
    response: any
}

export function convertNewLine(str: string) {
    return str.split("\n").map((i, k) => {
        return <p key={k}>{i}</p>;
    });
}

export function checkFetchStatus(response: any) {
    if(response.status >= 200 && response.status < 300) {
        return response;
    }
    let error = new FetchError(response.statusTest);
    error.response = response;
    throw error;
}
