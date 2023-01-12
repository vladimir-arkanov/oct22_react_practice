import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Product {
  id: number,
  name: string,
  categoryId: number,
}

export interface Categories {
  id: number,
  title: string,
  icon: string,
  ownerId: number
}

export interface PreparedCategories extends Categories {
  user?: User | null,
  products: Product[],
}

const preparedCategories: PreparedCategories[] | null = (
  categoriesFromServer.map(category => {
    const user = usersFromServer.find(person => person.id === category.ownerId);
    const products = productsFromServer.filter(product => (
      product.categoryId === category.id));

    return {
      ...category,
      products,
      user,
    };
  }));

export const App: React.FC = () => {
  const [productSearch, setProductSearch] = useState('');
  const [activeClass, setActiveClass] = useState(false);

  function isActive() {
    setActiveClass(true);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setProductSearch(value);
  };

  const visibleProducts = productsFromServer.filter(product => {
    const title = product.name.toLowerCase();
    const editedProductName = productSearch.toLowerCase().trim();

    return title.includes(editedProductName);
  });

  const reset = () => {
    setProductSearch('');
  };

  function handleDelete() {
    reset();
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={!activeClass
                  ? 'is-active'
                  : ''}
              >
                All
              </a>
              {usersFromServer.map(person => (
                <a
                  data-cy="FilterAllUsers"
                  href="#/"
                  onClick={isActive}
                  key={person.id}
                >
                  {person.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={productSearch}
                  onChange={handleChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {productSearch
                && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleDelete}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>

              {visibleProducts.map(product => {
                return (
                  <>
                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{ product.name}</td>

                      {preparedCategories.map(category => {
                        return (
                          product.categoryId === category.id && (
                            <>
                              <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                              <td
                                data-cy="ProductUser"
                                className={category.user?.sex === 'f'
                                  ? 'has-text-danger'
                                  : 'has-text-link'}
                              >
                                {category.user?.name}
                              </td>
                            </>
                          )
                        );
                      })}
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
