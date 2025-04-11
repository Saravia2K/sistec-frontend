import { ETechnicianSpeciality, ETicketPriority, ETicketStatus } from "./enums";

export type TUser = {
  id: number;
  name: string;
  phone: string;
  email: string;
  //   firstLogin: boolean;
};

export type TClient = TUser & {
  //   id_client: number;
  address: string;
  registrationDate: string;
};

export type TTechnician = TUser & {
  // id_technician: number;
  specialty: ETechnicianSpeciality;
  active: boolean;
};

export type TSupportedDevices = {
  id: number;
  name: string;
  tickets: TTicket;
};

export type TTicket = {
  id: number;
  customer: TClient;
  assignedTechnician?: TTechnician;
  deviceType: Omit<TSupportedDevices, "tickets">;
  brand: string;
  problemDescription: string;
  status: ETicketStatus;
  priority: ETicketPriority;
  model?: string;
  serialNumber?: string;
  requestDate?: Date;
  closeDate?: Date;
  // repair: TRepair;
};
