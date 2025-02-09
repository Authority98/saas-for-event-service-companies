import React, { createContext, useContext, useState, useEffect } from 'react';
import type { EventDetails } from '../types';

interface EventContextType {
  eventDetails: EventDetails | null;
  updateEventDetails: (details: EventDetails) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

  useEffect(() => {
    // Load event details from localStorage on mount
    const savedEventDetails = localStorage.getItem('eventDetails');
    if (savedEventDetails) {
      const parsedDetails = JSON.parse(savedEventDetails);
      parsedDetails.eventDate = new Date(parsedDetails.eventDate);
      setEventDetails(parsedDetails);
    }
  }, []);

  const updateEventDetails = (details: EventDetails) => {
    setEventDetails(details);
    localStorage.setItem('eventDetails', JSON.stringify(details));
  };

  return (
    <EventContext.Provider value={{ eventDetails, updateEventDetails }}>
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