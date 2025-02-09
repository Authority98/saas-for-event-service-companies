import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Divider,
  Box,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { Mail } from 'lucide-react';
import dayjs from 'dayjs';

interface Enquiry {
  id: number;
  name: string;
  eventType: string;
  date: string;
  status: string;
}

interface RecentEnquiriesProps {
  enquiries: Enquiry[];
}

const RecentEnquiries: React.FC<RecentEnquiriesProps> = ({ enquiries }) => {
  const theme = useTheme();

  return (
    <Paper 
      sx={{ 
        p: 3,
        height: '100%',
        borderRadius: 2,
        boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.common.black, 0.05)}`
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Mail size={20} />
        Recent Enquiries
      </Typography>
      <List>
        {enquiries.map((enquiry, index) => (
          <React.Fragment key={enquiry.id}>
            <ListItem sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {enquiry.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={enquiry.name}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {enquiry.eventType}
                    </Typography>
                    <Chip 
                      label={dayjs(enquiry.date).format('MMM D, YYYY')}
                      size="small"
                      sx={{ 
                        bgcolor: 'background.default',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                }
              />
              <Chip 
                label="Pending"
                size="small"
                sx={{ 
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  color: 'warning.main',
                  fontWeight: 500
                }}
              />
            </ListItem>
            {index < enquiries.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RecentEnquiries; 