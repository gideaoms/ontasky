import { Body } from "@react-email/body";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Text } from "@react-email/text";
import React from "react";
import { h1, link, text } from "../style.js";

export function Email(props: { taskUrl: string; approverEmail: string }) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Heading style={h1}>Task approved</Heading>
        <Text style={text}>
          <strong>{props.approverEmail}</strong> has approved your task.
        </Text>

        <Text style={text}>
          <Link style={link} href={props.taskUrl} target="_blank">
            Click here
          </Link>{" "}
          to access the task.
        </Text>
      </Body>
    </Html>
  );
}
