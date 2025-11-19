import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/context/ActiveUserContext';
import { ActionFeedbackToastsContext } from '@/context/ActionFeedbackToastsContext';

import { apiCall } from '../App';

interface Ticker {
    tickerSymbol: string;
    company: string;
    lastPrice: number;
}

function Tickers() {

    const [currentTickers, setCurrentTickers] = useState<Ticker[]>([]);
    const [searchBarValue, setSearchBarValue] = useState<string>('');

    const activeUserContext = useContext(UserContext);
    const actionFeedbackToastsContext = useContext(ActionFeedbackToastsContext);

    async function queryTickers() {
        apiCall(activeUserContext, actionFeedbackToastsContext, {
            endpoint: 'tickers',
            method: 'GET',
            params: {
                ...(searchBarValue.length > 0 && {'search_query': searchBarValue})
            }
        }, (data) => {
            setCurrentTickers(data);
        }, false);
    }

    // This effect runs whenever 'searchQuery' changes
    useEffect(() => {
        queryTickers();
    }, [searchBarValue])

    useEffect(() => {
        queryTickers();
    }, []); // The empty dependency array ensures this effect runs only once on mount

    function onSearchBarChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchBarValue((event.target as HTMLInputElement)?.value);

        // queryTickers();
    }

  return (
    <main>
        <h1 className='text-4xl font-bold mb-4'>Tickers</h1>
        <div className='mb-5 grid grid-cols-[auto_1fr] gap-5'>
            <span className='py-1 font-medium'>Search:</span>
            <Input onChange={onSearchBarChange} value={searchBarValue}></Input>
        </div>
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Ticker Symbol</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead className="text-right">Last Price</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {currentTickers.map((ticker) => (
            <TableRow key={ticker.tickerSymbol}>
                <TableCell className="font-medium">
                    <Link to={`/pricehistory/${ticker.tickerSymbol}`}>{ticker.tickerSymbol}</Link>
                </TableCell>
                <TableCell>{ticker.company}</TableCell>
                <TableCell className="text-right">{ticker.lastPrice}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </main>
  );
}

export default Tickers;