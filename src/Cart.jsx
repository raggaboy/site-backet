import './App.css';
import './App.mobile.css';

export default function Cart({ cart, setIsOpenCart, isOpenCart, setCart }) {
  const closeCart = () => {
    setIsOpenCart(!isOpenCart);
  };

  const removeFromCart = async (hit) => {
    let tmp = cart.filter((item) => item.objectID !== hit.objectID);
    setCart(tmp);
    localStorage.setItem('cart', JSON.stringify(tmp));
  };

  return (
    <div className="cart-lauyout">
      <div
        className="cross-wrapper"
        onClick={() => {
          closeCart();
        }}
      >
        <div className="cross"></div>
      </div>
      <h1 style={{ lineHeight: '40px', marginBottom: '20px' }}>Cart</h1>
      {cart.length > 0 && (
        <div className="card-items">
          {cart.map((item) => (
            <div className="card-item-layout">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{ backgroundImage: `url(${item.image})` }}
                  className="cart-image"
                ></div>
              </div>
              <div className="card-item-descs">
                <span>
                  <b>Brand: </b>
                  {item.brand}
                </span>
                <span className="elipsis">
                  <b>Description: </b>
                  {item.description}
                </span>
                <span>
                  <b>Type: </b>
                  {item.type}
                </span>
              </div>
              <div className="cart-item-other">
                <span>${item.price}</span>
                <button
                  className="cart-button"
                  onClick={() => removeFromCart(item)}
                  style={{
                    backgroundColor: 'red',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length === 0 && (
        <h2>Cart is empty!</h2>
      )}
    </div>
  );
}
