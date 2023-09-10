
export type WalletDashboardData = {
    chart: WalletChart;
    savings: WalletSavings;
    planned: WalletPlanned;
    detail: WalletDetail[];
}

export type WalletChart = {
    balance: Map<string, number>;
    last_year_expenses: Map<string, number>;
    ytd_expenses: Map<string, number>;
    pie: string
}

export type WalletSavings = {
    dbs: number;
    bca: number;
}

export type WalletPlanned = {
    sgd: number;
    idr: number;
}

export type WalletDetail = {
    id: number;
    date: number;
    name: string;
    category: string;
    currency: string;
    amount: number;
    done: boolean;
    account: string;
}