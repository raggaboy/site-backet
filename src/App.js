import React, { useEffect, useRef, useState } from 'react';
import {
  InstantSearch,
  HierarchicalMenu,
  RefinementList,
  SortBy,
  Pagination,
  ClearRefinements,
  Highlight,
  Hits,
  HitsPerPage,
  Panel,
  Configure,
  SearchBox,
  Snippet,
  ToggleRefinement,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import {
  ClearFiltersMobile,
  PriceSlider,
  NoResults,
  Ratings,
  ResultsNumberMobile,
  SaveFiltersMobile,
} from './widgets';
import { formatNumber } from './utils';
import './Theme.css';
import './App.css';
import './App.mobile.css';
import './widgets/Pagination.css';
import Cart from './Cart';

const searchClient = algoliasearch(
  'ASPSO7FUGC',
  'ea1a5537f34b8cc404b94c23946bacc7'
);

const Hit = ({ hit, cart, setCart }) => {
  const addToCart = async (value) => {
    let oldCart = localStorage.getItem('cart');
    oldCart = await JSON.parse(oldCart);
    setCart([...cart, value]);
    localStorage.setItem('cart', JSON.stringify([...oldCart, value]));
  };

  const removeFromCart = async (hit) => {
    let tmp = cart.filter((item) => item.objectID !== hit.objectID);
    setCart(tmp);
    localStorage.setItem('cart', JSON.stringify(tmp));
  };

  const isInCard = () => {
    const isItemInCard = cart.find((item) => {
      if (item.objectID === hit.objectID) {
        return item;
      }
    });

    return isItemInCard !== undefined ? true : false;
  };

  return (
    <article className="hit">
      <header className="hit-image-container">
        <img src={hit.image} alt={hit.name} className="hit-image" />
      </header>

      <div className="hit-info-container">
        <p className="hit-category">{hit.categories[0]}</p>
        <h1>
          <Highlight attribute="name" tagName="mark" hit={hit} />
        </h1>
        <p className="hit-description">
          <Snippet attribute="description" tagName="mark" hit={hit} />
        </p>

        <footer>
          <p>
            <span className="hit-em">$</span>{' '}
            <strong>{formatNumber(hit.price)}</strong>{' '}
            <span className="hit-em hit-rating">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 16 16"
              >
                <path
                  fill="#e2a400"
                  fillRule="evenodd"
                  d="M10.472 5.008L16 5.816l-4 3.896.944 5.504L8 12.616l-4.944 2.6L4 9.712 0 5.816l5.528-.808L8 0z"
                />
              </svg>{' '}
              {hit.rating}
            </span>
            <button
              className="add-to-cart-button"
              onClick={() =>
                isInCard() === false ? addToCart(hit) : removeFromCart(hit)
              }
              style={{
                backgroundColor: isInCard() === false ? 'orange' : 'red',
              }}
            >
              {isInCard() === false ? 'Add to cart' : 'Remove'}
            </button>
          </p>
        </footer>
      </div>
    </article>
  );
};

const App = (props) => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [isOpenCart, setIsOpenCart] = useState(false);

  function openFilters() {
    document.body.classList.add('filtering');
    window.scrollTo(0, 0);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('click', onClick);
  }

  function closeFilters() {
    document.body.classList.remove('filtering');
    containerRef.current.scrollIntoView();
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('click', onClick);
  }

  function onKeyUp(event) {
    if (event.key !== 'Escape') {
      return;
    }

    closeFilters();
  }

  function onClick(event) {
    if (event.target !== headerRef.current) {
      return;
    }

    closeFilters();
  }

  const [cart, setCart] = useState([]);

  async function getCartData() {
    const isCard = localStorage.getItem('cart');
    if (isCard === null) {
      localStorage.setItem('cart', JSON.stringify([]));
    } else {
      const oldCard = await JSON.parse(isCard);
      setCart(oldCard);
    }
  }

  useEffect(() => {
    getCartData();
  }, []);

  const openCart = () => {
    setIsOpenCart(!isOpenCart);
  };

  return (
    <>
      {!isOpenCart ? (
        <InstantSearch
          searchClient={searchClient}
          indexName="test"
          searchState={props.searchState}
          createURL={props.createURL}
          onSearchStateChange={props.onSearchStateChange}
        >
          <header className="header" ref={headerRef}>
            <div className="cart-wrapper" onClick={() => {openCart()}}>
              <div className="cart"></div>
              <span className="cart-count">{cart.length}</span>
            </div>
            <p className="header-title">Stop looking for an item — find it.</p>

            <SearchBox
              translations={{
                placeholder: 'Product, brand, description, …',
              }}
              submit={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                >
                  <g
                    fill="none"
                    fillRule="evenodd"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.67"
                    transform="translate(1 1)"
                  >
                    <circle cx="7.11" cy="7.11" r="7.11" />
                    <path d="M16 16l-3.87-3.87" />
                  </g>
                </svg>
              }
            />
          </header>

          <Configure
            attributesToSnippet={['description:10']}
            snippetEllipsisText="…"
            removeWordsIfNoResults="allOptional"
          />

          <main className="container" ref={containerRef}>
            <div className="container-wrapper">
              <section className="container-filters" onKeyUp={onKeyUp}>
                <div className="container-header">
                  <h2>Filters</h2>

                  <div className="clear-filters" data-layout="desktop">
                    <ClearRefinements
                      translations={{
                        reset: (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="11"
                              viewBox="0 0 11 11"
                            >
                              <g fill="none" fillRule="evenodd" opacity=".4">
                                <path d="M0 0h11v11H0z" />
                                <path
                                  fill="#000"
                                  fillRule="nonzero"
                                  d="M8.26 2.75a3.896 3.896 0 1 0 1.102 3.262l.007-.056a.49.49 0 0 1 .485-.456c.253 0 .451.206.437.457 0 0 .012-.109-.006.061a4.813 4.813 0 1 1-1.348-3.887v-.987a.458.458 0 1 1 .917.002v2.062a.459.459 0 0 1-.459.459H7.334a.458.458 0 1 1-.002-.917h.928z"
                                />
                              </g>
                            </svg>
                            Clear filters
                          </>
                        ),
                      }}
                    />
                  </div>

                  <div className="clear-filters" data-layout="mobile">
                    <ResultsNumberMobile />
                  </div>
                </div>

                <div className="container-body">
                  <Panel header="Category">
                    <HierarchicalMenu
                      attributes={[
                        'hierarchicalCategories.lvl0',
                        'hierarchicalCategories.lvl1',
                      ]}
                    />
                  </Panel>

                  <Panel header="Brands">
                    <RefinementList
                      attribute="brand"
                      searchable={true}
                      translations={{
                        placeholder: 'Search for brands…',
                      }}
                    />
                  </Panel>

                  <Panel header="Price">
                    <PriceSlider attribute="price" />
                  </Panel>

                  <Panel header="Free shipping">
                    <ToggleRefinement
                      attribute="free_shipping"
                      label="Display only items with free shipping"
                      value={true}
                    />
                  </Panel>
                </div>
              </section>

              <footer className="container-filters-footer" data-layout="mobile">
                <div className="container-filters-footer-button-wrapper">
                  <ClearFiltersMobile containerRef={containerRef} />
                </div>

                <div className="container-filters-footer-button-wrapper">
                  <SaveFiltersMobile onClick={closeFilters} />
                </div>
              </footer>
            </div>

            <section className="container-results">
             {/* <header className="container-header container-options">
                <SortBy
                  className="container-option"
                  defaultRefinement="test"
                  items={[
                    {
                      label: 'Sort by featured',
                      value: 'test',
                    },
                    {
                      label: 'Price ascending',
                      value: 'test_price_asc',
                    },
                    {
                      label: 'Price descending',
                      value: 'test_price_desc',
                    },
                  ]}
                />

                <HitsPerPage
                  className="container-option"
                  items={[
                    {
                      label: '16 hits per page',
                      value: 16,
                    },
                    {
                      label: '32 hits per page',
                      value: 32,
                    },
                    {
                      label: '64 hits per page',
                      value: 64,
                    },
                  ]}
                  defaultRefinement={16}
                /> 
              </header> */}

              <Hits
                hitComponent={(hit) => (
                  <Hit hit={hit.hit} cart={cart} setCart={setCart} />
                )}
              />
              <NoResults />

              <footer className="container-footer">
                <Pagination
                  padding={2}
                  showFirst={false}
                  showLast={false}
                  translations={{
                    previous: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="#000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.143"
                        >
                          <path d="M9 5H1M5 9L1 5l4-4" />
                        </g>
                      </svg>
                    ),
                    next: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                      >
                        <g
                          fill="none"
                          fillRule="evenodd"
                          stroke="#000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.143"
                        >
                          <path d="M1 5h8M5 9l4-4-4-4" />
                        </g>
                      </svg>
                    ),
                  }}
                />
              </footer>
            </section>
          </main>

          <aside data-layout="mobile">
            <button
              className="filters-button"
              data-action="open-overlay"
              onClick={openFilters}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 14">
                <path
                  d="M15 1H1l5.6 6.3v4.37L9.4 13V7.3z"
                  stroke="#fff"
                  strokeWidth="1.29"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Filters
            </button>
          </aside>
        </InstantSearch>
      ) : (
        <Cart isOpenCart = {isOpenCart} setIsOpenCart = {setIsOpenCart} cart = {cart} setCart = {setCart}/>
      )}
    </>
  );
};

export default App;
