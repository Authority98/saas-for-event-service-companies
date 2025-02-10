import React, { createContext, useContext, useState, useEffect } from 'react';
import type { EventDetails } from '../types';

interface EventContextType {
  eventDetails: EventDetails | null;
  updateEventDetails: (details: EventDetails) => void;
  clearEventDetails: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

  useEffect(() => {
    // Load event details from localStorage on mount
    const savedEventDetails = localStorage.getItem('eventDetails');
    if (savedEventDetails) {
      try {
        const parsedDetails = JSON.parse(savedEventDetails);
        // Ensure date is properly parsed
        parsedDetails.eventDate = new Date(parsedDetails.eventDate);
        setEventDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing event details:', error);
        localStorage.removeItem('eventDetails');
      }
    }
  }, []);

  const updateEventDetails = (details: EventDetails) => {
    // Ensure we're working with a Date object
    const updatedDetails = {
      ...details,
      eventDate: details.eventDate instanceof Date ? details.eventDate : new Date(details.eventDate)
    };
    setEventDetails(updatedDetails);
    localStorage.setItem('eventDetails', JSON.stringify(updatedDetails));
  };

  const clearEventDetails = () => {
    setEventDetails(null);
    localStorage.removeItem('eventDetails');
    localStorage.removeItem('selectedProducts');
  };

  return (
    <EventContext.Provider value={{ eventDetails, updateEventDetails, clearEventDetails }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}; 