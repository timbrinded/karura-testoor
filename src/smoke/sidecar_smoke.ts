import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { deriveAddress } from '@acala-network/txwrapper-acala';
import dotenv from "dotenv";
import { expect } from "chai";
import {get} from "../utils/comms"
dotenv.config();

export const SidecarTests = async () => {
    describe("When running Sidecar 🔎", async () => {
        const HOST = process.env.SIDECAR_ENDPOINT;
        let testingPairs, alice_addr;

        before(async () => {
            testingPairs = createTestPairs();
            alice_addr = deriveAddress(testingPairs.alice.publicKey, 8);
        });
        
        it("can fetch local blocks", async () => {
            const resp = JSON.stringify(await get(`${HOST}/blocks/0`));
            expect(JSON.parse(resp).number).to.contains(0);
            expect(JSON.parse(resp).finalized).to.equals(true);
        });

        it("can check head of chain", async () => {
            const resp = JSON.stringify(await get(`${HOST}/blocks/head`));
            expect(JSON.parse(resp).finalized).to.equals(true);
        });

        it("can check Account Balances", async () => {
            const resp = JSON.stringify(await get(`${HOST}/accounts/${alice_addr}/balance-info`));
            let bal = Number(JSON.parse(resp).free);
            let sym = JSON.parse(resp).tokenSymbol;
            expect(bal).to.be.greaterThan(100000000);
            expect(sym).to.be.equals("KAR");
        });

        it("can validate adddress encoding", async () => {
            const resp = JSON.stringify(await get(`${HOST}/accounts/${alice_addr}/validate`));
            expect(JSON.parse(resp).isValid).to.be.true;
            expect(Number(JSON.parse(resp).ss58Prefix)).to.equals(8);
        });

        it("can fetch runtime spec", async () => {
            const resp = JSON.stringify(await get(`${HOST}/runtime/spec`));
            let json = JSON.parse(resp);
            expect(json.specName).to.contains("karura");
            expect(json.properties.ss58Format).to.contains("8");
            expect(json.properties.tokenSymbol).to.include.members(["KAR","KUSD","KSM","LKSM"]);
        });

        it("can check fetch metadata", async () => {
            const json = await get(`${HOST}/runtime/metadata`);
            let keys = Object.keys(json).length;
            expect(keys).to.be.greaterThan(1);
        });

    })
}
