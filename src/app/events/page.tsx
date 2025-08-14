import { Events } from "@/components/Events";
import { getEvents } from "@/actions/getEvents";

export default async function EventPage() {
  const events = await getEvents();

  return <Events events={events} showViewAllButton={false} />;
}
