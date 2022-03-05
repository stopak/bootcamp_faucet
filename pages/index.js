import { useAuth } from '../utils/auth';
import { useEffect, useState } from 'react';

import { AppBar, Button, Container, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useLocalState } from '../utils/state';

export default function Home() {
  const auth = useAuth()
  const state = useLocalState();

  const [connected, isConnecting] = useState(false);
  const [claiming, isClaiming] = useState(false);

  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  const [principal, setPrincipal] = useState(null);

  async function login() {
    isConnecting(true);
    try {
      await auth.usePlug()
    } catch {

    }
    isConnecting(false);
  }

  async function update_balance() {
    let val = await state.getBalance(auth.principal);
    let val_icp = Number(val.e8s) / Math.pow(10, 8);
    setBalance(val_icp);

    let total = await state.totalSupply();
    let total_icp = Number(total.e8s) / Math.pow(10, 8);
    setTotalSupply(total_icp);
  }

  async function faucet() {
    if (auth.principal === null || auth.principal === undefined) return;
    isClaiming(true);
    try {
      await state.claim(auth.principal);

      await update_balance();
    } catch (e) {
      console.error(e)
    }
    isClaiming(false);
  }

  useEffect(async () => {
    if (auth.principal !== null && auth.principal !== undefined) {

      await update_balance();


      setPrincipal(auth.principal.toString());
    } else {
      setPrincipal(null);
    }


  }, [auth.principal])

  async function logout() {
    auth.wallet.logOut();
  }


  return (
    <>
      <AppBar position="static" color="background">
        <Container maxWidth="lg">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              {/* <MenuIcon /> */}
            </IconButton>
            <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1 }}>
              Bootcamp Faucet
            </Typography>
            <Stack spacing={2} direction="row">
              {auth.principal !== null && auth.principal !== undefined ? <>
                <LoadingButton color="neutral" loading={connected} variant="contained" onClick={logout}>Disconnect Wallet</LoadingButton>
              </> :
                <LoadingButton color="neutral" loading={connected} variant="contained" onClick={login}>Connect Wallet</LoadingButton>
              }
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg">
        <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1, margin: 2 }}>
          Total Supply: {totalSupply}
        </Typography>

        {principal !== null ? <>
          <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1, margin: 2  }}>
            Principal: {principal}
          </Typography>
          <Typography variant="h5" color="inherit" component="div" sx={{ flexGrow: 1, margin: 2  }}>
            Balance: {balance}
          </Typography>

          <LoadingButton color="neutral" loading={claiming} variant="contained" onClick={faucet}>Claim</LoadingButton></>
          : <></>
        }

      </Container>
    </>
  )
}
