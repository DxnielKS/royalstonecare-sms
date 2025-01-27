import { Modal } from "./ui/modal"

interface AddCustomerModalProps {
    onClose: (closed: boolean) => void
}

export function AddCustomerModal({onClose}: AddCustomerModalProps) {
    return (
        <Modal onClose={onClose}>

        </Modal>
    )
}