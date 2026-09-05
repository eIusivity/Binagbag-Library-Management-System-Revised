import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';

import AutoStoriesIcon from '@mui/icons-material/AutoStories';

function BookProductCard({
  title,
  author,
  genre,
  available_copies,
  onClick
}) {
  return (
    <Card
      sx={{
        width: 300,
        height: 175,
        borderRadius: 4,
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: '100%',
        }}
      >
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            boxSizing: 'border-box',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 80,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#777777',
                borderRadius: 4,
              }}
            >
              <AutoStoriesIcon />
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {title ?? 'No Title Found'}
              </Typography>

              <Typography color="text.secondary">
                {author ?? 'No Author Found'}
              </Typography>

              <Typography color="text.secondary">
                {genre ?? 'No Genre Found'}
              </Typography>
            </Box>
          </Box>

          <Chip
            label={available_copies > 0 ? (available_copies > 1 ? available_copies+' Copies Available' : '1 Copy Avaiable') : ('Unavailable')}
            color={available_copies > 0 ? 'success' : 'error'}
            sx={{ width: '100%' }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BookProductCard;