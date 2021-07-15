import React from 'react';
import classNames from 'classnames';

export function UsersBalanceMonitor(props: {
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

export function UsersMonitor(props: {
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

export function UserCard(props: {
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
