import { X } from "lucide-react"
import { useEffect } from "react"

interface ModalProps {
    onClose: (closed: boolean) => void
    children?: React.ReactNode
}

export const Modal = ({ onClose, children }: ModalProps) => {

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose(false)
            }
        }

        // Add the event listener when component mounts
        document.addEventListener('keydown', handleEscapeKey)

        // Clean up by removing listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleEscapeKey)
        }
    }, [onClose])


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="w-[80rem] h-4/5 dark:bg-neutral-900 bg-white rounded-lg shadow-xl">
                <div className="flex justify-end p-4 items-center">
                    <button onClick={() => onClose(false)} className="hover:bg-white p-2 rounded-lg hover:text-black">
                        <X />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}