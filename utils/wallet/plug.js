import { HttpAgent } from "@dfinity/agent";
import { auth } from "../auth";
// import { getHost } from "../canister/actor";

// import { getCanisterIds } from "../canister/principals";

// export interface PlugWindow extends Window {
//   ic: any;

// }

// declare let window: PlugWindow;

export default function plugWallet() {
    let agent = undefined;

    async function getActor(canisterId, idl) {
      const actor = await window.ic.plug.createActor({
        canisterId,
        interfaceFactory: idl,
      });

      return actor
    }

    async function logIn(whitelist) {
      if (window.ic === undefined) {
        window.open('https://plugwallet.ooo/', '_blank')?.focus();
        
        return
      }

      const connected = await window.ic.plug.isConnected();
      // const host = getHost();
      // const ids = getCanisterIds();
      // const whitelist = [ids.icpunks, ids.icats];

      if (!connected) {
        const result = await window.ic.plug.requestConnect();

        if (!result) {
          console.log('Could not login to plug');
          return;
        }
      }

      await window.ic.plug.createAgent({ whitelist, host: "https://boundary.ic0.app/" })
      agent = window.ic.plug.agent;
      // agent.fetchRootKey();

      const principal = await agent.getPrincipal();
      
      auth.setAgent(agent);
      auth.setPrincipal(principal);
    }

    function logOut() {
      auth.setAgent(undefined);
      auth.setPrincipal(undefined);
    }

    async function requestTransfer(data){
      if (window.ic === undefined) return;

      return await window.ic.plug.requestTransfer(data);
    }
    
    async function getBalance() {
      const result = await window.ic.plug.requestBalance();

      return result;
    }

    return {
        name: 'plug',
        logIn,
        logOut,
        getActor,
        requestTransfer,
        getBalance
      };
}