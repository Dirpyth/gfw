import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Button from 'components/ui/button';
import Loader from 'components/ui/loader';

import './styles.scss';

class Submit extends PureComponent {
  static propTypes = {
    valid: PropTypes.bool,
    submitting: PropTypes.bool,
    submitFailed: PropTypes.bool,
    children: PropTypes.node
  };

  render() {
    const { valid, submitting, children, submitFailed } = this.props;

    return (
      <div className="c-form-submit">
        {!valid && submitFailed && <span>Required fields are empty!</span>}
        <Button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? <Loader className="submit-loader" /> : children}
        </Button>
      </div>
    );
  }
}

export default Submit;
