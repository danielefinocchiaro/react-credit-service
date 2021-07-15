import React, { useState, useEffect } from 'react';

import __ from 'lodash/fp';
import _ from 'lodash';

import * as Blueprint from '@blueprintjs/core';

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import { Pagination } from './Pagination';
import { TransactionEmissionPanel } from './Transaction';

import { getQuery } from './GraphQLFunctions';
import { UsersBalanceMonitor, UsersMonitor } from './Users';

interface Users {
  items: User[];
}

interface User {
  userId: string;
}

export interface UserTransactions {
  items: UserTransaction[];
}

export interface UserTransaction {
  id: string;
  amount: number;
  userId: string;
  time: string;
  creditDate: string;
  delayed: boolean;
}

function App() {
  const [dataTransaction, setDataTransaction] = useState<UserTransactions>({
    items: [],
  });
  const [dataUser, setDataUser] = useState<Users>({ items: [] });
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userSelected, setUserSelected] = useState<string>('all');
  useEffect(async () => {
    if (userSelected === 'all') {
      const result1 = await getQuery(`
      query {
        userTransactions(limit: 100) {
          items {
            id
            amount
            userId
            time
            creditDate
            delayed
          }
        }
      }
    `);
      const result2 = await getQuery(`query{userTransactions{items{userId}}}`);
      setDataTransaction(result1.userTransactions);
      setDataUser(result2.userTransactions);
    } else {
      const result1 = await getQuery(`query{
        userTransactions(filters:{filters:[{attributeName:"userId",filters:[{op:"=",value:"${userSelected}"}]}]}) {
          items{
            id
            amount
            userId
            time
            creditDate
            delayed
          }
        }
      }`);
      const result2 = await getQuery(`query{userTransactions{items{userId}}}`);
      const result3 = await getQuery(
        `query{getUserBalance(id:"${userSelected}")}`,
      );
      setUserBalance(result3.getUserBalance);
      setDataTransaction(result1.userTransactions);
      setDataUser(result2.userTransactions);
    }
  }, [userSelected]);

  let userToPrint: string[] = [];
  dataUser.items.map((user) => {
    if (!userToPrint.includes(user.userId)) {
      userToPrint.push(user.userId);
    }
  });

  let toaster: Blueprint.Toaster;
  let refHandlers = (ref: Blueprint.Toaster) => {
    toaster = ref;
  };

  let addToast = () => {
    toaster.show({ message: 'Added!', intent: 'success' });
  };

  return (
    <>
      <Blueprint.Toaster position={Blueprint.Position.TOP} ref={refHandlers} />
      <UsersMonitor
        userSelected={userSelected}
        data={userToPrint}
        onClick={setUserSelected}
      />
      <BtnAll onClick={setUserSelected} />
      <Pagination data={dataTransaction} pageLimit={5} dataLimit={8} />
      <UsersBalanceMonitor
        userBalance={userBalance}
        userSelected={userSelected}
      />
      <hr />
      <h1 className="text-8xl text-center p-8">Emit transaction</h1>
      <TransactionEmissionPanel handleToast={addToast} />
    </>
  );
}

export default App;

function BtnAll(props: { onClick: (val: string) => void }) {
  return (
    <div className="flex flex-row-reverse">
      <button
        className="border-cyan-600 rounded-md border-2 p-2 text-lg text-red-500 m-4 cursor-pointer hover:bg-red-500 hover:text-white focus:outline-white"
        onClick={() => props.onClick('all')}
      >
        Show All
      </button>
    </div>
  );
}
