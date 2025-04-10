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
