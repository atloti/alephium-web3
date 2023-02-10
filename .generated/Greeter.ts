import {
  web3,
  Contract,
  SignerProvider,
  Address,
  Token,
  toApiVals,
  ContractState,
  node,
  binToHex,
  TestContractResult,
  InputAsset,
  Asset,
  Fields,
  SignDeployContractTxResult,
  contractIdFromAddress,
  fromApiArray,
} from "@alephium/web3";

export type _GreeterFields = {
  btcPrice: bigint;
};

export type _GreeterState = _GreeterFields & Omit<ContractState, "fields">;

export class Greeter {
  static readonly contract: Contract = Contract.fromJson(
    JSON.parse(`{
  "version": "v1.7.0",
  "name": "Greeter",
  "bytecode": "01010c010000000105030c7bce0002",
  "codeHash": "d8a1c2190c6c54f720608a4b264d1c648a9865e0744e942e489c87e64d4e596a",
  "fieldsSig": {
    "names": [
      "btcPrice"
    ],
    "types": [
      "U256"
    ],
    "isMutable": [
      false
    ]
  },
  "eventsSig": [],
  "functions": [
    {
      "name": "greet",
      "usePreapprovedAssets": false,
      "useAssetsInContract": false,
      "isPublic": true,
      "paramNames": [],
      "paramTypes": [],
      "paramIsMutable": [],
      "returnTypes": [
        "U256"
      ]
    }
  ]
}`)
  );

  readonly address: Address;
  readonly contractId: string;
  readonly groupIndex: number;
  deployResult: SignDeployContractTxResult | undefined;

  private constructor(
    address: Address,
    contractId: string,
    groupIndex: number,
    deployResult?: SignDeployContractTxResult
  ) {
    this.address = address;
    this.contractId = contractId;
    this.groupIndex = groupIndex;
    this.deployResult = deployResult;
  }

  static async deploy(
    signer: SignerProvider,
    btcPrice: bigint,
    _extraParams?: {
      initialAttoAlphAmount?: bigint;
      initialTokenAmounts?: Token[];
      issueTokenAmount?: bigint;
      gasAmount?: number;
      gasPrice?: bigint;
    }
  ): Promise<Greeter> {
    const _deployResult = await Greeter.contract.deploy(signer, {
      initialFields: { btcPrice: btcPrice },
      initialAttoAlphAmount: _extraParams?.initialAttoAlphAmount,
      initialTokenAmounts: _extraParams?.initialTokenAmounts,
      issueTokenAmount: _extraParams?.issueTokenAmount,
      gasAmount: _extraParams?.gasAmount,
      gasPrice: _extraParams?.gasPrice,
    });
    return new Greeter(
      _deployResult.contractAddress,
      _deployResult.contractId,
      _deployResult.fromGroup,
      _deployResult
    );
  }

  static connect(
    address: string,
    deployResult?: SignDeployContractTxResult
  ): Greeter {
    const contractId = binToHex(contractIdFromAddress(address));
    const groupIndex = parseInt(contractId.slice(-2));
    return new Greeter(address, contractId, groupIndex, deployResult);
  }

  async fetchState(): Promise<_GreeterState> {
    const state = await Greeter.contract.fetchState(
      this.address,
      this.groupIndex
    );
    return {
      ...state,
      btcPrice: state.fields["btcPrice"] as bigint,
    };
  }

  // This is used for testing contract functions
  static stateForTest(
    btcPrice: bigint,
    asset?: Asset,
    address?: string
  ): ContractState {
    const newAsset = {
      alphAmount: asset?.alphAmount ?? BigInt("1000000000000000000"),
      tokens: asset?.tokens,
    };
    return Greeter.contract.toState({ btcPrice: btcPrice }, newAsset, address);
  }

  static async testGreet(
    _initFields: _GreeterFields | Fields,
    _extraParams?: {
      group?: number;
      address?: string;
      initialAsset?: Asset;
      existingContracts?: ContractState[];
      inputAssets?: InputAsset[];
    }
  ): Promise<Omit<TestContractResult, "returns"> & { returns: [bigint] }> {
    const _initialAsset = {
      alphAmount:
        _extraParams?.initialAsset?.alphAmount ?? BigInt("1000000000000000000"),
      tokens: _extraParams?.initialAsset?.tokens,
    };
    const _testParams = {
      ..._extraParams,
      testMethodIndex: 0,
      testArgs: {},
      initialFields: _initFields as Fields,
      initialAsset: _initialAsset,
    };
    const _testResult = await Greeter.contract.testPublicMethod(
      "greet",
      _testParams
    );
    return { ..._testResult, returns: _testResult.returns as [bigint] };
  }

  async greetCall(_extraParams?: {
    worldStateBlockHash?: string;
    txId?: string;
    existingContracts?: string[];
    inputAssets?: node.TestInputAsset[];
  }): Promise<bigint> {
    const _callResult = await web3
      .getCurrentNodeProvider()
      .contracts.postContractsCallContract({
        group: this.groupIndex,
        worldStateBlockHash: _extraParams?.worldStateBlockHash,
        txId: _extraParams?.txId,
        address: this.address,
        methodIndex: 0,
        args: [],
        existingContracts: _extraParams?.existingContracts,
        inputAssets: _extraParams?.inputAssets,
      });
    return fromApiArray(_callResult.returns, ["U256"])[0] as bigint;
  }
}
