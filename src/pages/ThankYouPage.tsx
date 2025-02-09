import React from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import StepProgress from '../components/EventForm/StepProgress';

const ThankYouPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <StepProgress activeStep={3} />
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h1" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            We've received your enquiry and will be in touch shortly to discuss your event requirements.
          </Typography>
          <Typography variant="body1" paragraph>
            A member of our team will contact you within 24 hours to confirm availability and discuss your requirements in detail.
          </Typography>
          {/* Only show if brochure was requested */}
          <Typography variant="body1" paragraph>
            We'll send our digital brochure to your email address shortly.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              size="large"
            >
              Return Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ThankYouPage;