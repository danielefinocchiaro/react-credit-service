import React, { useState, useEffect } from 'react';

import { GraphQLClient, gql } from 'graphql-request';

import __ from 'lodash/fp';
import _, { values } from 'lodash';
/*
import { v4 } from 'uuid';

import * as Blueprint from '@blueprintjs/core';
import * as Icons from 'react-icons/all'; 

import 'normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
*/
import classNames from 'classnames';
import { DateTime } from 'luxon';

interface Users {
  items: User[];
}

interface User {
  userId: string;
}

interface UserTransactions {
  items: UserTransaction[];
}

interface UserTransaction {
  id: string;
  amount: number;
  userId: string;
  time: string;
  creditDate: string;
  delayed: boolean;
}

async function getQuery(str: string) {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';
  const query = gql`
    ${str}
  `;
  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data;
  });
  return await graph;
}

async function doMutation(str: string) {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';
  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const mutation = gql`
    ${str}
  `;
  const graph = client.request(mutation).then((data) => {
    return data;
  });
  return await graph;
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

  return (
    <>
      <UsersMonitor
        userSelected={userSelected}
        data={userToPrint}
        onClick={setUserSelected}
      />
      <BtnAll onClick={setUserSelected} />
      <TransactionMonitor data={dataTransaction} />
      <UsersBalanceMonitor
        userBalance={userBalance}
        userSelected={userSelected}
      />
      <hr />
      <h1 className="text-8xl text-center p-8">Emit transaction</h1>
      <TransactionEmissionPanel />
    </>
  );
}

export default App;

function TransactionEmissionPanel() {
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
          className="border-2 border-cyan-600 rounded-lg p-2 hover:bg-cyan-600 hover:border-cyan-400 hover:text-white"
          onClick={() => {
            doMutation(`mutation{
            earnCredits(id:"${emitAccount}",amount:${emitAmount})
          }`);
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}

function UsersBalanceMonitor(props: {
  userSelected: string;
  userBalance: number;
}) {
  if (props.userSelected !== 'all') {
    return (
      <div className="border-cyan-600 border-2 rounded-l-lg m-4 ml-60 mr-0 mt-12 h-20 text-lg flex items-center p-2 shadow-lg">
        The account balance of {props.userSelected} is {props.userBalance} €
      </div>
    );
  } else {
    return <></>;
  }
}

function UsersMonitor(props: {
  data: string[];
  userSelected: string;
  onClick: (val: string) => void;
}) {
  return (
    <div className="border-cyan-600 border-2 rounded-l-lg shadow-lg m-4 ml-60 mr-0">
      {props.data.map((user, i) => {
        return (
          <UserCard
            userSelected={props.userSelected}
            user={user}
            key={i}
            onClick={props.onClick}
          />
        );
      })}
    </div>
  );
}

function UserCard(props: {
  user: string;
  userSelected: string;
  onClick: (val: string) => void;
}) {
  const classText = classNames(
    'flex flex-row-reverse shadow-sm p-6 hover:bg-gray-50 transform transition duration-100 hover:scale-99 cursor-pointer',
    props.userSelected === props.user ? 'bg-gray-200' : 'bg-transparent',
  );
  return (
    <div className={classText} onClick={() => props.onClick(props.user)}>
      <div className="text-black text-lg">{props.user}</div>
    </div>
  );
}

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

function Transaction(props: { transaction: UserTransaction }) {
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

function BtnAll(props: { onClick: (val: string) => void }) {
  return (
    <div className="flex flex-row-reverse">
      <button
        className="border-cyan-600 rounded-md border-2 p-2 text-lg text-red-500 m-4"
        onClick={() => props.onClick('all')}
      >
        Show All
      </button>
    </div>
  );
}
