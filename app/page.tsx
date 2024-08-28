import Image from "next/image";
import QRCodeGenerator from './components/generator';
import QRCodeScanner from './components/scanner';

export default function Home() {
  return (
    <>
      {/* <QRCodeGenerator /> */}
      <QRCodeScanner />
    </>
  );
}
