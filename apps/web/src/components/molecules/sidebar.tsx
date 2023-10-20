import { Email } from "@/components/atoms/email";
import { NavItem } from "@/components/atoms/nav-item";
import { SignOut } from "@/components/atoms/sign-out";
import { Team } from "@/components/atoms/team";
import { Building, CalendarCheck, ListTodo, Users } from "lucide-react";
import Link from "next/link";

export function Sidebar(props: { currentTeamId: string }) {
  return (
    <aside className="w-80 h-screen flex flex-col border-r p-4 gap-6 sticky top-0">
      <Link href="/" className="w-fit">
        <strong className="text-xl font-semibold text-zinc-900">Ontasky</strong>
        <span className="text-xs ml-2">beta</span>
      </Link>
      <nav>
        <NavItem
          href={`/teams?current_team_id=${props.currentTeamId}`}
          icon={Building}
          title="Teams"
        />
        <NavItem
          href={`/users?current_team_id=${props.currentTeamId}`}
          icon={Users}
          title="Users"
        />
        <NavItem
          href={`/tasks?current_team_id=${props.currentTeamId}`}
          icon={CalendarCheck}
          title="Tasks"
        />
        <NavItem
          href={`/answers?current_team_id=${props.currentTeamId}`}
          icon={ListTodo}
          title="Answers"
        />
      </nav>
      <div className="mt-auto flex flex-col items-center gap-2">
        <Team />
        <Email />
        <SignOut />
      </div>
    </aside>
  );
}
