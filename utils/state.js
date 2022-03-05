import { Principal } from "@dfinity/principal";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, useAuth } from "./auth";
// import { Listing_2, TokenDesc } from "./canister/icpunks_type";
// import { getCanisterIds } from "./canister/principals";

import icpunks_idl from "./idl/icpunks.did";
import ledger_idl from "./idl/ledger.did";

import canisters from './canisters'
import { getAccountIdentifier, getSubAccountArray } from "./utils";
import toast from "react-hot-toast";

const { Actor, HttpAgent } = require('@dfinity/agent');
const ic_agent = new HttpAgent({ host: "https://boundary.ic0.app/" });

export function useProvideState() {
    const authContext = useAuth();

    let readActorCache = {}
    function getReadActor(cid, idl) {
        if (cid in readActorCache)
            return readActorCache[cid]

        const actor = Actor.createActor(idl, {
            agent: ic_agent,
            canisterId: cid,
        });

        readActorCache[cid] = actor;

        return actor;
    }

    const getBalance = async (principal) => {
        let ledger = getReadActor('yeeiw-3qaaa-aaaah-qcvmq-cai', ledger_idl);
        let account = getAccountIdentifier(principal);
        
        let balance = await ledger.account_balance_dfx({account});
        return balance;
    }

    const totalSupply = async () => {
        let ledger = getReadActor('yeeiw-3qaaa-aaaah-qcvmq-cai', ledger_idl);
        let total = await ledger.total_supply_dfx({});

        return total;
    }

    const claim = async (principal) => {
        try {
            let ledger = await auth.wallet.getActor('yeeiw-3qaaa-aaaah-qcvmq-cai', ledger_idl)
            let account = getAccountIdentifier(principal);
            
            let faucet_result = await ledger.faucet({to: account, created_at_time: []});
        } catch (error) {
            console.error(error);
        }
    }

    return {
        getBalance,
        totalSupply,
        claim,
    };
}

const stateContext = createContext(null);

export function ProvideState({ children }) {
    const state = useProvideState();
    return <stateContext.Provider value={state}>{children}</stateContext.Provider>;
}

export const useLocalState = () => {
    return useContext(stateContext);
};
