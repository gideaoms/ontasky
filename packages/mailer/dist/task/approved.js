import { Body } from "@react-email/body";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Text } from "@react-email/text";
import React from "react";
import { h1, link, text } from "../style.js";
export function Email(props) {
    return (React.createElement(Html, { lang: "en" },
        React.createElement(Body, { style: {
                backgroundColor: "#ffffff",
            } },
            React.createElement(Heading, { style: h1 }, "Task approved"),
            React.createElement(Text, { style: text },
                React.createElement("strong", null, props.approverEmail),
                " has approved your task."),
            React.createElement(Text, { style: text },
                React.createElement(Link, { style: link, href: props.taskUrl, target: "_blank" }, "Click here"),
                " ",
                "to access the task."))));
}
//# sourceMappingURL=approved.js.map