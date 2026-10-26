import { Chat } from "@/components/chat";
import { MODEL } from "@/lib/assistant";

export default function HomePage() {
  return <Chat model={MODEL} />;
}
