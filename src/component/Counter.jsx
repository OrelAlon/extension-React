import "./counter.css";

const Counter = ({ counter }) => {
  return (
    <>
      <span>Count Websites visit:</span> <a>{counter}</a>
    </>
  );
};

export default Counter;
