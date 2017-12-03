import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Loader.scss';

const Loader = ({ showLoader }) => {
  if (!showLoader) return <div />;

  return (
    <div className={styles.loader}>
      <i className="fa fa-life-ring fa-spin" aria-hidden="true" />
    </div>
  );
};

Loader.propTypes = {
  showLoader: PropTypes.bool,
};

export default connect(state => ({ showLoader: state.loader.show }), {})(Loader);
