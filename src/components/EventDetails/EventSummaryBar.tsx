import React from 'react';
import { 
  Box, 
  Typography, 
  Tooltip, 
  Chip
} from '@mui/material';
import { 
  Calendar, 
  MapPin, 
  Users, 
  UtensilsCrossed, 
  X, 
  Tent
} from 'lucide-react';
import dayjs from 'dayjs';
import type { Product, EventDetails } from '../../types';
import { useEvent } from '../../contexts/EventContext';
import { useNavigate } from 'react-router-dom';

interface EventSummaryBarProps {
  eventDetails: EventDetails;
}

const EventSummaryBar: React.FC<EventSummaryBarProps> = ({ eventDetails }) => {
  const { updateEventDetails } = useEvent();
  const navigate = useNavigate();

  if (!eventDetails) return null;

  const handleDelete = (key: string) => {
    // Update event details
    const updatedEventDetails = {
      ...eventDetails,
      interestedIn: {
        ...eventDetails.interestedIn,
        [key]: false
      }
    };

    // Update selected products
    const selectedProducts = localStorage.getItem('selectedProducts');
    if (selectedProducts) {
      const products: Product[] = JSON.parse(selectedProducts);
      const tentType = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      const updatedProducts = products.filter(product => product.type !== tentType);
      localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
    }

    updateEventDetails(updatedEventDetails);
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        px: { xs: 1, md: 2 },
        py: 0.5,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Icon size={16} />
      <Typography 
        variant="body2" 
        sx={{ fontWeight: 500 }}
      >
        {value}
      </Typography>
    </Box>
  );

  const selectedTentTypes = Object.entries(eventDetails.interestedIn)
    .filter(([_, value]) => value)
    .map(([key]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    }));

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2,
      ml: 'auto',
      width: { xs: '100%', md: 'auto' },
      mt: { xs: 1, md: 0 }
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <InfoItem 
          icon={Calendar} 
          label="Event Date" 
          value={dayjs(eventDetails.eventDate).format('DD MMM YYYY')} 
        />
        <InfoItem 
          icon={Users} 
          label="Guests" 
          value={eventDetails.totalGuests} 
        />
        <InfoItem 
          icon={UtensilsCrossed} 
          label="Dining" 
          value={eventDetails.formalDiningSeats} 
        />
        {eventDetails.venueLocation && (
          <InfoItem 
            icon={MapPin} 
            label="Location" 
            value={eventDetails.venueLocation} 
          />
        )}
      </Box>

      {selectedTentTypes.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap'
        }}>
          {selectedTentTypes.map(({ key, label }) => (
            <Chip
              key={key}
              icon={<Tent size={16} />}
              label={label}
              onDelete={() => handleDelete(key)}
              deleteIcon={<X size={14} />}
              variant="outlined"
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                height: 32,
                borderColor: 'divider',
                '& .MuiChip-label': {
                  px: 1,
                  fontWeight: 500,
                  fontSize: '0.875rem'
                },
                '& .MuiChip-icon': {
                  ml: 1,
                  color: 'inherit'
                },
                '& .MuiChip-deleteIcon': {
                  color: 'text.secondary',
                  mr: 1,
                  '&:hover': {
                    color: 'error.main'
                  }
                }
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventSummaryBar; 