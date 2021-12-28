import { options } from "@acala-network/api";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import dotenv from "dotenv";

dotenv.config();

export const connect = async () => {
  const provider = new WsProvider(process.env.WS_NODE_ENDPOINT);
  const api = new ApiPromise(options({ provider }));
  await api.isReadyOrError;

  return api
}

export const transfer = async (_api: ApiPromise, _signer: KeyringPair, _recepient: string, _amt: string) => {
  const hash = await _api.tx.currencies
    .transfer(
      _recepient,
      {
        Token: "KAR",
      },
      _amt
    ).signAndSend(_signer);

  console.log("\tTransfer sent with hash", hash.toHex());

  return hash.toString()
}

export const transferToken = async (_api: ApiPromise, _signer: KeyringPair, _recepient: string, _amt: number, _sym: string) => {
  const token = {TOKEN:_sym} 
  const extrinsic = _api.tx.currencies.transfer(_recepient, token, _amt);
  const hash = await extrinsic.signAndSend(_signer);

  console.log("\tTransfer sent with hash", hash.toHex());

  return hash.toString()
}

export const getBal = async (_api: ApiPromise, _acc: string) => {
  const accountData = await _api.query.system.account(_acc);
  const json = JSON.parse(accountData.toString()).data;
  console.log(`\tBalance of ${_acc} is ${json.free}`);

  return json.free
}

export const getAllTokenBal = async (_api: ApiPromise, _acc: string) => {
  const tokenData = await _api.query.tokens.accounts(_acc,{});
  const json = JSON.parse(tokenData.toString());
  console.log(json);

  return tokenData
}

export const getTokenBal = async (_api: ApiPromise, _acc: string, _sym: string) => {
  const tokenData = await _api.query.tokens.accounts(_acc, {
    Token: _sym,
  });
  const json = JSON.stringify(tokenData)
  return JSON.parse(json)
}

export const tradingPairStatus = async (_api: ApiPromise) => {
  const status = await _api.query.dex.tradingPairStatuses([
    {
      TOKEN: "KAR"
    },
    {
      TOKEN: "KUSD",
    }
  ])

  return status
}

export const greeter = async (_api: ApiPromise) => {
  const [chain, nodeName, nodeVersion] = await Promise.all([
    _api.rpc.system.chain(),
    _api.rpc.system.name(),
    _api.rpc.system.version(),
  ]);

  console.log(
    `\tYou are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
  );

  return chain.toString()
}
