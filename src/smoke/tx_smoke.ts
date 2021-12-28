import {
    construct,
    methods,
    getRegistry,
    TokenSymbol,
    deriveAddress,
    decode,
    TypeRegistry,
    KeyringPair,
} from '@acala-network/txwrapper-acala';
import { createTestPairs } from "@polkadot/keyring/testingPairs";
import dotenv from "dotenv";
import { expect } from "chai";
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { EXTRINSIC_VERSION } from '@polkadot/types/extrinsic/v4/Extrinsic';
import { rpc } from "../utils/comms";

dotenv.config();

export const TxTests = async () => {
    const NODE = process.env.RPC_ENDPOINT;
    let testingPairs, blockHash, genesisHash, metadataRpc, chainName, expectedTxHash, signingPayload, unsigned, aliceAddr, bobAddr;
    let registry: TypeRegistry;
    let alice: KeyringPair;
    let bob: KeyringPair;
          
    interface RuntimeVersion {
        specVersion: number;
        transactionVersion: number;
        specName: 'acala' | 'karura' | 'mandala';
    }

    interface Block {
        header: {
            number: number;
        };
    }

    describe("TxWrapper Tests", async () => {

        const amount = "900719";

        before(async () => {
            await cryptoWaitReady();
            testingPairs = createTestPairs();
            alice = testingPairs.alice;
            bob = testingPairs.bob;
            aliceAddr = deriveAddress(alice.publicKey, 8);
            bobAddr = deriveAddress(bob.publicKey, 8);

        })

        it("can read from via RPC", async () => {
            blockHash = await rpc(NODE, 'chain_getBlockHash');
            genesisHash = await rpc(NODE, 'chain_getBlockHash', [0]);
            metadataRpc = await rpc(NODE, 'state_getMetadata');
            chainName = await rpc(NODE, 'system_chain');

            expect(chainName, "Wrong chain name").to.contains("Acala Karura Dev");
        })

        it("can sign a message offline", async () => {
            const { block } = await rpc<{ block: Block }>(NODE, 'chain_getBlock');
            const { specVersion, transactionVersion, specName } =
                await rpc<RuntimeVersion>(NODE, 'state_getRuntimeVersion');
            registry = getRegistry({
                chainName,
                specName,
                specVersion,
                metadataRpc
            });
            unsigned = methods.currencies.transfer(
                {
                    amount: amount,
                    currencyId: { Token: TokenSymbol.KAR },
                    dest: bobAddr
                },
                {
                    address: bobAddr,
                    blockNumber: registry
                        .createType('BlockNumber', block.header.number)
                        .toNumber(),
                    blockHash,
                    eraPeriod: 64,
                    genesisHash,
                    metadataRpc,
                    nonce: 4,
                    specVersion,
                    tip: 0,
                    transactionVersion
                },
                {
                    metadataRpc,
                    registry
                }
            );
            signingPayload = construct.signingPayload(unsigned, { registry });

            expect(unsigned).to.not.be.undefined;
            expect(signingPayload).to.not.be.undefined;
        });

        it("can decoded payload contents accurately", async () => {
            const payloadInfo = decode(signingPayload, {
                metadataRpc,
                registry
            });

            const destination = JSON.stringify(payloadInfo.method.args.dest);
            const amount = JSON.stringify(payloadInfo.method.args.amount);
            const ccyId = JSON.stringify(payloadInfo.method.args.currencyId);

            //console.log(JSON.stringify(payloadInfo.method));
            expect(destination).to.contains(bobAddr);
            expect(amount).to.equals(amount);
            expect(JSON.parse(ccyId).token).to.equals("KAR");
        });

        it("can send transactions as expected", async () => {

            const signature = registry
                .createType('ExtrinsicPayload', signingPayload, {
                    version: EXTRINSIC_VERSION
                })
                .sign(alice);

            const tx = construct.signedTx(unsigned, signature.signature, {
                metadataRpc,
                registry
            });

            expectedTxHash = construct.txHash(tx);
            const hash = await rpc(NODE, 'author_submitExtrinsic', [tx]);

            console.log(`Expected hash: ${expectedTxHash}`);
            console.log(`Tx hash: ${hash}`);
        })

    })


}