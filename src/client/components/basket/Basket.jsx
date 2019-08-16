import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BasketItem from './BasketItem';
import BasketToggle from './BasketToggle';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

import { 
  removeFromBasket, 
  clearBasket, 
  addQtyItem,
  minusQtyItem
} from '../../actions/basketActions';
import { displayMoney } from '../../helpers/utils';

const Basket = (props) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { basket, action, isAuth } = props;
  const calculateTotal = () => {
    let total = 0;

    if (basket.length !== 0) {
      const result = basket.map(product => product.price * product.quantity).reduce((a, b) => a + b);
      total = result.toFixed(2);
    }

    return displayMoney(total);
  };

  const onOpenModal = () => {
    setModalOpen(true);
  };

  const onCloseModal = () => {
    setModalOpen(false);
  };

  const onCheckOut = () => {
    if (basket.length !== 0 && isAuth) {
      props.history.push('/checkout');
      alert('Authenticated');
    } else {
      onOpenModal();
    }
  };

  const onSignInClick = () => {
    onCloseModal();
    document.body.classList.remove('basket-open');
    props.history.push('/signin');
  };

  return (
    <>
      <Modal 
          isOpen={isModalOpen}
          onRequestClose={onCloseModal}
      >
        <p>You must sign in to continue checking out</p>
        <div className="d-flex-center">
          <button 
              className="button button-border button-border-gray button-small"
              onClick={onCloseModal}
          >
            Got It
          </button>
          &nbsp;
          <button 
              className="button button-small"
              onClick={onSignInClick}
          >
            Sign In
          </button>
        </div>
      </Modal>
      <div className="basket">
        <div className="basket-list">
          <div className="basket-header">
            <h3 className="basket-header-title">
              My Basket &nbsp; 
              <span>({` ${basket.length} ${basket.length > 1 ? 'items' : 'item'}`})</span>
            </h3>
            <BasketToggle>
              {({ onClickToggle }) => (
                <span 
                    className="basket-toggle button button-border button-border-gray button-small" 
                    onClick={onClickToggle}
                >
                  Close
                </span>
              )}
            </BasketToggle>
            <Button
                className="basket-clear button button-border button-border-gray button-small"
                onClick={action.clearBasket}
            >
              <span>Clear Basket</span>
            </Button>
          </div>
          {basket.length <= 0 && (
            <div className="basket-empty">
              <h5 className="basket-empty-msg">Your basket is empty</h5>
            </div> 
          )}
          {basket.map(product => (
            <BasketItem 
                key={product.id}
                product={product}
                basket={basket}
                action={action}
                removeFrombasket={action.removeFromBasket}
            />
          ))}
        </div>
        <div className="basket-checkout">
          <div className="basket-total">
            <p className="basket-total-title">Total Amout:</p>
            <h2 className="basket-total-amount">{calculateTotal()}</h2>
          </div>
          <button 
              className="basket-checkout-button button"
              disabled={basket.length === 0}
              onClick={onCheckOut}
          >
            Check Out
          </button>
        </div>
        
      </div>
    </>
  );
};

const mapStateToProps = ({ basket, auth }) => ({
  basket,
  isAuth: !!auth.id && !!auth.type
});

const mapDispatchToProps = dispatch => ({
  action: {
    removeFromBasket: id => dispatch(removeFromBasket(id)),
    clearBasket: () => dispatch(clearBasket()),
    addQtyItem: id => dispatch(addQtyItem(id)),
    minusQtyItem: id => dispatch(minusQtyItem(id))
  }
});
 
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Basket));
