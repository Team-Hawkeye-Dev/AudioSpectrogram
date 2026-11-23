import { useEffect } from "react"

export const useHandleEscape = (open: boolean, close: () => void) => {
    useEffect(()=> {
        if (!open) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close()
        }

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, close])
}