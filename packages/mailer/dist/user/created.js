import { Body } from "@react-email/body";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import React from "react";
import { h1, text } from "../style.js";
export function Email(props) {
    return (React.createElement(Html, { lang: "en" },
        React.createElement(Body, { style: {
                backgroundColor: "#ffffff",
            } },
            React.createElement(Heading, { style: h1 }, "Welcome to Ontasky"),
            React.createElement(Text, { style: text },
                "This is your code to activate your account:",
                " ",
                React.createElement("strong", null, props.validationCode)))));
}
//# sourceMappingURL=created.js.map