import { KeyringPair } from "@polkadot/keyring/types";
import { ApiPromise } from "@polkadot/api";

export function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
};

export async function toHumanNumbers(_api: ApiPromise, _sym: string, _amt: number){
    const { symbolsDecimals } = await getSystemParameters(_api);
    return (_amt * 10 ** symbolsDecimals[_sym])
}

const getSystemParameters = async (_api: ApiPromise) => {
    const params = await _api.rpc.system.properties();
    const decimals =
      !params.tokenDecimals.isNone && params.tokenDecimals.value.toHuman();
    const symbols =
      !params.tokenSymbol.isNone &&
      (params.tokenSymbol.value.toHuman() as string[]);
    const symbolsDecimals /* Record<string, string> */ = symbols.reduce(
      (acc, symbol, index) => ({
        ...acc,
        [symbol]: +decimals[index],
      }),
      {}
    );
    return {
      decimals,
      symbols,
      symbolsDecimals,
    };
  };

export async function waitForBlock(_conn: ApiPromise, _num: number = 2, _verbose: boolean = false) {
    const header = await _conn.rpc.chain.getHeader();
    console.log(`\tWaiting ${_num} blocks for TXN to finalise`);
    if (_verbose) console.log(`\tOriginal block #${header.number}`);
    while (true) {
        const block = await (await _conn.rpc.chain.getHeader());
        if (_verbose) console.log(`\tNew block #${block.number}`);
        if (Number(block.number) == Number(header.number) + _num) {
            break;
        }
        sleep(1000);
    };
}

export async function injectFreeTokens(_api: ApiPromise, _signer: KeyringPair, _addr: string) {
    const hash = _api.tx.sudo.sudo(_api.tx.currencies.updateBalance(
        {
            Id: _addr
        },
        {
            Token: "KAR"
        },
        1000000
    ));
    let txn = await hash.signAndSend(_signer);

    return txn

}

