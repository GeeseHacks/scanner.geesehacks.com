
import { DataTable } from "./DataTable";
import { columns, events, HackerEvent } from "./utils/columns";


async function getData(): Promise<HackerEvent[]> {
  // Fetch data from API here.
  return events;
}

const Schedule: React.FC = async () => {
  const data = await getData();

  return <div className="container mx-auto py-8">
    <center>Hacker Event List 🎪 </center>
    <DataTable columns={columns} data={data} />
  </div>
}
export default Schedule;