import * as React from "react";

export function convertNewLine(str: string) {
    return str.split("\n").map((i, k) => {
        return <p key={k}>{i}</p>;
    });
}