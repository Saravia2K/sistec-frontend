import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import PersonIcon from "@mui/icons-material/Person";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

const links = {
  admin: {
    prefix: "/admin",
    links: [
      createLinkItem("Solicitudes", "/solicitudes", ReceiptIcon),
      createLinkItem("Inventario", "/inventario", InventoryIcon),
      createLinkItem("Componentes", "/componentes", SettingsInputComponentIcon),
      createLinkItem("Clientes", "/usuarios", PersonIcon),
      createLinkItem("Técnicos", "/tecnicos", EngineeringIcon),
      createLinkItem("Proveedores", "/proveedores", FireTruckIcon),
      createLinkItem("Dispositivos Soportados", "/dispositivos-soportados", DeviceUnknownIcon),
      createLinkItem("Reportes", "/reportes", FolderCopyIcon),
    ],
  },
  cliente: {
    prefix: "/cliente",
    links: [createLinkItem("Solicitudes", "/tickets", ReceiptIcon)],
  },
  soporte: {
    prefix: "/soporte",
    links: [createLinkItem("Solicitudes", "/tickets", ReceiptIcon)],
  },
};

function createLinkItem(text: string, path: string, icon: TIcon) {
  return { text, path, icon };
}

type TIcon = OverridableComponent<SvgIconTypeMap<object, "svg">> & {
  muiName: string;
};

export default links;
