import React from 'react';
import './currentBalance.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import{
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import{Doughnut} from 'react-chartjs-2';
import PropTypes from 'prop-types';

function CurrentBalance(props) {

    ChartJS.register(ArcElement, Tooltip, Legend);
    
    /**
     * the pending balance of the user (in RU COINS)
     */
    const pendingBalance = props.currentBalancedata.pendingBalance;

    /**
     * the current balance of the user (in RU COINS)
     */
    const availibleBalance = props.currentBalancedata.availibleBalance;

    /**
     * data for the Doughnut Chart
     */
    const data = {
      labels: ['Pending Balance', 'Availible Balance'],
      datasets: [
        {
          label: 'Balance Information',
          data: [pendingBalance, availibleBalance],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };


    return (
        <>
        <div className='Content'>
            
            <div className="walletCardStyling">
            <h5>Balance Information:</h5>
                <Doughnut
                data={data}
                >

                </Doughnut>
                <p className='pendingBalance'>Pending Balance: {pendingBalance} RU COINS</p>
                <p>Available balance: {availibleBalance} RU COINS</p>
            </div>


            </div>
        </>
    );

}

CurrentBalance.propTypes = {
  currentBalancedata: PropTypes.object, 
};



export default CurrentBalance;