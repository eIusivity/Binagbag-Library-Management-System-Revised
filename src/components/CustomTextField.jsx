import { TextField } from '@mui/material';

function CustomTextField({ sx, ...props}) {
  return (
    <TextField
      {...props}
      slotProps={{
        htmlInput: {autoomplete: 'off'}
      }}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: 4,
        '& .MuiOutlinedInput-root': {
          borderRadius: 4,
          height: '100%',
        },
        
        ...sx,
      }}
    />
  );
}

export default CustomTextField;