import Image from "next/image";
import QRCodeGenerator from '../components/Generator';
import QRCodeScanner from '../components/Scanner';
import Schedule from "@/components/schedule";

export default function Home() {
  return (
    <div>
      {/* TODO: Warn if not using phone */}
      {/* <QRCodeScanner /> */}
      <Schedule />
    </div>
  );
}
