import { http, createConfig } from "use-wagmi";
import { sepolia } from "use-wagmi/chains";
import { injected, walletConnect } from "use-wagmi/connectors";

export const config = createConfig({
    chains: [sepolia],
    connectors: [
        injected(),
        walletConnect({
            projectId: "983bf7efbc12ef7eeac5ac1378f164d6",
            showQrModal: true,
        }),
    ],
    transports: {
        [sepolia.id]: http(),
    },
});

declare module "use-wagmi" {
    interface Register {
        config: typeof config;
    }
}
