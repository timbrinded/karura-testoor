import {
    construct,
    methods,
  } from '@acala-network/txwrapper-acala';
  

  export async function unsignedTx(_destination: string, _value: number) {
    // const blob = methods.currencies.transfer();

    // return blob
}


//   const unsigned = methods.currencies.transfer(
//     {
//       dest: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
//       value: 100,
//     },
//     {
//       // Additional information needed to construct the transaction offline.
//     }
//   );
  
//   const signingPayload = construct.signingPayload(unsigned, { registry });
  
//   // On your offline device, sign the payload.
//   const signature = myOfflineSigning(signingPayload);
  
//   // Construct signed transaction ready to be broadcasted.
//   const tx = construct.signedTx(unsigned, signature, { metadataRpc, registry });