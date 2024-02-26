import React from 'react';
import './wallet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CurrentBalance from './currentBalance/currentBalance';
import BalanceHistoryGraph from './balanceHistoryGraph/balanceHistoryGraph';
import PurchaseCoins from './purchaseCoins/purchaseCoins';
import TransactionHistory from './transactionHistory/transactionHistory';


/**
 * 
 * wallet page- contains current balance, analytics
 * 
 * @returns none
 */
function Wallet() {




    return (
        <>
            <div className="CenterContent">
                <div className='leftSideContent'>
                    <CurrentBalance />
                    <div className='transHistCard'>
                    <TransactionHistory />
                    </div>
                    <div className='purchaseCard'>
                    <PurchaseCoins/>
                    </div>

                </div>
                <div className='rightSideContent'>
                    <BalanceHistoryGraph />
                </div>
                
            </div>
            
        </>
    );

}

export default Wallet;