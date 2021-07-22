import React, { useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';
import type { UserTransaction, UserTransactions } from './App';
import { doMutation, getQuery, getSubscribe } from './GraphQLFunctions';

import type { Intent } from '@blueprintjs/core';

function TransactionMonitor(props: { data: UserTransactions }) {
  return (
    <div className="border-cyan-600 border-2 rounded-r-lg shadow-lg m-4 mr-60 ml-0">
      <div className="flex flex-col">
        {props.data.items.map((transaction, i) => {
          return <Transaction key={i} transaction={transaction} />;
        })}
      </div>
    </div>
  );
}

export function Transaction(props: { transaction: UserTransaction }) {
  let dateOperation = DateTime.fromISO(props.transaction.creditDate);
  const classText = classNames(
    'my-4 p-2 text-lg',
    props.transaction.amount > 0 ? 'text-green-500' : 'text-red-500',
  );
  return (
    <div className="flex shadow-sm hover:bg-gray-50 transform transition duration-100 hover:scale-99 cursor-default">
      <div className="flex flex-col flex-grow justify-around p-1">
        <div className=" text-gray-400">
          {dateOperation.toFormat('yyyy LLL dd')}
        </div>
        <div className=" text-black">{props.transaction.id}</div>
      </div>

      <div className={classText}>{props.transaction.amount} €</div>
    </div>
  );
}

export function TransactionAddPanel(props: {
  handleToast: (props: { message: string; type: Intent }) => void;
}) {
  const [emitAmount, setEmitAmount] = useState<number>(0);
  const [emitAccount, setEmitAccount] = useState<string>('');
  return (
    <div className="border-cyan-600 border-2 rounded-lg shadow-lg m-4 mx-80 p-16 flex flex-col">
      <div className="flex justify-around">
        <div className="p-4 flex flex-col items-center">
          <label className="text-lg">Account</label>
          <input
            type="text"
            className="border-cyan-600 border-2 rounded-md w-44 p-2 text-center"
            placeholder="Account Name"
            onChange={(event) => setEmitAccount(event.target.value)}
          />
        </div>
        <div className="p-4 flex flex-col items-center">
          <label className="text-lg">Amount</label>
          <input
            type="number"
            min="0"
            max="9999"
            className="border-cyan-600 border-2 rounded-md w-44 p-2 text-center"
            placeholder="Credits Amount"
            onChange={(event) => setEmitAmount(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-6">
        <input
          value="Emit Payament"
          type="submit"
          className="border-2 border-cyan-600 bg-white rounded-lg p-2 cursor-pointer hover:bg-cyan-600 hover:border-cyan-400 hover:text-white"
          onClick={async () => {
            const responseString = await doMutation(`mutation{
              earnCredits(id:"${emitAccount}",amount:${emitAmount})
            }`);

            const subscribedEvent = await getSubscribe(
              responseString.earnCredits,
            );
            console.log(subscribedEvent);

            if (subscribedEvent.type === 'CREDITS_EARNED')
              props.handleToast({ message: 'Succes!', type: 'success' });
            //window.location.reload();
          }}
        />
      </div>
    </div>
  );
}

export function TransactionRemovePanel(props: {
  handleToast: (props: { message: string; type: Intent }) => void;
}) {
  const [emitAmount, setEmitAmount] = useState<number>(0);
  const [emitAccount, setEmitAccount] = useState<string>('');
  return (
    <div className="border-cyan-600 border-2 rounded-lg shadow-lg m-4 mx-80 p-16 flex flex-col">
      <div className="flex justify-around">
        <div className="p-4 flex flex-col items-center">
          <label className="text-lg">Account</label>
          <input
            type="text"
            className="border-cyan-600 border-2 rounded-md w-44 p-2 text-center"
            placeholder="Account Name"
            onChange={(event) => setEmitAccount(event.target.value)}
          />
        </div>
        <div className="p-4 flex flex-col items-center">
          <label className="text-lg">Amount</label>
          <input
            type="number"
            min="0"
            max="9999"
            className="border-cyan-600 border-2 rounded-md w-44 p-2 text-center"
            placeholder="Credits Amount"
            onChange={(event) => setEmitAmount(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-6">
        <input
          value="Emit Payament"
          type="submit"
          className="border-2 border-cyan-600 bg-white rounded-lg p-2 cursor-pointer hover:bg-cyan-600 hover:border-cyan-400 hover:text-white"
          onClick={async () => {
            const responseString = await doMutation(`mutation{
              useCredits(id:"${emitAccount}",amount:${emitAmount})
            }`);

            const subscribedEvent = await getSubscribe(
              responseString.useCredits,
            );

            if (subscribedEvent.type === 'CREDITS_USED')
              props.handleToast({ message: 'Removed!', type: 'success' });
            else
              props.handleToast({
                message: subscribedEvent.data.type || 'Error',
                type: 'danger',
              });
            //window.location.reload();
          }}
        />
      </div>
    </div>
  );
}
