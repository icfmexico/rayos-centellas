import { Cormorant_Garamond } from "next/font/google";
import PedidoClient from "./PedidoClient";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "ICF México — Estimado puesto en obra",
};

export default function PedidoPage() {
  return <PedidoClient serifClass={cormorant.className} />;
}
