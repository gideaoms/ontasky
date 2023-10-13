import { button } from "@/components/atoms/button";
import { UserRepository } from "@/core/repositories";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function List(props: {
  userRepository: UserRepository.Repository;
  currentTeamId: string;
}) {
  const users = await props.userRepository.findMany(props.currentTeamId);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-gray-700 text-lg font-semibold">Users</h1>
      </div>
      <table className="w-full text-sm text-left border-t mt-2">
        <thead className="text-xs text-gray-700 bg-gray-50 uppercase">
          <tr className="border-b">
            <th scope="col" className="px-6 py-3">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td
                scope="row"
                className="px-6 py-4 font-normal text-gray-900 whitespace-nowrap"
              >
                {user.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
