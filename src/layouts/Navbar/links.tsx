import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import PersonIcon from "@mui/icons-material/Person";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export default {
  admin: {
    prefix: "/admin",
    links: [
      createLinkItem("Solicitudes", "/solicitudes", ReceiptIcon),
      createLinkItem("Inventario", "/inventario", InventoryIcon),
      createLinkItem("Usuarios", "/usuarios", PersonIcon),
      createLinkItem("Técnicos", "/tecnicos", EngineeringIcon),
      createLinkItem("Proveedores", "/proveedores", FireTruckIcon),
      createLinkItem("Reportes", "/reportes", FolderCopyIcon),
    ],
  },
};

function createLinkItem(text: string, path: string, icon: TIcon) {
  return { text, path, icon };
}

type TIcon = OverridableComponent<SvgIconTypeMap<object, "svg">> & {
  muiName: string;
};
