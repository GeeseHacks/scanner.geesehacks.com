import QRCodeScanner from "@/components/Scanner";
import { Input } from "@/components/ui/input";

export default function EventPage({ params }: { params: { id: string } }) {

  return <>
    <b className="p-4">Currently selected event: {params.id}</b>
    
    {/* <QRCodeScanner /> */}
  </>
}