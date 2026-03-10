import React from 'react';

interface Transaction {
    id: string;
    type: 'BUY' | 'SELL';
    amount: number;
    priceAtTransaction: number;
    createdAt: string;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
    symbol: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, symbol }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-sm text-muted-foreground italic py-2">
                No transaction history available.
            </div>
        );
    }

    return (
        <div className="mt-3 space-y-2">
            <h4 className="text-sm font-semibold text-foreground/80 mb-2">History</h4>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center bg-background/50 p-2 rounded border border-border/30 text-sm">
                        <div className="flex flex-col">
                            <span className={`font-bold ${tx.type === 'BUY' ? 'text-crypto-positive' : 'text-crypto-negative'}`}>
                                {tx.type} {tx.amount} {symbol.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold">${tx.priceAtTransaction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                            <div className="text-xs text-muted-foreground">per coin</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
