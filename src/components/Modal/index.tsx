import {
  Box,
  Modal as MUIModal,
  type ModalProps,
  type SxProps,
} from "@mui/material";

const style: SxProps = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outlineColor: "white",
  borderRadius: 4,
};

export default function Modal(props: TProps) {
  const { children, ...modalProps } = props;
  return (
    <MUIModal {...modalProps}>
      <Box sx={style} width={{ xs: "90%", md: 700 }}>
        {children}
      </Box>
    </MUIModal>
  );
}

type TProps = Readonly<ModalProps>;
