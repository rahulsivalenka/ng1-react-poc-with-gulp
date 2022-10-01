import react2angular from './react2angular';
import ReactComp from './ReactComp';

const components = {
  reactComp: [ReactComp, ['count', 'onInc', 'onDec']]
}

export default function registerComponents(app) {
  Object.entries(components).forEach(([name, [comp, bindings, deps]]) => {
    app.component(name, react2angular(comp, bindings, deps));
  })
}
