import React from 'react';

function Counter({ count, decrement, increment }) {
  return (
    <div>
      <button onClick={decrement}>
        -
      </button>{' '}
      {count}
      {' '}<button onClick={increment}>
        +
      </button>
    </div>
  );
}

export default function ReactComp(props) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log('mounted', props);
    return () => {
      console.log('unmounted')
    }
  }, [])

  return (
    <div>
      Hello from React!!!
      <br/>
      <Counter count={count} increment={() => setCount(count + 1)} decrement={() => setCount(count - 1)} />
      <br/>
      Count from angular: 
      <Counter count={props.count} increment={props.onInc} decrement={props.onDec} />
    </div>
  );
};