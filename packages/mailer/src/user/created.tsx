import { Body } from "@react-email/body";
import { Heading } from "@react-email/heading";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import React from "react";
import { h1, text } from "../style.js";

export function Email(props: { validationCode: string }) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Heading style={h1}>Welcome to Ontasky</Heading>
        <Text style={text}>
          This is your code to activate your account:{" "}
          <strong>{props.validationCode}</strong>
        </Text>
      </Body>
    </Html>
  );
}
