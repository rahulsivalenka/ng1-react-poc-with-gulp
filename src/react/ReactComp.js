import React from 'react';

export default function ReactComp(props) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    console.log('mounted')
    return () => {
      console.log('unmounted')
    }
  }, [])

  return (
    <div>
      Hello from React!!!
      <br/>
      <button onClick={() => setCount(count - 1)}>-</button>{' '}{count}{' '}<button onClick={() => setCount(count + 1)}>+</button>
      <br/>
      Count from angular: {props.count}
    </div>
  );
};