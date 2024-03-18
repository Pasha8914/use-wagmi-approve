<script setup lang="ts">
import { ref } from "vue";
import {
  useConfig,
  useConnect,
  useChainId,
  useDisconnect,
  useConnections,
  useWriteContract,
  useConnectorClient,
} from "use-wagmi";
import { watchAsset } from "viem/actions";
import { getConnectorClient } from "@wagmi/core";

const config = useConfig();
const chainId = useChainId();

const connections = useConnections();
const { disconnect } = useDisconnect();

const { data, error: clientError } = useConnectorClient();
const { connectors, connectAsync, status, error } = useConnect();

const { writeContract, error: writeError } = useWriteContract();

const approveAmount = ref("");
const contractAddress = ref("");
const tokenContractAddress = ref("");

const addAsset = async () => {
  const walletClient = await getConnectorClient(config);

  console.log(walletClient);
  return watchAsset(walletClient, {
    type: "ERC20",
    options: {
      address: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
      decimals: 18,
      symbol: "DAI",
    },
  });
};

const onApprove = () => {
  writeContract({
    abi: [
      {
        "constant": false,
        "inputs": [
          { "name": "_spender", "type": "address" },
          { "name": "_value", "type": "uint256" }
        ],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }] as const,
    functionName: "approve",
    address: tokenContractAddress.value as `0x${string}`,
    args: [contractAddress.value as `0x${string}`, BigInt(approveAmount.value)],
  });
};
</script>

<template>
  <div>
    <div>
      <h2>Connect</h2>
      <button
          v-for="connector in connectors"
          :key="connector?.uid"
          @click="
          () =>
            connector ? connectAsync({ connector, chainId }) : alert('ups')
        "
          type="button"
      >
        {{ connector.name }}
      </button>
      <div>{{ status }}</div>
      <div>{{ error?.message }}</div>
    </div>
    <div>
      <h2>Connector Client</h2>
      client {{ data?.account?.address }} {{ data?.chain?.id }}
      {{ clientError?.message }}
    </div>
    <div>
      <h2>Connections</h2>

      <div v-for="connection in connections" :key="connection.connector.uid">
        <div>connector {{ connection.connector.name }}</div>
        <div>accounts: {{ JSON.stringify(connection.accounts) }}</div>
        <div>chainId: {{ connection.chainId }}</div>
      </div>
    </div>
    <div>
      <h2>Add Asset</h2>
      <div>
        <button type="button" @click="addAsset">Add DAI</button>
      </div>
    </div>
    <div>
      <h2>Approve</h2>
      <form>
        <label>Spender</label>
        <br />
        <input
            placeholder="0x"
            :value="contractAddress"
            @input="contractAddress = $event.target.value"
        />
      </form>
      <form>
        <label>Token</label>
        <br />
        <input
            placeholder="0x"
            :value="tokenContractAddress"
            @input="tokenContractAddress = $event.target.value"
        />
      </form>
      <form>
        <label>Amount</label>
        <br />
        <input
            placeholder="100000000"
            :value="approveAmount"
            @input="approveAmount = $event.target.value"
        />
      </form>
      <div>
        <button type="button" @click="onApprove">Approve</button>
        <div v-if="writeError">{{ writeError.message }}</div>
      </div>
    </div>
    <div>
      <h2>Disconnect</h2>
      <div>
        <button type="button" @click="disconnect">disconnect</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
