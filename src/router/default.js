import BoxedLayout from "Container/BoxedV2";

const MyWallets = () => import("Views/mywallets/List");
const TransactionRecords = () => import("Views/transactions/Records");

export default {
    path: "/",
    component: BoxedLayout,
    redirect: "/default/mywallets/list",
    children: [
        {
            component: MyWallets,
            path: "/default/mywallets/list",
            meta: {
                equiresAuth: true,
                title: "message.mywallets",
                breadcrumb: [
                    {
                        title: "message.importWallet",
                        action: "importWallet",
                        color: "default"
                    },
                    {
                        title: "message.createWallet",
                        action: "newWallet",
                        color: "primary"
                    }
                ]
            }
        },
        {
            component: TransactionRecords,
            path: "/default/transactions/Records",
            meta: {
                requiresAuth: true,
                title: "message.transactionsRecordsTitle",
                breadcrumb: [
                    {
                        title: "message.sendTransaction",
                        action: "newTransaction",
                        color: "success"
                    }
                ]
            }
        }
    ]
};
