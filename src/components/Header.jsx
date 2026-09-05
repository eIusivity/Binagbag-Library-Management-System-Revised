import {Box, Button, IconButton, Typography} from '@mui/material';
import CustomTextField from './CustomTextField.jsx';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PersonIcon from '@mui/icons-material/Person';
import Logo from '../assets/Logo.png'
function Header() {
    const iconButtons = [<NotificationsIcon/>,<ChatBubbleIcon/>,<PersonIcon/>]

  return (
    <Box sx={{display: 'flex', flex: 0.05, bgcolor: 'primary.main'}}>
        <Box sx={{display: 'flex', flex: 0.5}}>
            <Button sx={{color: 'background.default', gap: 1, '&:hover': {opacity: 0.75}}}>
                <img src={Logo} width="50" height="50"/> <Typography variant="h6">Binagbag NHS</Typography>
            </Button>
        </Box>
        <Box sx={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <SearchIcon sx={{color: 'background.default', fontSize: 32}}/>
            <CustomTextField fullWidth placeholder="Search..." sx={{height: '60%'}}/>
        </Box>
        <Box sx={{display: 'flex', flex: 0.5, justifyContent: 'flex-end', alignItems: 'center', px: 2}}>
            {iconButtons.map((icon, i) => {
                return(
                    <IconButton key={i} disableRipple sx={{color: 'background.default', '&:hover': {bgcolor: 'accent.primary'}}}>{icon}</IconButton>
                )
            })}
        </Box>
    </Box>
  )
}

export default Header