import {Box, Typography} from '@mui/material'

function EmptyState({icon, title, description, action}) {
  return (
    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 1}}>
        <Box sx={{color: 'accent.primary'}}>{icon}</Box>
        <Typography variant="h6" sx={{fontWeight: 'bold'}}>{title}</Typography>
        <Typography sx={{color: '#777777'}}>{description}</Typography>
        {action}
    </Box>
  )
}

export default EmptyState