import {
  Token,
  SignExecuteScriptTxResult,
  Script,
  SignerProvider,
} from "@alephium/web3";

export class GreeterMain {
  private constructor() {}

  static async execute(
    signer: SignerProvider,
    greeterContractId: string,
    _extraParams?: {
      attoAlphAmount?: bigint;
      tokens?: Token[];
      gasAmount?: number;
      gasPrice?: bigint;
    }
  ): Promise<SignExecuteScriptTxResult> {
    const script = Script.fromJson(
      JSON.parse(`{
  "version": "v1.7.0",
  "name": "GreeterMain",
  "bytecodeTemplate": "01010300020014{0}17000c0d160001000d2f0c7b{0}17010c0d160101000d2f0c7b",
  "fieldsSig": {
    "names": [
      "greeterContractId"
    ],
    "types": [
      "ByteVec"
    ],
    "isMutable": [
      false
    ]
  },
  "functions": [
    {
      "name": "main",
      "usePreapprovedAssets": true,
      "useAssetsInContract": false,
      "isPublic": true,
      "paramNames": [],
      "paramTypes": [],
      "paramIsMutable": [],
      "returnTypes": []
    }
  ]
}`)
    );
    return script.execute(signer, {
      initialFields: { greeterContractId: greeterContractId },
      attoAlphAmount: _extraParams?.attoAlphAmount,
      tokens: _extraParams?.tokens,
      gasAmount: _extraParams?.gasAmount,
      gasPrice: _extraParams?.gasPrice,
    });
  }
}

export class Main {
  private constructor() {}

  static async execute(
    signer: SignerProvider,
    addContractId: string,
    _extraParams?: {
      attoAlphAmount?: bigint;
      tokens?: Token[];
      gasAmount?: number;
      gasPrice?: bigint;
    }
  ): Promise<SignExecuteScriptTxResult> {
    const script = Script.fromJson(
      JSON.parse(`{
  "version": "v1.7.0",
  "name": "Main",
  "bytecodeTemplate": "0101030001000a{0}17000e0d0e0e160001001818",
  "fieldsSig": {
    "names": [
      "addContractId"
    ],
    "types": [
      "ByteVec"
    ],
    "isMutable": [
      false
    ]
  },
  "functions": [
    {
      "name": "main",
      "usePreapprovedAssets": true,
      "useAssetsInContract": false,
      "isPublic": true,
      "paramNames": [],
      "paramTypes": [],
      "paramIsMutable": [],
      "returnTypes": []
    }
  ]
}`)
    );
    return script.execute(signer, {
      initialFields: { addContractId: addContractId },
      attoAlphAmount: _extraParams?.attoAlphAmount,
      tokens: _extraParams?.tokens,
      gasAmount: _extraParams?.gasAmount,
      gasPrice: _extraParams?.gasPrice,
    });
  }
}
