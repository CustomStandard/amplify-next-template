// This statement is for React server components to indicate the component is a client component
'use client'

// Import necessary hooks and utilities from React
import { createContext, useContext, useEffect, useState } from 'react'

// Define the types for the properties that ModalProvider will accept
interface ModalProviderProps {
  // ModalProvider expects to have children elements
  children: React.ReactNode
}

// Define a type for the data that the modal will handle, initially empty
export type ModalData = {}

// Define the structure of the ModalContext
type ModalContextType = {
  data: ModalData // Data that the modal will use
  isOpen: boolean // Boolean to check if the modal is open or closed
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void // Function to open the modal
  setClose: () => void // Function to close the modal
}

// Create the ModalContext with default values
export const ModalContext = createContext<ModalContextType>({
  data: {}, // Default data is an empty object
  isOpen: false, // Initially the modal is not open
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {}, // Default function does nothing
  setClose: () => {}, // Default function does nothing
})

// Define the ModalProvider component using React.FC (Functional Component) with ModalProviderProps
const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // State to track if the modal is open or closed
  const [isOpen, setIsOpen] = useState(false)
  // State to store data for the modal
  const [data, setData] = useState<ModalData>({})
  // State to keep track of the modal content
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false)

  // useEffect hook to set the component as mounted when it is first rendered
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Function to open the modal, optionally fetch data if a function is provided
  const setOpen = async (
    modal: React.ReactNode, // The modal content to display
    fetchData?: () => Promise<any> // Optional function to fetch data
  ) => {
    if (modal) { // Check if modal content is provided
      if (fetchData) { // Check if fetchData function is provided
        // Fetch data and update the state with the new data
        setData({ ...data, ...(await fetchData()) } || {})
      }
      // Set the modal content and open the modal
      setShowingModal(modal)
      setIsOpen(true)
    }
  }

  // Function to close the modal
  const setClose = () => {
    setIsOpen(false) // Close the modal
    setData({}) // Reset the modal data
  }

  // If the component is not yet mounted, return null (render nothing)
  if (!isMounted) return null

  // Render the ModalContext.Provider to provide the context values to children components
  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children} {/* Render any children passed to the provider */}
      {showingModal} {/* Render the modal content if it is open */}
    </ModalContext.Provider>
  )
}

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext) // Get the context value
  if (!context) { // If no context is found, throw an error
    throw new Error('useModal must be used within the modal provider')
  }
  return context // Return the context value
}

// Export the ModalProvider as the default export
export default ModalProvider
