"use client";

export default function Error(props: { error: Error & { digest?: string } }) {
  console.log(props.error);
  return <p>An error has occurred.</p>;
}
