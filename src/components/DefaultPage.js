import React from 'react'
import { Avatar, IconButton } from '@mui/material'
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

//'https://i.imgur.com/eUeObWB.png'

function DefaultPage({ setLeftBarOpen }) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", maxWidth: '500px', m: 5 }}>
      {!isTablet && <div style={{ alignSelf: "start", m: 3, borderBottom: '1px solid gray', width: '100%' }}>
        <IconButton sx={{ p: 3 }} onClick={() => setLeftBarOpen(true)}>
          <MenuIcon />
        </IconButton>
      </div>
      }
      <h1>Університетський чат</h1>
      <img src='https://quarsu.nltu.edu.ua//storage/pages/March2020/Logo_NLTU.png' style={{ width: "100vw", maxWidth: '500px', aspectRatio: '503/700' }}></img>
    </div>
  )
}

export default DefaultPage