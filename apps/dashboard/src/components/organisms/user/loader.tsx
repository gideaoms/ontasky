import { Form } from "@/components/organisms/user/form";

export async function Loader(props: { currentTeamId: string }) {
  return <Form currentTeamId={props.currentTeamId} />;
}
