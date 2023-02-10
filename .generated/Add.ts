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
  fromApiVals,
  subscribeToEvents,
  SubscribeOptions,
  Subscription,
  EventSubscription,
} from "@alephium/web3";

export interface AddAdd {
  blockHash: string;
  txId: string;
  eventIndex: number;
  x: bigint;
  y: bigint;
}

export interface AddAdd1 {
  blockHash: string;
  txId: string;
  eventIndex: number;
  a: bigint;
  b: bigint;
}

export type _AddFields = {
  sub: string;
  result: bigint;
};

export type _AddState = _AddFields & Omit<ContractState, "fields">;

export class Add {
  static readonly contract: Contract = Contract.fromJson(
    JSON.parse(`{
  "version": "v1.7.0",
  "name": "Add",
  "bytecode": "02020d40360100020402041600160100010200000202021605160016015f06160016015fa00016002a16012aa100a000160016010e0dce00010002",
  "codeHash": "52d5893e97ce6b8d67d90fe1c51735e6e4f9946de732926fd160a0b50774f61b",
  "fieldsSig": {
    "names": [
      "sub",
      "result"
    ],
    "types": [
      "ByteVec",
      "U256"
    ],
    "isMutable": [
      false,
      true
    ]
  },
  "eventsSig": [
    {
      "name": "Add",
      "fieldNames": [
        "x",
        "y"
      ],
      "fieldTypes": [
        "U256",
        "U256"
      ]
    },
    {
      "name": "Add1",
      "fieldNames": [
        "a",
        "b"
      ],
      "fieldTypes": [
        "U256",
        "U256"
      ]
    }
  ],
  "functions": [
    {
      "name": "add",
      "usePreapprovedAssets": false,
      "useAssetsInContract": false,
      "isPublic": true,
      "paramNames": [
        "array"
      ],
      "paramTypes": [
        "[U256;2]"
      ],
      "paramIsMutable": [
        false
      ],
      "returnTypes": [
        "[U256;2]"
      ]
    },
    {
      "name": "addPrivate",
      "usePreapprovedAssets": false,
      "useAssetsInContract": false,
      "isPublic": false,
      "paramNames": [
        "array"
      ],
      "paramTypes": [
        "[U256;2]"
      ],
      "paramIsMutable": [
        false
      ],
      "returnTypes": [
        "[U256;2]"
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
    sub: string,
    result: bigint,
    _extraParams?: {
      initialAttoAlphAmount?: bigint;
      initialTokenAmounts?: Token[];
      issueTokenAmount?: bigint;
      gasAmount?: number;
      gasPrice?: bigint;
    }
  ): Promise<Add> {
    const _deployResult = await Add.contract.deploy(signer, {
      initialFields: { sub: sub, result: result },
      initialAttoAlphAmount: _extraParams?.initialAttoAlphAmount,
      initialTokenAmounts: _extraParams?.initialTokenAmounts,
      issueTokenAmount: _extraParams?.issueTokenAmount,
      gasAmount: _extraParams?.gasAmount,
      gasPrice: _extraParams?.gasPrice,
    });
    return new Add(
      _deployResult.contractAddress,
      _deployResult.contractId,
      _deployResult.fromGroup,
      _deployResult
    );
  }

  static connect(
    address: string,
    deployResult?: SignDeployContractTxResult
  ): Add {
    const contractId = binToHex(contractIdFromAddress(address));
    const groupIndex = parseInt(contractId.slice(-2));
    return new Add(address, contractId, groupIndex, deployResult);
  }

  async fetchState(): Promise<_AddState> {
    const state = await Add.contract.fetchState(this.address, this.groupIndex);
    return {
      ...state,
      sub: state.fields["sub"] as string,
      result: state.fields["result"] as bigint,
    };
  }

  private decodeAdd(event: node.ContractEvent): AddAdd {
    if (event.eventIndex !== 0) {
      throw new Error(
        "Invalid event index: " + event.eventIndex + ", expected: 0"
      );
    }
    const fields = fromApiVals(event.fields, ["x", "y"], ["U256", "U256"]);
    return {
      blockHash: event.blockHash,
      txId: event.txId,
      eventIndex: event.eventIndex,
      x: fields["x"] as bigint,
      y: fields["y"] as bigint,
    };
  }

  subscribeAdd(
    options: SubscribeOptions<AddAdd>,
    fromCount?: number
  ): EventSubscription {
    const messageCallback = (event: node.ContractEvent): Promise<void> => {
      if (event.eventIndex !== 0) {
        return Promise.resolve();
      }
      return options.messageCallback(this.decodeAdd(event));
    };

    const errorCallback = (
      err: any,
      subscription: Subscription<node.ContractEvent>
    ): Promise<void> => {
      return options.errorCallback(
        err,
        subscription as unknown as Subscription<AddAdd>
      );
    };
    const opt: SubscribeOptions<node.ContractEvent> = {
      pollingInterval: options.pollingInterval,
      messageCallback: messageCallback,
      errorCallback: errorCallback,
    };
    return subscribeToEvents(opt, this.address, fromCount);
  }

  private decodeAdd1(event: node.ContractEvent): AddAdd1 {
    if (event.eventIndex !== 1) {
      throw new Error(
        "Invalid event index: " + event.eventIndex + ", expected: 1"
      );
    }
    const fields = fromApiVals(event.fields, ["a", "b"], ["U256", "U256"]);
    return {
      blockHash: event.blockHash,
      txId: event.txId,
      eventIndex: event.eventIndex,
      a: fields["a"] as bigint,
      b: fields["b"] as bigint,
    };
  }

  subscribeAdd1(
    options: SubscribeOptions<AddAdd1>,
    fromCount?: number
  ): EventSubscription {
    const messageCallback = (event: node.ContractEvent): Promise<void> => {
      if (event.eventIndex !== 1) {
        return Promise.resolve();
      }
      return options.messageCallback(this.decodeAdd1(event));
    };

    const errorCallback = (
      err: any,
      subscription: Subscription<node.ContractEvent>
    ): Promise<void> => {
      return options.errorCallback(
        err,
        subscription as unknown as Subscription<AddAdd1>
      );
    };
    const opt: SubscribeOptions<node.ContractEvent> = {
      pollingInterval: options.pollingInterval,
      messageCallback: messageCallback,
      errorCallback: errorCallback,
    };
    return subscribeToEvents(opt, this.address, fromCount);
  }

  subscribeEvents(
    options: SubscribeOptions<AddAdd | AddAdd1>,
    fromCount?: number
  ): EventSubscription {
    const messageCallback = (event: node.ContractEvent): Promise<void> => {
      switch (event.eventIndex) {
        case 0: {
          return options.messageCallback(this.decodeAdd(event));
        }

        case 1: {
          return options.messageCallback(this.decodeAdd1(event));
        }

        default:
          throw new Error("Invalid event index: " + event.eventIndex);
      }
    };

    const errorCallback = (
      err: any,
      subscription: Subscription<node.ContractEvent>
    ): Promise<void> => {
      return options.errorCallback(
        err,
        subscription as unknown as Subscription<AddAdd | AddAdd1>
      );
    };
    const opt: SubscribeOptions<node.ContractEvent> = {
      pollingInterval: options.pollingInterval,
      messageCallback: messageCallback,
      errorCallback: errorCallback,
    };
    return subscribeToEvents(opt, this.address, fromCount);
  }

  // This is used for testing contract functions
  static stateForTest(
    sub: string,
    result: bigint,
    asset?: Asset,
    address?: string
  ): ContractState {
    const newAsset = {
      alphAmount: asset?.alphAmount ?? BigInt("1000000000000000000"),
      tokens: asset?.tokens,
    };
    return Add.contract.toState(
      { sub: sub, result: result },
      newAsset,
      address
    );
  }

  static async testAdd(
    args: { array: [bigint, bigint] },
    _initFields: _AddFields | Fields,
    _extraParams?: {
      group?: number;
      address?: string;
      initialAsset?: Asset;
      existingContracts?: ContractState[];
      inputAssets?: InputAsset[];
    }
  ): Promise<
    Omit<TestContractResult, "returns"> & { returns: [[bigint, bigint]] }
  > {
    const _initialAsset = {
      alphAmount:
        _extraParams?.initialAsset?.alphAmount ?? BigInt("1000000000000000000"),
      tokens: _extraParams?.initialAsset?.tokens,
    };
    const _testParams = {
      ..._extraParams,
      testMethodIndex: 0,
      testArgs: args,
      initialFields: _initFields as Fields,
      initialAsset: _initialAsset,
    };
    const _testResult = await Add.contract.testPublicMethod("add", _testParams);
    return {
      ..._testResult,
      returns: _testResult.returns as [[bigint, bigint]],
    };
  }

  static async testAddPrivate(
    args: { array: [bigint, bigint] },
    _initFields: _AddFields | Fields,
    _extraParams?: {
      group?: number;
      address?: string;
      initialAsset?: Asset;
      existingContracts?: ContractState[];
      inputAssets?: InputAsset[];
    }
  ): Promise<
    Omit<TestContractResult, "returns"> & { returns: [[bigint, bigint]] }
  > {
    const _initialAsset = {
      alphAmount:
        _extraParams?.initialAsset?.alphAmount ?? BigInt("1000000000000000000"),
      tokens: _extraParams?.initialAsset?.tokens,
    };
    const _testParams = {
      ..._extraParams,
      testMethodIndex: 1,
      testArgs: args,
      initialFields: _initFields as Fields,
      initialAsset: _initialAsset,
    };
    const _testResult = await Add.contract.testPrivateMethod(
      "addPrivate",
      _testParams
    );
    return {
      ..._testResult,
      returns: _testResult.returns as [[bigint, bigint]],
    };
  }

  async addCall(
    array: [bigint, bigint],
    _extraParams?: {
      worldStateBlockHash?: string;
      txId?: string;
      existingContracts?: string[];
      inputAssets?: node.TestInputAsset[];
    }
  ): Promise<[bigint, bigint]> {
    const _callResult = await web3
      .getCurrentNodeProvider()
      .contracts.postContractsCallContract({
        group: this.groupIndex,
        worldStateBlockHash: _extraParams?.worldStateBlockHash,
        txId: _extraParams?.txId,
        address: this.address,
        methodIndex: 0,
        args: toApiVals({ array: array }, ["array"], ["[U256;2]"]),
        existingContracts: _extraParams?.existingContracts,
        inputAssets: _extraParams?.inputAssets,
      });
    return fromApiArray(_callResult.returns, ["[U256;2]"])[0] as [
      bigint,
      bigint
    ];
  }
}
