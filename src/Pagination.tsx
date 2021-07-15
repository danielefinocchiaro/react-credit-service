import React, { BaseSyntheticEvent, useState } from 'react';
import type { UserTransactions } from './App';
import { Transaction } from './Transaction';

export function Pagination(props: {
  data: UserTransactions;
  pageLimit: number;
  dataLimit: number;
}) {
  const pages = Math.max(
    1,
    Math.round(props.data.items.length / props.dataLimit),
  );
  const [currentPage, setCurrentPage] = useState(1);

  function goToNextPage() {
    if (currentPage + 1 <= pages) {
      setCurrentPage(currentPage + 1);
    } else {
      return;
    }
  }

  function goToPreviousPage() {
    if (currentPage - 1 <= pages && currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      return;
    }
  }

  function changePage(event: BaseSyntheticEvent) {
    const pageNumber = Number(event.target.textContent);
    if (!isNaN(pageNumber)) {
      setCurrentPage(pageNumber);
    } else {
      return;
    }
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * props.dataLimit - props.dataLimit;
    const endIndex = startIndex + props.dataLimit;
    return props.data.items.slice(startIndex, endIndex);
  };

  const getPaginationGroup = () => {
    let start =
      Math.floor((currentPage - 1) / props.pageLimit) * props.pageLimit;
    return new Array(pages > props.pageLimit ? props.pageLimit : pages)
      .fill({})
      .map((_, i) => {
        let pageN = start + i + 1;
        if (pageN > pages) return '-';
        else return pageN;
      });
  };

  return (
    <>
      <div className="border-cyan-600 border-2 rounded-r-lg shadow-lg m-4 mr-60 ml-0">
        {getPaginatedData().map((transactionData, i) => (
          <Transaction key={i} transaction={transactionData} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1 ? true : false}
          className="text-xl text-cyan-500 p-3 cursor-pointer shadow-lg border-cyan-600 border-2 rounded-md m-4 text-center focus:outline-none disabled:text-blueGray-700 disabled:cursor-not-allowed disabled:border-blueGray-400 disabled:opacity-50"
        >
          Prev
        </button>

        {getPaginationGroup().map((page, i) => (
          <button
            key={i}
            onClick={changePage}
            className={`border-2 border-gray-300 p-3 px-4 rounded-full m-2 shadow-sm focus:outline-none ${
              currentPage === page
                ? 'border-cyan-600 text-xl font-bold shadow-xl'
                : null
            }`}
          >
            <span>{page}</span>
          </button>
        ))}

        <button
          onClick={goToNextPage}
          disabled={currentPage === pages ? true : false}
          className="text-xl text-cyan-500 p-3 cursor-pointer shadow-lg border-cyan-600 border-2 rounded-md m-4 text-center focus:outline-none disabled:text-blueGray-700 disabled:cursor-not-allowed disabled:border-blueGray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
