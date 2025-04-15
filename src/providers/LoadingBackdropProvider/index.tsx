import { type PropsWithChildren, useEffect, useState } from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export default function LoadingBackdropProvider({
  children,
}: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  useEffect(() => {
    const isPending = isFetching > 0 || isMutating > 0;
    setOpen(isPending);
  }, [isFetching, isMutating]);

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </>
  );
}
