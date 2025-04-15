import { TTicket } from "@/lib/types";
import axios from "@/lib/axios";

export default async function updateTicket(ticket: Partial<TTicket>) {
  try {
    console.log(ticket);
    const { id, ...ticketData } = ticket;
    const res = await axios.patch(`/tickets/${id}`, ticketData);
    return res.status == 200;
  } catch (error) {
    return false;
  }
}
