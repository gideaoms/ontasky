import { Body } from "@react-email/body";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Text } from "@react-email/text";
import React from "react";
import { h1, link, text } from "../style.js";

export function Email(props: {
  password: string;
  teamName: string;
  webUrl: string;
}) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Heading style={h1}>Welcome to {props.teamName}</Heading>
        <Text style={text}>
          You have been invited to join the <strong>{props.teamName}</strong>{" "}
          team on our platform.
        </Text>
        <Text style={text}>
          <Link style={link} href={props.webUrl} target="_blank">
            Click here
          </Link>{" "}
          to access the Ontasky platform.
        </Text>
        <Text style={text}>
          Your password is <strong>{props.password}</strong>
        </Text>
      </Body>
    </Html>
  );
}
