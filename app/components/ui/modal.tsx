import { useEffect } from "react"

interface ModalProps {
    onClose: (closed: boolean) => void
}

export const Modal = ({onClose}: ModalProps) => {

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
        <div className="absolute top-0 left-0 bg-black transparent p-4 w-screen h-screen z-1000 flex items-center justify-center">
            <div className="w-[40rem] h-[40rem] dark:bg-neutral-900 opacity">
            </div>
        </div>
    )
}