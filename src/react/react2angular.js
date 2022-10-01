// Ref: https://github.com/coatue-oss/react2angular
// port to non typescript file as jspm install fails with @types

import assign from 'lodash.assign';
import fromPairs from 'lodash.frompairs';
import mapValues from 'lodash.mapvalues';
import some from 'lodash.some';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

class NgComponent {
  constructor() {
    this.__isFirstRender = true
    this.state = {}
    this.props = {}
  }

  $onChanges(changes) {
    const oldProps = this.props

    // TODO: fix Lodash typings upstream
    const newProps = mapValues(changes, 'currentValue')

    // TODO: implement nextState (which also means implement this.setState)
    const nextProps = assign({}, this.props, newProps)

    if (this.__isFirstRender) {
      assign(this, { props: nextProps })
      this.componentWillMount()
      this.render()
      this.__isFirstRender = false
    } else {
      if (!this.didPropsChange(newProps, oldProps)) return
      this.componentWillReceiveProps(nextProps)
      const shouldUpdate = this.shouldComponentUpdate(nextProps, this.state)
      assign(this, { props: nextProps })
      if (!shouldUpdate) return

      this.componentWillUpdate(this.props, this.state)
      this.render()
      this.componentDidUpdate(this.props, this.state)
    }
  }

  $postLink() {
    this.componentDidMount()
  }

  $onDestroy() {
    this.componentWillUnmount()
  }

  didPropsChange(newProps, oldProps) {
    return some(newProps, (v, k) => v !== oldProps[k])
  }

  /*
    lifecycle hooks
  */
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(_props) { }
  shouldComponentUpdate(_nextProps, _nextState) { return true }
  componentWillUpdate(_props, _state) {}
  componentDidUpdate(_props, _state) {}
  componentWillUnmount() {}
  render() {}
}

function react2angular(
  Class,
  bindingNames = null,
  injectNames = []
) {
  const names = bindingNames
    || (Class.propTypes && Object.keys(Class.propTypes))
    || []

  return {
    bindings: fromPairs(names.map(_ => [_, '<'])),
    controller: ['$element', ...injectNames, class extends NgComponent {
      static get $$ngIsClass() {
        return true
      }
      
      constructor($element, ...injectedProps) {
        super()
        this.isDestroyed = false
        this.$element = $element
        this.injectedProps = {}
        injectNames.forEach((name, i) => {
          this.injectedProps[name] = injectedProps[i]
        })
      }
      render() {
        if (!this.isDestroyed) {
          render(
            <Class {...this.props} {...this.injectedProps} />,
            this.$element[0]
          )
        }
      }
      componentWillUnmount() {
        this.isDestroyed = true
        unmountComponentAtNode(this.$element[0])
      }
    }]
  }
}



export default react2angular;