import {
  EPurchaseStatus,
  ETechnicianSpeciality,
  ETicketPriority,
  ETicketStatus,
} from "./enums";

export type TUser = {
  id: number;
  name: string;
  phone: string;
  email: string;
  firstLogin: boolean;
};

export type TClient = TUser & {
  idUser: number;
  address: string;
  registrationDate: Date;
};

export type TTechnician = TUser & {
  idUser: number;
  specialty: ETechnicianSpeciality;
  active: boolean;
};

export type TSupportedDevices = {
  id: number;
  name: string;
  tickets?: TTicket;
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
  repair: TRepair;
};

export type TRepair = {
  id: number;
  supportTicket?: TTicket;
  diagnosis: string;
  startDate: Date;
  appliedSolution?: string;
  endDate?: Date;
  estimatedCost?: number;
  usedComponents?: TUsedComponents[];
};

export type TComponent = {
  id: number;
  name: string;
  description: string;
  visible: boolean;
  components?: TComponentStock[];
  purchases?: TPurchase[];
};

export type TComponentStock = {
  id: number;
  component: TComponent;
  supplier: TSupplier;
  stock: number;
  minimumStock: number;
  unitPrice: number;
  inUse: Boolean;
  usedIn: TUsedComponents[];
};

export type TUsedComponents = {
  id: number;
  repair: TRepair;
  quantity: number;
  componentStock: TComponentStock;
};

export type TSupplier = {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  purchases?: TPurchase[];
  stocks?: TComponentStock[];
};

export type TPurchase = {
  id: number;
  supplier: TSupplier;
  component: TComponent;
  quantity: number;
  unitPrice: number;
  purchaseDate: Date;
  deliveryDate?: Date;
  details?: string;
  status: EPurchaseStatus;
};

export type TResponseError = {
  message: string[];
  error: string;
  statusCode: number;
};
