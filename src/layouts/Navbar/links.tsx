import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import type { SvgIconTypeMap } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export default {
  admin: {
    prefix: "/admin",
    links: [
      createLinkItem("Solicitudes", "/solicitudes", ReceiptIcon),
      createLinkItem("Inventario", "/inventario", InventoryIcon),
      createLinkItem("Técnicos", "/tecnicos", EngineeringIcon),
      createLinkItem("Reportes", "/reportes", FolderCopyIcon),
    ],
  },
};

function createLinkItem(text: string, path: string, icon: TIcon) {
  return { text, path, icon };
}

type TIcon = OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
};
