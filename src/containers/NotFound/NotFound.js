import React from 'react';
import classnames from 'classnames';
import { MenuButton } from 'components';
import styles from './NotFound.scss';
import { appRoutes } from 'config';

const redirectPage = () => {
	window.location.assign(appRoutes.profile.link);
}
export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <h1>404!</h1>
      <i className={classnames(styles.notFound, 'fa fa-frown-o')} aria-hidden="true" />
      <p>The page you are looking for no longer exist!</p>
      <div className={styles.buttonContainer}>
       <MenuButton label="Go back to Home Page" type="submit" className={styles.loginBtn} onClick={redirectPage}/>
      </div>
    </div>
  );
}
