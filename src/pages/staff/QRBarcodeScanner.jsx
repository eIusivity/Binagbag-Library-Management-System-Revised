import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import CustomTextField from "../../components/CustomTextField";
function QRBarcodeScanner() {
  const [scannedValue, setScannedValue] = useState("");

  return (
    <>
      <Scanner
        onScan={(result) => {
          if (result?.length > 0) {
            const value = result[0].rawValue;

            console.log("QR detected:", value);
            setScannedValue(value);
          }
        }}
      />

      <CustomTextField
        value={scannedValue}
        onChange={(e) => setScannedValue(e.target.value)}
      />
    </>
  );
}

export default QRBarcodeScanner;
