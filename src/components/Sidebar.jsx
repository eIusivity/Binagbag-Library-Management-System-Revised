import {Box, IconButton, Typography, List, ListItemButton, ListItemText, ListItemIcon} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';  
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const sidebarButtons = [
      {path: '/dashboard', icon: <DashboardIcon/>, label: 'Dashboard'},
      {path: '/catalog', icon: <CollectionsBookmarkIcon/>, label: 'Catalog'},
      {path: '/users', icon: <GroupIcon/>, label: 'Users'},
      {path: '/loan', icon: <LibraryBooksIcon/>, label: 'Loan'},
      {path: '/reservation', icon: <BookmarksIcon/>, label: 'Reservation'},
    ]
  return (
    <Box sx={{position: 'relative',width: 64,minWidth: 64,height: '100%',}}>
      <Box onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)} sx={{display: 'flex', position: 'absolute', top: 0, left: 0, bottom: 0, width: expanded ? 180 : 64, flexDirection: 'column', bgcolor: 'primary.main', transition: 'all 0.2s ease', zIndex: 999}}>
          <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 2}}>
            <List sx={{width: '100%', p: 0}}>
            {sidebarButtons.map((button,i) => {
              return (
                <ListItemButton key={i} component={NavLink} to={button.path} sx={{color: 'background.default', gap: expanded ? 1 : 0, minHeight: 48,
                '&:hover': {bgcolor: 'accent.primary'}
                }}>
                  <ListItemIcon sx={{color: 'inherit', justifyContent: 'center'}}>{button.icon}</ListItemIcon>
                  <ListItemText primary={button.label} sx={{m: 0, opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, whiteSpace: 'nowrap', transition: 'opacity 0.2s ease', overflow: 'hidden'}}/>
                </ListItemButton>
              )
            })}
            </List>
          </Box>
          <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', mb: 2}}>
            <List sx={{width: '100%', p: 0}}>
              <ListItemButton component={NavLink} to='/reports' sx={{color: 'background.default', gap: expanded ? 1 : 0, minHeight: 48, '&:hover': {bgcolor: 'accent.primary'}}}>
                <ListItemIcon sx={{color: 'inherit', justifyContent: 'center'}}><AssessmentIcon/></ListItemIcon>
                <ListItemText primary="Report" sx={{m: 0, opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, whiteSpace: 'nowrap', transition: 'opacity 0.2s ease', overflow: 'hidden'}}/>
              </ListItemButton>

              <ListItemButton component={NavLink} to='/settings' sx={{color: 'background.default', gap: expanded ? 1 : 0, minHeight: 48, '&:hover': {bgcolor: 'accent.primary'}}}>
                <ListItemIcon sx={{color: 'inherit', justifyContent: 'center'}}><SettingsIcon/></ListItemIcon>
                <ListItemText primary="Settings" sx={{m: 0, opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, whiteSpace: 'nowrap', transition: 'opacity 0.2s ease', overflow: 'hidden'}}/>
              </ListItemButton>
            </List>
          </Box>
      </Box>
      </Box>
  )
}

export default Sidebar