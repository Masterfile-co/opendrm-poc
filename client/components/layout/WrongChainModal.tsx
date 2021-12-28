import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export default function WrongChainModal() {
  const { library, chainId, error } = useWeb3React<Web3Provider>();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (chainId) {
      if (chainId !== 5) {
        setOpen(true);
      }
      setOpen(false);
      return
    }
    if(error instanceof UnsupportedChainIdError){
        setOpen(true)
    }
  }, [chainId, error]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {}}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block  bg-[#232225] text-white rounded-lg px-[78px] pt-5 pb-10 overflow-hidden transform transition-all align-middle ">
              <div>
                <div className="mt-3 text-center ">
                  <Dialog.Title
                    as="h3"
                    className="text-[21px] leading-6 font-bold font-secondary "
                  >
                    Wrong Network
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm leading-6">
                      Please change your active network to Goerli testnet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
