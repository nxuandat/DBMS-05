import React, { FC } from 'react'
import {Modal,Box} from "@mui/material";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // activeItem: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: any;
    setRoute?: (route: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch?:any;
}

const CustomModal: FC<Props> = ({open,setOpen,component:Component}) => {
  return (
    <Modal
    open={open}
    onClose={() => setOpen(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
      <Box
      className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[95%] m-auto  800px:w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none"
      >
        <Component setOpen={setOpen} />
      </Box>
    </Modal>
  )
}

export default CustomModal