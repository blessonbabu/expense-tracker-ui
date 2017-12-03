import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Link from '../Link';

const defaultProps = {
  label: 'some label',
  to: '/somwhere/in/the/world',
};

describe('components/Link', () => {
  const setup = (props = defaultProps) => shallow(<Link {...props} />);

  it('should render Link component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render LinkTo component when props has \'link\'', () => {
    const wrapper = setup();

    expect(wrapper.find('a').length).to.equal(0);
  });

  it('should render anchor tag when props has \'http link\'', () => {
    const wrapper = setup({ ...defaultProps, to: 'https://github.com/' });

    expect(wrapper.find('a').length).to.equal(1);
    expect(wrapper.find('LinkTo').length).to.equal(0);
  });
});
