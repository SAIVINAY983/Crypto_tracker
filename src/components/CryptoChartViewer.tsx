import React, { useState } from 'react';
import { Cryptocurrency } from '../utils/cryptoApi';
import PriceChart from './PriceChart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CryptoChartViewerProps {
    cryptos: Cryptocurrency[];
}

const CryptoChartViewer: React.FC<CryptoChartViewerProps> = ({ cryptos }) => {
    const [selectedCryptoId, setSelectedCryptoId] = useState<string>(cryptos[0]?.id || 'bitcoin');

    const selectedCrypto = cryptos.find(c => c.id === selectedCryptoId) || cryptos[0];

    if (!selectedCrypto) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Detailed Price Chart</h2>
                <div className="w-[200px]">
                    <Select value={selectedCryptoId} onValueChange={setSelectedCryptoId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent>
                            {cryptos.map((crypto) => (
                                <SelectItem key={crypto.id} value={crypto.id}>
                                    <div className="flex items-center gap-2">
                                        <img src={crypto.image} alt={crypto.name} className="w-4 h-4" />
                                        {crypto.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <PriceChart
                cryptoId={selectedCrypto.id}
                name={selectedCrypto.name}
                symbol={selectedCrypto.symbol}
                priceChange={selectedCrypto.price_change_percentage_24h}
            />
        </div>
    );
};

export default CryptoChartViewer;
