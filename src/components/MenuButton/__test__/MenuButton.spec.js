import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import MenuButton from '../MenuButton';

const defaultProps = {
  label: 'some label',
  link: '/somwhere/in/the/world',
  iconSrc: 'skull',
  onClick: () => {},
};

describe('components/MenuButton', () => {
  const setup = (props = defaultProps) => shallow(<MenuButton {...props} />);

  it('should render MenuButton component', () => {
    const wrapper = setup();

    expect(wrapper.length).to.equal(1);
  });

  it('should render Link component when props has \'link\'', () => {
    const wrapper = setup();

    expect(wrapper.find('Link').length).to.equal(1);
    expect(wrapper.find('button').length).to.equal(0);
  });

  it('should render button when props doesn\'t has \'link\'', () => {
    const wrapper = setup({ ...defaultProps, link: '' });

    expect(wrapper.find('button').length).to.equal(1);
    expect(wrapper.find('Link').length).to.equal(0);
  });

  it('should trigger onClick callback prop', () => {
    const onClickSpy = sinon.spy();
    const wrapper = setup({ ...defaultProps, link: '', onClick: onClickSpy });
    const button = wrapper.find('button');

    expect(button.length).to.equal(1);
    button.simulate('click');
    expect(onClickSpy).to.have.property('callCount', 1);
  });
});
