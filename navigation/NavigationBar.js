import React, { Component } from 'react';
import _ from 'lodash';

import { NavigationBarView } from './NavigationBarView';
import { DriverShape } from '@shoutem/animation';
import { connectStyle } from '@shoutem/theme';

/** @constant string NavigationBarStyleName
 * Both NavigationBar and NavigationBarView are connected to style with same name because
 * they represent same component. If NavigationBar is not connected to style then it can not be
 * customized on the screen. Further more, if NavigationBarView is not connected to style then
 * navigation bar does not have default style when not NavigationBar not passed to the screen.
 * On the end we want to style a same component with same name in the theme no matter on
 * internal implementation.
 */
export const NavigationBarStyleName = 'shoutem.ui.navigation.NavigationBar';

/**
 * A NavigationBar component that can be used to define
 * the global NavigationBar props. This component has no
 * UI, it only servers as a communication channel for
 * dispatching props to the global navigation bar.
 */
class NavigationBar extends Component {
  static View = NavigationBarView;

  static propTypes = {
    ...NavigationBarView.propTypes,
    /**
     * If `true`, the navigation bar will not be rendered.
     */
    hidden: React.PropTypes.bool,
    /**
     * Use the child navigation bar instead, if `true`
     * the parent navigation bar will be hidden, and
     * the navigation bar props will be merged with the
     * props of the child navigation bar instead.
     */
    child: React.PropTypes.bool,
  };

  static contextTypes = {
    animationDriver: DriverShape,
    getScene: React.PropTypes.func.isRequired,
    setNextNavBarProps: React.PropTypes.func.isRequired,
    clearNavBarProps: React.PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.setNextNavBarProps(props);
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEqual(nextProps, this.props)) {
      return;
    }

    this.setNextNavBarProps(nextProps);
  }

  componentWillUnmount() {
    // The parent screen is being unmounted, we can cleanup now
    const { getScene, clearNavBarProps } = this.context;
    const scene = getScene();
    clearNavBarProps(scene.route);
  }

  setNextNavBarProps(props) {
    const { getScene, animationDriver, setNextNavBarProps } = this.context;
    const scene = getScene();
    setNextNavBarProps(scene.route, {
      driver: animationDriver,
      ...props,
    });
  }

  render() {
    return null;
  }
}

const StyledNavigationBar = connectStyle(NavigationBarStyleName)(NavigationBar);

export {
   StyledNavigationBar as NavigationBar,
};
