import React from 'react';

export default function ReactComp(props) {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      Hello from React!!!
      <br/>
      <button onClick={() => setCount(count - 1)}>-</button>{' '}{count}{' '}<button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};