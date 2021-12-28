import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { tradingPairStatus,getTokenBal,connect, greeter, getBal, transfer, transferToken } from "../utils/callers";
import { sleep, waitForBlock, injectFreeTokens, toHumanNumbers } from "../utils/helpers";
import dotenv from "dotenv";
import { expect } from "chai";
import { ApiPromise } from "@polkadot/api";

dotenv.config();
export const ApiTests = async () => {

    describe("Basic Acala-js smoke tests 🚀", () => {
        let conn: ApiPromise, testingPairs;
        let balBefore;

        before(async () => {
            process.stdout.write(`\tPerforming setup tasks..`);
            conn = await connect();
            testingPairs = createTestPairs();
            // await injectFreeTokens(conn,testingPairs.alice,testingPairs.alice.address);
            // await waitForBlock(conn);
            process.stdout.write(`....Done\n`);
        });

        it(`connects to test blockchain`, async () => {
            const msg = await greeter(conn);
            expect(msg).to.contains("Acala Karura Dev");
        });

        it(`can query account balances`, async () => {
            const address = testingPairs.alice.address;
            balBefore = await getBal(conn, address);
            expect(Number(balBefore.toString())).to.be.greaterThan(0);
        });

        it(`can query token balances`, async () => {
            const address = testingPairs.alice.address;
            const tokenBal = await getTokenBal(conn, address,"KAR");
            // expect(Number(tokenBal.toString())).to.be.greaterThan(1);
        });

        it(`can do network balance transfers`, async () => {
            const signer = testingPairs.alice;
            const recipient_addr = testingPairs.bob.address;
            const amt = "13370000000000"
            const hash = await transfer(conn, signer, recipient_addr, amt);
            expect(hash).to.not.be.undefined;
            await waitForBlock(conn);

            const balAfter = await getBal(conn, signer.address);
            expect(Number(balAfter.toString())).to.be.lessThan(balBefore);
        })

        it(`can query a trading pair status`, async () => {
            const json = JSON.stringify(await tradingPairStatus(conn));
            const status = Object.keys(JSON.parse(json));
            expect(status).to.contains("disabled");
        });

        it(`can perform token transfers`, async () => {
            const signer = testingPairs.alice;
            const recipient_addr = testingPairs.bob.address;
            const token = "KUSD";
            const amt = await toHumanNumbers(conn,token,3);
            const bal_before = await getTokenBal(conn, recipient_addr,"KAR");

            const hash = await transferToken(conn,signer,recipient_addr,amt,token);

            expect(hash).to.not.be.undefined;
            await waitForBlock(conn);
            const bal_after = await getTokenBal(conn, recipient_addr,"KAR");
            // console.log(bal_after.free);
            //expect(Number(balAfter.toString())).to.be.moreThan(token_bal_before);
        });


        after(async () => {
            conn.disconnect();
        })

    })

}